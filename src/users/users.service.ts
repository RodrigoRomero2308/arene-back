import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HashService } from 'src/hash/hash.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDTO } from './DTO/register.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashService: HashService,
  ) {}

  findOne = (whereInput: Prisma.UserWhereUniqueInput) => {
    return this.prismaService.user.findUnique({
      where: whereInput,
    });
  };

  private validateRegister = (registerDTO: RegisterUserDTO) => {
    /* Aca realizaremos controles por ejemplo si ya existe un usuario con el dni o email que se esta queriendo usar para registrarse */
    return;
  };

  registerUser = async (_registerDto: RegisterUserDTO) => {
    this.validateRegister(_registerDto);
    const registerDto = JSON.parse(
      JSON.stringify(_registerDto),
    ) as RegisterUserDTO;
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
