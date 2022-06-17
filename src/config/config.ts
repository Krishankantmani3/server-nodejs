export const config = {
  ENV: "DEVELOPMENT",
  PORT: 9000,
  MONGO_URI: "mongodb://172.17.0.3:27017/KKDB",
  REDIS_URI: {
    host: "172.17.0.5"
  },
  NODEMAILER_INFO: {
    user: "try.and.test@outlook.com",
    pass: 'dcba#4321',
    service: "hotmail"
  },
  SESSION: {
    COOKIE_SECRET: "DGNDGJ4589ghhfd615ionEFBJRFFB45bgfheyyuj",
    COOKIE_TIMEOUT_SEC: 3600,
    COOKIE_NAME: "session_cookie",
    SESSION_MAX_LIMIT: 1,
  },
  JWT: {
    COOKIE_TIMEOUT_SEC: 3600,
    ACCESS_SECRET: "DGNDGJ4589ghhfd615ionEFBJRFFB45bgfheyyuj",
    ACCESS_TIME: "365d",
    TOKEN_NAME: 'jwt_token'
  }
}