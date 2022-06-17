import { RedisUtility } from "../../redis/utility/redis.utility";
import * as local from "passport-local";
import { MESSAGE } from "../utility/constant/constant";
import * as bcrypt from 'bcrypt';
import { UserDao } from "../../mongodb/dao/user.dao";
import { UserSessionDTO } from "../utility/dto/userSession.dto";
import { UserSessionUtility } from "../utility/userSession.utility";

const redisUtility = new RedisUtility();
const userDao = new UserDao();
const LOGIN_KEY_PREFIX = 'login_';
const userSessionUtility = new UserSessionUtility();
const SESSION = JSON.parse(process.env.SESSION as string);
const COOKIE_TIMEOUT_SEC = SESSION.COOKIE_TIMEOUT_SEC;
const SESSION_MAX_LIMIT = SESSION.SESSION_MAX_LIMIT;

async function verifyLoginCredential(username: any, password: any) {
    try {
        let result: any = {};
        let userDetails = await userDao.findOneByUserName(username);
        if (userDetails == MESSAGE.NO_DATA_FOUND) {
            result = { status: 403, message: "wrong username or password" };
            throw result;
        }
        else if (userDetails == MESSAGE.DATABASE_ERROR) {
            result = { status: 500, message: "internal error" };
            throw result;
        }

        let status = bcrypt.compareSync(password, userDetails.password);
        if (status) {
            if (!userDetails.isUserActivated) {
                throw { status: 401, message: "account is deactivated" };
            }
            return userDetails;
        }
        else {
            throw { status: 403, message: "wrong username or password" };
        }
    } catch (err) {
        console.log("err", err);
        throw err;
    }
}

export const passportConfig = (passport: any, tokenService?: any) => {

    passport.serializeUser(async (user: any, done: any) => {
        return done(null, { sessionId: user.sessionId, username: user.username });
    });

    passport.deserializeUser(async (sessionUser: any, done: any) => {
        if (!sessionUser || !sessionUser.username) {
            return done(null, false);
        }
        let redisKey = LOGIN_KEY_PREFIX + sessionUser.username + '_' + sessionUser.sessionId;
        let storedUserDetails = await redisUtility.getDataByKey(redisKey);
        if (storedUserDetails) {
            userSessionUtility.resetUserSessionExpiry(redisKey, COOKIE_TIMEOUT_SEC);
            return done(null, storedUserDetails);
        }
        return done(null, false);
    });

    passport.use("local", new local.Strategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
        async (req: any, username, password, done) => {
            try {
                let userData = await verifyLoginCredential(username, password);
                let userDetails: UserSessionDTO = new UserSessionDTO(userData);
                let userSessionCount = 0;
                if (req.body.forcedLogin) {
                    await userSessionUtility.deleteFromAllSession(userDetails.username);
                }
                else {
                    userSessionCount = await userSessionUtility.userSessionCount(userDetails.username);
                }

                if (userSessionCount >= SESSION_MAX_LIMIT) {
                    throw { message: "Active session exceeding limit", status: 406 };
                }

                userDetails.setUserSessionId(req.sessionID);
                let redisKey = LOGIN_KEY_PREFIX + userDetails.username + '_' + req.sessionID;
                await redisUtility.setDataAndExpiry(redisKey, userDetails, COOKIE_TIMEOUT_SEC);
                return done(null, userDetails);
            } catch (err: any) {
                done(null, false, err);
            }
        }
    ));
}
