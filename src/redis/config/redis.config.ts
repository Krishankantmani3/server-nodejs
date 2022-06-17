import { printConsoleMessage } from "../../app/utility/logger";
const Redis = require('ioredis');
const redis_connection_obj = JSON.parse(process.env.REDIS_URI as string);
export var redisClient = new Redis(redis_connection_obj);

redisClient.on('connect', () => {
    printConsoleMessage("redis client connected");
});

redisClient.on('error', (err: any) => {
    printConsoleMessage(err);
});

redisClient.on('disconnect', () => {
    printConsoleMessage("redis client disConnected");
});
