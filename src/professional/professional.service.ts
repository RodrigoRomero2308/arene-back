import { SystemRoles } from '@/enums/systemRoles.enum';
import { HashService } from '@/hash/hash.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UsersService } from '@/users/users.service';
import { Prisma } from '@prisma/client';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProfessionalInput } from './dto/create-professional.input';
import { UpdateProfessionalInput } from './dto/update-professional.input';

@Injectable()
export class ProfessionalService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
  ) {}

  private include: Prisma.ProfessionalInclude = {
    user: true,
  };

  findById(id: number) {
    return this.prismaService.professional.findFirst({
      where: {
        user_id: id,
        AND: [
          {
            dts: null,
          },
          {
            user: {
              dts: null,
            },
          },
        ],
      },
      include: this.include,
    });
  }

  getList() {
    return this.prismaService.professional.findMany({
      where: {
        AND: [
          {
            dts: null,
          },
          {
            user: {
              dts: null,
            },
          },
        ],
      },
      include: this.include,
    });
  }

  async create(input: CreateProfessionalInput, userId: number) {
    await this.usersService.validateRegister(input);
    input.password = await this.hashService.hash(input.password);
    const { professional, ...createUserInput } = input;

    const professionalRole = await this.prismaService.role.findFirst({
      where: {
        dts: null,
        name: SystemRoles.Profesional,
      },
    });

    if (!professionalRole) {
      throw new InternalServerErrorException(
        undefined,
        'Professional role is not found',
      );
    }

    const result = await this.prismaService.user.create({
      data: {
        ...createUserInput,
        active: true,
        created_by: userId,
        Professional: {
          create: {
            profession: professional.profession,
            medical_license_number: professional.medical_licencse_number,
            speciality: professional.speciality,
            created_by: userId,
          },
        },
        RoleUser: {
          create: {
            roleId: professionalRole.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    return this.findById(result.id);
  }

  async update(id: number, input: UpdateProfessionalInput, userId: number) {
    await this.usersService.validateRegister(
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

    const { professional, ...updateUserInput } = input;

    await this.prismaService.user.update({
      data: {
        ...updateUserInput,
        uts: new Date(),
        updated_by: userId,
        Professional: {
          update: {
            where: {
              user_id: id,
            },
            data: {
              ...professional,
              updated_by: userId,
              uts: new Date(),
            },
          },
        },
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
