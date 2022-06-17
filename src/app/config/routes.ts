import express, { Application, Router } from "express";
import { AdminController } from "../controller/admin.controller";
import { Auth } from "../controller/auth.controller";

export class Approutes {
  router: express.Router;
  auth: Auth;
  admin: AdminController;

  constructor(app: Application) {
    this.router = express.Router();
    this.auth = new Auth(app, this.router);
    this.admin = new AdminController(app, this.router);
    app.use('/api', this.router);
    app.use('*', (req, res) => {
      res.status(404).json({ message: "resource not found" });
    });
    this.initializeAllRoutes();
  }

  initializeAllRoutes() {
    this.auth.initializeRouting();
    this.admin.initializeRouting();
  }
}