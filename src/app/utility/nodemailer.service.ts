"use strict";
const nodemailer = require("nodemailer");

export class NodeMailerService {
  transporter: any;
  NODEMAILER_INFO: any;

  constructor() {
    this.NODEMAILER_INFO = JSON.parse(process.env.NODEMAILER_INFO as string);
    this.initializeTransporter();
  }

  initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      service: this.NODEMAILER_INFO.service,
      auth: {
        user: this.NODEMAILER_INFO.user,
        pass: this.NODEMAILER_INFO.pass,
      },
    });
  }

  async sendMail(sendFrom: any, sendTo: any, subject: any, body: any) {
    let info = await this.transporter.sendMail({
      from: sendFrom, // sender address
      to: sendTo, // list of receivers
      subject: subject, // Subject line
      text: body, // plain text body
      // html: "<b>Hello world? oops</b>", // html body
    });

    return info.messageId;
  }
}
