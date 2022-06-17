import { envValidationForProd } from "./app/config/env.config";
import express from "express";
import { Approutes } from "./app/config/routes";
import setMongooseConfig from './mongodb/config/mongoose.config';
import http from 'http';
import session from "express-session";
import passport from "passport";
import { passportConfig } from "./app/config/passport.conf";
import { sessionOption } from "./app/config/sessionOption";
const cookieParser = require('cookie-parser');
const PORT = parseInt(process.env.PORT as string);
const SESSION_COOKIE_SECRET = JSON.parse(process.env.SESSION as string).COOKIE_SECRET;

envValidationForProd();
setMongooseConfig();

var app = express();
app.use(cookieParser(SESSION_COOKIE_SECRET));
app.use(express.json());
if (process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'test') {
    app.set('trust proxy', 1);
}
app.use(session(sessionOption));
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

const appRoutes = new Approutes(app);
const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
    console.log("http running on " + PORT);
});
