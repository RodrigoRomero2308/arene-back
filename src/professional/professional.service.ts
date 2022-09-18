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
    const { professional, address, phone_type_id, ...createUserInput } = input;

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
        createdBy: {
          connect: {
            id: userId,
          },
        },
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
        address: address
          ? {
              create: {
                ...address,
                created_by: userId,
              },
            }
          : undefined,
        phoneType: phone_type_id
          ? {
              connect: {
                id: phone_type_id,
              },
            }
          : undefined,
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

    const { professional, address, phone_type_id, ...updateUserInput } = input;

    await this.prismaService.user.update({
      data: {
        ...updateUserInput,
        uts: new Date(),
        updatedBy: {
          connect: {
            id: userId,
          },
        },
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
        address: address
          ? {
              update: {
                ...address,
                updated_by: userId,
                uts: new Date(),
              },
            }
          : undefined,
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
