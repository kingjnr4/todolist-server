import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

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
    data: any
  ) => {
    const html = "";

    const mailOptions = {
      from: '"Sender Name" <sender@example.com>',
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
