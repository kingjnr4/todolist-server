import { updateUserDto } from "./../../dtos/user/update-user.dto";
import { Prisma, User } from "@prisma/client";
import db from "../../db";
import { createUserDto } from "../../dtos/user/create-user.dto";
import HttpException from "../../utils/exception";
import status from "http-status";

export class UserService {
  private  prisma = db.getClient();

  async create(dto: createUserDto) {
    const user = await this.prisma.user.create({
      data: dto.body,
    });
    return user;
  }

  async update(dto: updateUserDto) {
    await this.findOne(dto.params.id);
    const user = await this.prisma.user.update({
      where: {
        id: dto.params.id,
      },
      data: {
        ...dto.body,
      },
    });
    return user;
  }

  async updateFields(id:string,data:any){
    await this.findOne(id)
    const user = await this.prisma.user.update({
      where:{
        id
      },
      data
    })
    return user;
  }


  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) {
      throw new HttpException(status.NOT_FOUND, "Record not found");
    }
    return user;
  }

  
  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    console.log(user);
    
    if (!user) {
      throw new HttpException(status.NOT_FOUND, "Record not found");
    }
    return user;
  }
}
