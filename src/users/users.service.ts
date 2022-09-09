import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HashService } from '@/hash/hash.service';
import { PrismaService } from '@/prisma/prisma.service';
import { RegisterUserDTO } from './DTO/register.dto';

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

  private validateRegister = async (registerDTO: RegisterUserDTO) => {
    /* Aca realizaremos controles por ejemplo si ya existe un usuario con el dni o email que se esta queriendo usar para registrarse */
    const alreadyExistingUser = await this.findOne({
      OR: [
        {
          dni: registerDTO.dni,
        },
        {
          email: registerDTO.email,
        },
      ],
    });

    if (alreadyExistingUser) {
      throw new InternalServerErrorException({
        message: 'Ya existe un usuario registrado con este DNI o email',
      });
    }
    return;
  };

  registerUser = async (registerDto: RegisterUserDTO) => {
    await this.validateRegister(registerDto);
    registerDto.password = await this.hashService.hash(registerDto.password);
    const createdUser = await this.prismaService.user.create({
      data: {
        active: true,
        ...registerDto,
      },
    });
    return createdUser;
  };
}
