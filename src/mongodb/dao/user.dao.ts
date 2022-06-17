import { Schema } from "mongoose";
import mongoose from 'mongoose';
import { MESSAGE } from "../../app/utility/constant/constant";
import { USER_ROLE } from "../../app/utility/constant/constant";
import { printErrorLog } from "../../app/utility/logger";
import { User, Users } from "../model/user.model";

export class UserDao {

    public async findOneByUserName(username: string) {
        try {
            let user = await Users.findOne({ $or: [{ username: username }, { email: username }] });
            if (!user) {
                return false;
            }
            return user;
        }
        catch (err) {
            printErrorLog("UserDao", "findOneByUserName", err);
            throw { status: 500, message: MESSAGE.DATABASE_ERROR };
        }
    }

    public async findOneByUserNameAndRoles(username: string, roles: number[]) {
        try {
            let user = await Users.findOne({ username, role: { $in: roles } });
            if (!user) {
                return false;
            }
            return user;
        }
        catch (err) {
            printErrorLog("UserDao", "findOneByUserNameAndRoles", err);
            throw { status: 500, message: MESSAGE.DATABASE_ERROR };
        }
    }

    public async findByUserNameOrEmail(username: any, email: any) {
        try {
            let result = await Users.find({ $or: [{ "email": { $in: [email, username] } }, { "username": { $in: [email, username] } }] });
            if (result.length == 0) {
                return false;
            }
            return result;
        } catch (err) {
            printErrorLog("UserDao", "findByUserNameOrEmail", err);
            throw { status: 500, message: MESSAGE.DATABASE_ERROR };
        }
    }

    public async saveNewUser(user: User) {
        try {
            let newUser = new Users(user);
            let data = await newUser.save();
            return data;
        } catch (err) {
            printErrorLog("UserDao", "saveNewUser", err);
            throw { status: 500, message: MESSAGE.DATABASE_ERROR };
        }
    }

    public async getStudentsList() {
        try {
            let result = await Users.find({ role: USER_ROLE.STUDENT }, { email: 1, username: 1, fullname: 1, isEmailVerified: 1, isUserActivated: 1 });
            if (!result || result.length == 0) {
                return false;
            }
            return result;
        }
        catch (err) {
            printErrorLog("UserDao", "getStudentsList", err);
            throw { status: 500, message: MESSAGE.DATABASE_ERROR };
        }
    }

    public async getEducatorsList() {
        try {
            let result = await Users.find({ role: USER_ROLE.EDUCATOR }, { email: 1, username: 1, fullname: 1, isEmailVerified: 1, isUserActivated: 1 });
            if (!result || result.length == 0) {
                return false;
            }
            return result;
        }
        catch (err) {
            printErrorLog("UserDao", "getEducatorsList", err);
            throw { status: 500, message: MESSAGE.DATABASE_ERROR };
        }
    }

    public async updateUserField(userId: any, updateObj: any) {
        try {
            return Users.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) }, { $set: updateObj }, { new: true });
        }
        catch (err) {
            printErrorLog("UserDao", "updateUserField", err);
            throw { status: 500, message: MESSAGE.DATABASE_ERROR };
        }
    }
}
