import { UserDao } from "../../mongodb/dao/user.dao";
import { MESSAGE, USER_ROLE } from "../utility/constant/constant";
import { UserResponseDTO } from "../utility/dto/userResponse.dto";
import { printErrorLog } from "../utility/logger";
import { NodeMailerService } from "../utility/nodemailer.service";

export class AdminService {

    private userDao: UserDao;
    private nodeMailerService: NodeMailerService;

    constructor() {
        this.userDao = new UserDao();
        this.nodeMailerService = new NodeMailerService();
        this.getStudentList = this.getStudentList.bind(this);
        this.getEducatorsList = this.getEducatorsList.bind(this);
        this.getStudentOrEducatorDetailsByUserName = this.getStudentOrEducatorDetailsByUserName.bind(this);
        this.verifyEmailByAdmin = this.verifyEmailByAdmin.bind(this);
        this.activateUSerByAdmin = this.activateUSerByAdmin.bind(this);
        this.deactivateUserByAdmin = this.deactivateUserByAdmin.bind(this);
        this.mailToUser = this.mailToUser.bind(this);
    }

    async getStudentList(req: any, res: any, next: any) {
        try {
            let students = await this.userDao.getStudentsList();
            if (!students) {
                res.status(204).json({ message: MESSAGE.NO_DATA_FOUND });
            }
            return res.status(200).json(students);
        }
        catch (err) {
            printErrorLog("AdminService", "getStudentList", err);
            next(err);
        }
    }

    async getEducatorsList(req: any, res: any, next: any) {
        try {
            let educators = await this.userDao.getStudentsList();
            if (!educators) {
                res.status(204).json({ message: MESSAGE.NO_DATA_FOUND });
            }
            return res.status(200).json(educators);
        }
        catch (err) {
            printErrorLog("AdminService", "getEducatorsList", err);
            next(err);
        }
    }

    async getStudentOrEducatorDetailsByUserName(req: any, res: any, next: any) {
        try {
            let username = req.params.username;
            let roles = [USER_ROLE.EDUCATOR, USER_ROLE.STUDENT];
            let user = await this.userDao.findOneByUserNameAndRoles(username, roles);
            if (!user) {
                return res.status(204).json({ message: MESSAGE.NO_DATA_FOUND });
            }
            return res.status(200).json(new UserResponseDTO(user));
        }
        catch (err) {
            printErrorLog("AdminService", "getStudentOrEducatorDetailsByUserName", err);
            next(err);
        }
    }

    async verifyEmailByAdmin(req: any, res: any, next: any) {
        try {
            let userId = req.params.userId;
            let updateObj = { isEmailVerified: true };
            await this.userDao.updateUserField(userId, updateObj);
            return res.status(204).json({ message: "successfully Updated" });
        }
        catch (err) {
            printErrorLog("AdminService", "verifyEmailByAdmin", err);
            next(err);
        }
    }

    async activateUSerByAdmin(req: any, res: any, next: any) {
        try {
            let userId = req.params.userId;
            let updateObj = { isUserActivated: true };
            await this.userDao.updateUserField(userId, updateObj);
            return res.status(204).json({ message: "successfully Updated" });
        }
        catch (err) {
            printErrorLog("AdminService", "activateUSerByAdmin", err);
            next(err);
        }
    }

    async deactivateUserByAdmin(req: any, res: any, next: any) {
        try {
            let userId = req.params.userId;
            let updateObj = { isUserActivated: false };
            await this.userDao.updateUserField(userId, updateObj);
            return res.status(204).json({ message: "successfully Updated" });
        }
        catch (err) {
            printErrorLog("AdminService", "deactivateUserByAdmin", err);
            next(err);
        }
    }

    async mailToUser(req: any, res: any, next: any) {
        try {
            let inputData = req.body;
            let result = await this.nodeMailerService.sendMail("try.and.test@outlook.com", inputData.sendTo, inputData.subject, inputData.body);
            return res.status(204).json();
        }
        catch (err) {
            printErrorLog("AdminService", "mailToUser", err);
            next(err);
        }
    }
}