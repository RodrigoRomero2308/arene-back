import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDTO } from './DTO/register.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  findOne = (whereInput: Prisma.UserWhereUniqueInput) => {
    return this.prismaService.user.findUnique({
      where: whereInput,
    });
  };

  registerUser = (registerDto: RegisterUserDTO) => {
    /* TOOO: implement */
    return registerDto;
  };
}
