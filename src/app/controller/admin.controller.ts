import { Application, Router } from "express";
import { AuthMiddleWare } from "../middleware/auth.middleware";
import { AdminService } from "../service/admin.service";

const baseUrl = '/admin';

export class AdminController {

    router: Router;
    app: Application;
    authMiddleware: AuthMiddleWare;
    adminService: AdminService;
    constructor(app: Application, router: Router) {
        this.app = app;
        this.router = router;
        this.authMiddleware = new AuthMiddleWare();
        this.adminService = new AdminService();
    }

    initializeRouting() {
        this.router.get(`${baseUrl}/students`, this.authMiddleware.adminAuth, this.adminService.getStudentList);
        this.router.get(`${baseUrl}/educators`, this.authMiddleware.adminAuth, this.adminService.getEducatorsList);
        this.router.get(`${baseUrl}/user/:username`, this.authMiddleware.adminAuth, this.adminService.getStudentOrEducatorDetailsByUserName);
        this.router.patch(`${baseUrl}/email-verified/:userId`, this.authMiddleware.adminAuth, this.adminService.verifyEmailByAdmin);
        this.router.patch(`${baseUrl}/user-activated/:userId`, this.authMiddleware.adminAuth, this.adminService.activateUSerByAdmin);
        this.router.patch(`${baseUrl}/user-deactivated/:userId`, this.authMiddleware.adminAuth, this.adminService.deactivateUserByAdmin);
        this.router.post(`${baseUrl}/mail`, this.authMiddleware.adminAuth, this.adminService.mailToUser);
    }
};
