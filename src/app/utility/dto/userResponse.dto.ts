
export class UserResponseDTO {
    _id: string;
    username: string;
    email: string;
    fullname: string;
    role: [number];
    isEmailVerified: boolean;
    isUserActivated: boolean;

    constructor(user: any) {
        this._id = user._id;
        this.username = user.username;
        this.email = user.email;
        this.fullname = user.fullname;
        this.role = user.role;
        this.isEmailVerified = user.isEmailVerified;
        this.isUserActivated = user.isUserActivated;
    }
}