import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HashService } from '@/hash/hash.service';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserInput } from './DTO/createUserInput';
import { UpdateUserInput } from './DTO/updateUserInput';
import { UserFilter } from './DTO/user.filter';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashService: HashService,
  ) {}

  findById(id: number) {
    return this.prismaService.user.findFirst({
      where: {
        AND: [
          {
            dts: null,
          },
          {
            id: id,
          },
        ],
      },
    });
  }

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
    const { address, phone_type_id, ...createUserInput } = registerDto;
    const createdUser = await this.prismaService.user.create({
      data: {
        ...createUserInput,
        active: true,
        ...{
          address: address
            ? {
                create: {
                  ...address,
                },
              }
            : undefined,
        },
        phoneType: phone_type_id
          ? {
              connect: {
                id: phone_type_id,
              },
            }
          : undefined,
      },
    });
    return createdUser;
  };

  private getPrismaParameters({ filter = {} }: { filter?: UserFilter }) {
    const filtersToApply: Prisma.UserWhereInput[] = [];

    const { dni, email, name } = filter;

    if (dni)
      filtersToApply.push({
        dni: {
          contains: dni,
        },
      });

    if (email)
      filtersToApply.push({
        email: {
          contains: email,
        },
      });

    if (name)
      filtersToApply.push({
        OR: [
          {
            firstname: {
              contains: name,
            },
          },
          {
            lastname: {
              contains: name,
            },
          },
        ],
      });

    return filtersToApply;
  }

  async update(id: number, input: UpdateUserInput, userId: number) {
    await this.validateRegister(
      {
        dni: input.dni || '',
        email: input.email || '',
      },
      {
        excludeDni: !!input.dni,
        excludeEmail: !!input.email,
        excludeUserId: id,
      },
    );

    if (input.password) {
      input.password = await this.hashService.hash(input.password);
    }

    const { address, phone_type_id, ...updateUserInput } = input;

    await this.prismaService.user.update({
      data: {
        ...updateUserInput,
        uts: new Date(),
        updatedBy: {
          connect: {
            id: userId,
          },
        },
        ...(address
          ? {
              address: {
                update: {
                  ...address,
                  updated_by: userId,
                  uts: new Date(),
                },
              },
            }
          : {}),
        phoneType: phone_type_id
          ? {
              connect: {
                id: phone_type_id,
              },
            }
          : undefined,
      },
      where: {
        id: id,
      },
      select: {
        id: true,
      },
    });

    return this.findById(id);
  }
}
