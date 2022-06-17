import { UserResponseDTO } from "./userResponse.dto";

export class UserSessionDTO extends UserResponseDTO {
    sessionId: string;

    constructor(sessionUserData: any) {
        super(sessionUserData);
        this.sessionId = sessionUserData.sessionId;
    }

    setUserSessionId(sessionId: string) {
        this.sessionId = sessionId;
    }

    getUserSessionId(sessionId: string) {
        this.sessionId = sessionId;
    }
}