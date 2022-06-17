import { MESSAGE } from "./constant/constant";
import { JwtHandler } from "./jwt.handler";

export function setJwtTokenInCookies(req: any, res: any, user: any, cookieTimeOutSec?: any) {
    const jwtHandler = new JwtHandler();
    const JWT = JSON.parse(process.env.JWT as string);
    const JWT_COOKIE_TIMEOUT_SEC = JWT.COOKIE_TIMEOUT_SEC;
    const JWT_TOKEN_NAME = JWT.TOKEN_NAME;

    try {
        let payload = {
            _id: user._id,
            username: user.username,
            role: user.role
        };

        let token = jwtHandler.generateToken(payload);
        if (token == MESSAGE.SERVER_ERROR) {
            return res.status(500).json({ "error": MESSAGE.SERVER_ERROR });
        }
        else {
            let options = {
                maxAge: cookieTimeOutSec ? cookieTimeOutSec : JWT_COOKIE_TIMEOUT_SEC,
                httpOnly: true,
                signed: true,
                sameSite: 'Strict',
                secure: true
            }
            res.cookie(JWT_TOKEN_NAME, token, options);
        }
    }
    catch (err) {
        throw err;
    }
}