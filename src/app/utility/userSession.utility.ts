import { RedisUtility } from "../../redis/utility/redis.utility";
import { UserSessionDTO } from "./dto/userSession.dto";
import { printErrorLog } from "./logger";
const LOGIN_KEY_PREFIX = 'login_';

export class UserSessionUtility {
    redisUtility: RedisUtility;

    constructor() {
        this.redisUtility = new RedisUtility();
    }

    async setUserDataToRedisStore(key: any, data: any) {
        try {
            await this.redisUtility.setDataByKey(key, data);
        } catch (err) {
            printErrorLog("UserSessionUtility", "setUserDataToRedisStore", err);
            throw err;
        }
    }

    async userSessionCount(username: any) {
        try {
            let key = LOGIN_KEY_PREFIX + username + "_*";
            let users: any = await this.redisUtility.getDataByKeyPattern(key);
            if (users && users.length) {
                return users.length;
            }
            else {
                return 0;
            }
        } catch (err) {
            printErrorLog("UserSessionUtility", "userSessionCount", err);
            throw err;
        }
    }

    async deleteLeastRecentlyData() {
        try {

        } catch (err) {
            printErrorLog("UserSessionUtility", "deleteLeastRecentlyData", err);
            throw err;
        }
    }

    async deleteFromAllSession(username: any) {
        try {
            let key = LOGIN_KEY_PREFIX + username + "_*";
            let sessionKeys: any = await this.redisUtility.getDataByKeyPattern(key);
            let sessions: any = await this.redisUtility.getMultiDataByMultiKey(sessionKeys);
            sessions = sessions.map((obj: any) => "sess:" + obj.sessionId);
            let fun1 = this.redisUtility.deleteDataByKey(sessions);
            let fun2 = this.redisUtility.deleteDataByKeyPattern(key);
            return Promise.all([fun1, fun2]);
        } catch (err) {
            printErrorLog("UserSessionUtility", "deleteFromAllSession", err);
            throw err;
        }
    }

    async resetUserSessionExpiry(key: any, seconds: number) {
        try {
            this.redisUtility.setExpiry(key, seconds);
        } catch (err) {
            printErrorLog("UserSessionUtility", "resetUserSessionExpiry", err);
            throw err;
        }
    }

    async updateSessionData(user: any) {
        try {
            let sessionUser = new UserSessionDTO(user);
            let keyPattern = LOGIN_KEY_PREFIX + sessionUser.username + "_*";
            let sessionKeys: any = await this.redisUtility.getDataByKeyPattern(keyPattern);
            let ttls = await Promise.all(sessionKeys.map((s: any) => this.redisUtility.getTtl(s)));
            return Promise.all(sessionKeys.map((s: any, i: number) => this.redisUtility.setDataAndExpiry(s, sessionUser, ttls[i])));
        } catch (err) {
            printErrorLog("UserSessionUtility", "updateSessionData", err);
            throw err;
        }
    }
}