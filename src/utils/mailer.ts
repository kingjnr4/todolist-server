import { readFileSync } from "fs";
import Handlebars from "handlebars";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import path from "path";
import { cwd } from "process";

class Mailer {
  private static instance: Mailer;
  private transporter: nodemailer.Transporter;

  private constructor( transport?: string | SMTPTransport | SMTPTransport.Options | undefined,
    defaults?: SMTPTransport.Options | undefined) {
    this.transporter = nodemailer.createTransport(transport,defaults);
  }

  public static getInstance(
    transport?: string | SMTPTransport | SMTPTransport.Options | undefined,
    defaults?: SMTPTransport.Options | undefined
  ): Mailer {
    if (!Mailer.instance) {
      Mailer.instance = new Mailer(transport,defaults);
    }
    return Mailer.instance;
  }

  public sendMailWithTemplate = async (
    to: string,
    subject: string,
    templateName:string,
    data: any
  ) => {
    const source = readFileSync(
      path.join(cwd(),'src','templates',`${templateName}.hbs`),
      'utf8',
    );
    const template = Handlebars.compile(source)
    const mailOptions = {
      from: '"John Doe" <admin@taskmaster.com>',
      to,
      subject,
      html:template(data),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Message sent: ${info.messageId}`);
    } catch (error) {
      console.error(error);
    }
  };
  public sendMailWithoutTemplate = async (
    to: string,
    subject: string,
    html:string,
  ) => {
  
    const mailOptions = {
      from: '"John Doe" <admin@taskmaster.com>',
      to,
      subject,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Message sent: ${info.messageId}`);
    } catch (error) {
      console.error(error);
    }
  };
}
export default Mailer;
