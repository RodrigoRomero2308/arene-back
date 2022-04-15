import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  findUnique = (whereInput: Prisma.UserWhereUniqueInput) => {
    return this.prismaService.user.findUnique({
      where: whereInput,
    });
  };
}
