import { USER_ROLE } from "../utility/constant/constant";
import { MESSAGE } from "../utility/constant/constant";
import { printErrorLog } from "../utility/logger";
import { RedisUtility } from "../../redis/utility/redis.utility";
import { UserResponseDTO } from "../utility/dto/userResponse.dto";

export class AuthMiddleWare {

    redisUtility: RedisUtility;

    constructor() {
        this.redisUtility = new RedisUtility();
        this.adminAuth = this.adminAuth.bind(this);
        this.studentAuth = this.studentAuth.bind(this);
        this.educatorAuth = this.educatorAuth.bind(this);
        this.userAuth = this.userAuth.bind(this);
        this.auth = this.auth.bind(this);
    }

    private async roleAuth(req: any, res: any, next: any, role: number) {
        try {
            if (req.isAuthenticated() && req.user) {
                if (req.user.role.findIndex((ele: number) => ele == role) >= 0) {
                    return next();
                }
                else {
                    return res.status(403).json({ status: MESSAGE.ACCESS_DENIED });
                }
            }
            else {
                return res.status(403).json({ message: MESSAGE.INVALID_TOKEN });
            }
        }
        catch (err) {
            printErrorLog("AuthMiddleWare", "roleAuth", err);
            return next(err);
        }
    }

    public async adminAuth(req: any, res: any, next: any) {
        return await this.roleAuth(req, res, next, USER_ROLE.ADMIN);
    }

    public async studentAuth(req: any, res: any, next: any) {
        return await this.roleAuth(req, res, next, USER_ROLE.STUDENT);
    }

    public async educatorAuth(req: any, res: any, next: any) {
        return await this.roleAuth(req, res, next, USER_ROLE.EDUCATOR);
    }

    public async auth(req: any, res: any, next: any) {
        try {
            if (req.isAuthenticated() && req.user) {
                if (req.user.isUserActivated) {
                    return res.status(200).json(new UserResponseDTO(req.user));
                }
                else {
                    return res.status(403).json({ message: "Account is deactivated" });
                }
            }
            else {
                return res.status(403).json({ message: MESSAGE.INVALID_TOKEN });
            }
        }
        catch (err) {
            printErrorLog("AuthMiddleWare", "auth", err);
            return next(err);
        }
    }

    public async userAuth(req: any, res: any, next: any) {
        try {
            if (req.isAuthenticated() && req.user) {
                return next();
            }
            else {
                return next(new Error("UnAuthorized"));
            }
        }
        catch (err) {
            printErrorLog("AuthMiddleWare", "userAuth", err);
            return next(new Error(MESSAGE.UNAUTHORIZED_ACCESS));
        }
    }
}

