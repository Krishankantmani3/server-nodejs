import session from "express-session";
import { redisClient } from "../../redis/config/redis.config";
var RedisStore = require('connect-redis')(session);

const SESSION = JSON.parse(process.env.SESSION as string);
const SESSION_COOKIE_SECRET = SESSION.COOKIE_SECRET;
const COOKIE_TIMEOUT_SEC = SESSION.COOKIE_TIMEOUT_SEC;
const SESSION_COOKIE_NAME = SESSION.COOKIE_NAME;

export const sessionOption = {
    name: SESSION_COOKIE_NAME,
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    rolling: true,
    cookie: {
        maxAge: COOKIE_TIMEOUT_SEC * 1000,
        httpOnly: process.env.NODE_ENV != 'development' ? true : false,
        secure: process.env.NODE_ENV != 'development' ? true : false,
        path: "/",
        sameSite: true
    }
};