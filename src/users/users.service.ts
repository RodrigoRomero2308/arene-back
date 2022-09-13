import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HashService } from '@/hash/hash.service';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserInput } from './DTO/createUserInput';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashService: HashService,
  ) {}

  findOne = (whereInput: Prisma.UserWhereInput) => {
    return this.prismaService.user.findFirst({
      where: whereInput,
    });
  };

  findMany = (findManyArgs: Prisma.UserFindManyArgs = {}) => {
    return this.prismaService.user.findMany(findManyArgs);
  };

  validateRegister = async (
    input: {
      dni: string;
      email: string;
    },
    options: {
      excludeUserId?: number;
      excludeDni?: boolean;
      excludeEmail?: boolean;
    } = {},
  ) => {
    /* Aca realizaremos controles por ejemplo si ya existe un usuario con el dni o email que se esta queriendo usar para registrarse */
    const userFilter: Prisma.UserWhereInput[] = [];

    if (!options.excludeDni) {
      userFilter.push({
        dni: input.dni,
        dts: null,
      });
    }

    if (!options.excludeEmail) {
      userFilter.push({
        email: input.email,
        dts: null,
      });
    }

    let alreadyExistingUser: number | undefined;

    if (userFilter.length) {
      const queryResult = await this.findOne({
        OR: userFilter,
        AND: [
          {
            id: options.excludeUserId,
          },
        ],
      });

      alreadyExistingUser = queryResult?.id;
    }

    if (alreadyExistingUser) {
      throw new InternalServerErrorException({
        message: 'Ya existe un usuario registrado con este DNI o email',
      });
    }
    return;
  };

  registerUser = async (registerDto: CreateUserInput) => {
    await this.validateRegister(registerDto);
    registerDto.password = await this.hashService.hash(registerDto.password);
    const createdUser = await this.prismaService.user.create({
      data: {
        ...registerDto,
        active: true,
      },
    });
    return createdUser;
  };
}
