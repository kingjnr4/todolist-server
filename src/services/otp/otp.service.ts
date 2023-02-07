import { OtpType } from "@prisma/client";
import db from "../../db";
import { UserService } from "../users/users.service";
import { createOtpDto } from "./../../dtos/otp/create-otp.dto";
import moment from "moment";
import HttpException from "../../utils/exception";
import httpStatus from "http-status";
export class OtpService {
  private userService = new UserService();
  async createOtp(user_id: string, type: OtpType) {
    await this.clearOtps(user_id, type);
    await this.userService.findOne(user_id);
    const token = await this.genRandomToken();
    const otp = db.getClient().otp.create({
      data: {
        type: type,
        token,
        user_id: user_id,
        expiry: moment().add(30, "minutes").toDate(),
      },
    });
    return otp;
  }

  async verify(
    userId: string,
    token: string,
    otpType: OtpType
  ): Promise<boolean> {
    const otp = await db.getClient().otp.findFirst({
      where: {
        token,
        user_id: userId,
        used: false,
      },
      select: {
        type: true,
        expiry: true,
        id: true,
      },
    });

    if (!otp || otp.type !== otpType) {
      throw new HttpException(httpStatus.BAD_REQUEST, "OTP is incorrect");
    }
    if (moment(otp.expiry).isSameOrBefore(Date.now())) {
      throw new HttpException(
        httpStatus.BAD_REQUEST,
        "OTP has expired. Please request a new one"
      );
    }
    const updated = await db.getClient().otp.update({
      data: {
        used: true,
      },
      where: {
        id: otp.id,
      },
    });

    return updated ? true : false;
  }
  async findUser(token: string) {
    return (
      await db.getClient().otp.findFirst({
        where: {
          token,
        },
        select: {
          user: true,
        },
      })
    )?.user;
  }
  private async genRandomToken(): Promise<string> {
    const token = [...Array(6)]
      .map(() => Math.floor(Math.random() * 9))
      .join("");
    const exist = await db.getClient().otp.findFirst({
      where: {
        token,
      },
    });
    if (exist) {
      return this.genRandomToken();
    }
    return token;
  }
  private async clearOtps(userId: string, type: OtpType) {
    await db.getClient().otp.deleteMany({
      where: {
        type: type,
        user_id: userId,
      },
    });
  }
}
