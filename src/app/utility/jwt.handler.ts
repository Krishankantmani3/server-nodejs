import jwt from 'jsonwebtoken';
import { MESSAGE } from './constant/constant';
import { printErrorLog } from './logger';

const JWT = JSON.parse(process.env.JWT as string);
const JWT_ACCESS_TIME = JWT.ACCESS_TIME;
const JWT_ACCESS_SECRET = JWT.ACCESS_SECRET;

export class JwtHandler {

    constructor() { }

    public generateToken(payload: any, options?: any) {
        try {
            if (!options) {
                options = {
                    expiresIn: JWT_ACCESS_TIME
                };
            }
            let token = jwt.sign(payload, JWT_ACCESS_SECRET, options);
            return token;
        }
        catch (err) {
            printErrorLog("jwtHandler", "genrateToken", err);
            return MESSAGE.SERVER_ERROR;
        }
    }

    public verifyToken(token: any) {
        try {
            let decoded_data = jwt.verify(token, JWT_ACCESS_SECRET);
            return decoded_data;
        }
        catch (err) {
            return MESSAGE.INVALID_TOKEN;
        }
    }
}



