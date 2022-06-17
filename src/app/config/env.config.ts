import { config } from "../../config/config";
import { printErrorLog } from "../utility/logger";

(function setAppEnvVariable() {

    if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = 'development';
    }

    process.env.PORT = process.env.PORT ? process.env.PORT : JSON.stringify(config.PORT);
    process.env.MONGO_URI = process.env.MONGO_URI || config.MONGO_URI;
    process.env.SESSION = process.env.SESSION || JSON.stringify(config.SESSION);
    process.env.JWT = process.env.JWT || JSON.stringify(config.JWT);
    process.env.REDIS_URI = process.env.REDIS_URI || JSON.stringify(config.REDIS_URI);
    process.env.NODEMAILER_INFO = process.env.NODEMAILER_INFO || JSON.stringify(config.NODEMAILER_INFO);
})();


export function envValidationForProd() {
    if (process.env.NODE_ENV == 'production') {
        requiredEnv(process.env.PORT);
        requiredEnv(process.env.MONGO_URI);
        requiredEnv(process.env.SESSION);
        requiredEnv(process.env.REDIS_URI);
    }
}

function requiredEnv(env: any) {
    if (!env) {
        printErrorLog('env.config.ts', 'requiredEnv', `[error]: The "${env}" environment variable is required`)
        process.exit(1)
    }
}

