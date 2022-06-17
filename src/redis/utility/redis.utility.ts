'use strict'
import { MESSAGE } from "../../app/utility/constant/constant";
import { printErrorLog } from "../../app/utility/logger";
import { redisClient } from "../config/redis.config";

export class RedisUtility {
    constructor() { }

    public async getDataByKey(key: string | number) {
        try {
            let result = await redisClient.get(key);
            if (!result) {
                return false;
            }
            return JSON.parse(result);
        } catch (err) {
            printErrorLog("RedisUtility", "getDataByKey", err);
            throw { status: 500, message: MESSAGE.SERVER_ERROR };
        }
    }

    public async setDataByKey(key: string | number, value: any) {
        try {
            await redisClient.set(key, JSON.stringify(value));
        } catch (err) {
            printErrorLog("RedisUtility", "setDataByKey", err);
            throw { status: 500, message: MESSAGE.SERVER_ERROR };
        }
    }

    public async deleteDataByKey(key: any) {
        try {
            await redisClient.del(key);
        } catch (err) {
            printErrorLog("RedisUtility", "deleteDataByKey", err);
            throw { status: 500, message: MESSAGE.SERVER_ERROR };
        }
    }

    public async getDataByKeyPattern(key: string | number) {
        try {
            let result = await redisClient.keys(key);
            if (result && result.length) {
                return result;
            }
            return false;
        } catch (err) {
            printErrorLog("RedisUtility", "getDataByKeyPattern", err);
            throw { status: 500, message: MESSAGE.SERVER_ERROR };
        }
    }

    public async deleteDataByKeyPattern(key: string) {
        try {
            let values: any = await this.getDataByKeyPattern(key);
            if (values && values.length) {
                return this.deleteDataByKey(values);
            }
            else {
                return true;
            }
        } catch (err) {
            printErrorLog("RedisUtility", "deleteDataByKeyPattern", err);
            throw { status: 500, message: MESSAGE.SERVER_ERROR };
        }
    }

    public async getMultiDataByMultiKey(key: any) {
        try {
            let result = await redisClient.mget(key);
            if (result && result.length) {
                result = result.map((obj: any) => JSON.parse(obj));
                return result;
            }
            else {
                return false;
            }
        } catch (err) {
            printErrorLog("RedisUtility", "getMultiDataByMultiKey", err);
            throw { status: 500, message: MESSAGE.SERVER_ERROR };
        }
    }

    public async setExpiry(key: any, seconds: number) {
        try {
            let result = await redisClient.get(key);
            await redisClient.set(key, result, 'ex', seconds);
        } catch (err) {
            printErrorLog("RedisUtility", "setExpiry", err);
            throw { status: 500, message: MESSAGE.SERVER_ERROR };
        }
    }

    public async setDataAndExpiry(key: any, data: any, seconds: any) {
        try {
            await redisClient.set(key, JSON.stringify(data), 'ex', seconds);
        } catch (err) {
            printErrorLog("RedisUtility", "setDataAndExpiry", err);
            throw { status: 500, message: MESSAGE.SERVER_ERROR };
        }
    }

    public async getTtl(key: any) {
        try {
            return redisClient.ttl(key);
        } catch (err) {
            printErrorLog("RedisUtility", "setDataAndExpiry", err);
            throw { status: 500, message: MESSAGE.SERVER_ERROR };
        }
    }
}