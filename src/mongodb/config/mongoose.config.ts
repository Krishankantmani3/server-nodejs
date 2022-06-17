import mongoose from 'mongoose';
import { printConsoleLog, printErrorLog } from '../../app/utility/logger';
const db = mongoose.connection;

export default function setMongooseConfig() {
    const MONGO_URI = process.env.MONGO_URI as string;

    db.on('error', (err) => {
        printErrorLog("mongoose.config.ts", "onError", err);
    });

    db.on('connected', () => {
        db.on('disconnected', (err) => {
            printErrorLog("mongoose.config.ts", "onDisconnected", err);
        });
    });

    mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if (err) {
            printErrorLog("mongoose.config.ts", "onConnect", err);
        }
        else {
            printConsoleLog("mongoose.config.ts", "onConnect", `connected successfully at ${MONGO_URI}`);
        }
    });
}
