import { UserDao } from "../../mongodb/dao/user.dao";
import { User } from '../../mongodb/model/user.model';
import { MESSAGE, USER_ROLE } from '../utility/constant/constant';
import { printErrorLog } from '../utility/logger';
import passport from 'passport';
import { RedisUtility } from "../../redis/utility/redis.utility";
import { UserResponseDTO } from "../utility/dto/userResponse.dto";
import { JwtHandler } from "../utility/jwt.handler";
import { NodeMailerService } from "../utility/nodemailer.service";
import { UserSessionUtility } from "../utility/userSession.utility";

export class AuthService {

    userDao: UserDao;
    redisUtility: RedisUtility;
    jwtHandler: JwtHandler;
    nodeMailerService: NodeMailerService;
    userSessionUtility: UserSessionUtility;

    constructor() {
        this.userDao = new UserDao();
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.logout = this.logout.bind(this);
        this.test = this.test.bind(this);
        this.sendMailToVerifyEmail = this.sendMailToVerifyEmail.bind(this);
        this.confirmEmail = this.confirmEmail.bind(this);
        this.redisUtility = new RedisUtility();
        this.jwtHandler = new JwtHandler();
        this.nodeMailerService = new NodeMailerService();
        this.userSessionUtility = new UserSessionUtility();
    }

    public async test(req: any, res: any) {
        try {
            res.status(200).json({ testing: "OK" });
        }
        catch (err) {
            printErrorLog("AuthService", "test", err);
            res.status(401).json({ message: MESSAGE.SERVER_ERROR });
        }
    }

    public async register(req: any, res: any, next: any) {
        try {
            let user = req.body.user;

            if (user == undefined) {
                return res.status(400).json({ message: MESSAGE.INVALID_DATA });
            }
            let email = user.email;
            let username = user.username;
            let result = await this.userDao.findByUserNameOrEmail(username, email);

            if (!result) {
                let userData: any = {
                    email: user.email,
                    username: user.username,
                    role: [USER_ROLE.STUDENT],
                    fullname: user.fullname,
                    password: user.password
                };

                let data = await this.userDao.saveNewUser(new User(userData));
                return res.status(200).json(new UserResponseDTO(data));
            }
            else {
                return res.status(301).json({ message: MESSAGE.USER_ALREADY_EXIST });
            }
        }
        catch (err) {
            printErrorLog("AuthService", "register", err);
            next(err);
        }
    }

    public async login(req: any, res: any, next: any) {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                printErrorLog("AuthService", "login", err);
                return next(err);
            }

            if (!user) {
                return res.status(info.status).json(info.message);
            }

            req.logIn(user, (err: Error) => {
                if (err) {
                    printErrorLog("AuthService", "login", err);
                    return next(err);
                }

                return res.status(200).json(new UserResponseDTO(req.user));
            });
        })(req, res, next);
    }

    public async logout(req: any, res: any, next: any) {
        try {
            let username: any = null;
            if (!req.user) {
                return res.status(200).json({ status: true });
            }
            else {
                username = req.user.username;
            }
            req.logout();
            req.session.destroy(async (err: any) => {
                if (err) {
                    return next(err);
                }
                await this.redisUtility.deleteDataByKey('login_' + username + '_' + req.sessionID);
                return res.status(200).json({ status: true });
            });
        }
        catch (err) {
            printErrorLog("AuthService", "logout", err);
            return next(err);
        }
    }

    async sendMailToVerifyEmail(req: any, res: any, next: any) {
        try {
            let user = req.user;
            if (user.isEmailVerified == true) {
                return res.status(201).json({ status: false, message: "Mail is already verified" });
            }
            else if (!user.email) {
                return res.status(201).json({ status: false, message: "Mail not found" });
            }
            let payload = { _id: user._id, email: user.email };
            let token = this.jwtHandler.generateToken(payload, { expiresIn: "10m" });
            let sendFrom = "try.and.test@outlook.com", sendTo = user.email, subject = "please verify your email within 10 min.", body = `http://172.17.0.4:9000/api/confirm-email/${token}`;
            let result = await this.nodeMailerService.sendMail(sendFrom, sendTo, subject, body);
            res.status(200).json({ status: true, message: result });
        } catch (err) {
            printErrorLog("AuthService", "sendMailToVerifyEmail", err);
            return next(err);
        }
    }

    async confirmEmail(req: any, res: any, next: any) {
        try {
            let token = req.params.token;
            let decodedData: any = this.jwtHandler.verifyToken(token);
            console.log("decodedData", decodedData);
            if (decodedData != MESSAGE.INVALID_TOKEN) {
                let user = await this.userDao.updateUserField(decodedData._id, { isEmailVerified: true });
                await this.userSessionUtility.updateSessionData(user);
                res.status(200).send("<h1>Token is verified</h1>");
            }
            else {
                res.status(401).send("<h1>Token is not verified</h1>");
            }
        } catch (err) {
            printErrorLog("AuthService", "confirmEmail", err);
            return next(err);
        }
    }
}