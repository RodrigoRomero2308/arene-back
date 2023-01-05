import { SystemRoles } from '@/enums/systemRoles.enum';
import { HashService } from '@/hash/hash.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UsersService } from '@/users/users.service';
import { Prisma } from '@prisma/client';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProfessionalInput } from './dto/create-professional.input';
import { ProfessionalFilter } from './dto/professional.filter';
import { UpdateProfessionalInput } from './dto/update-professional.input';

@Injectable()
export class ProfessionalService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
  ) {}

  private include: Prisma.ProfessionalInclude = {
    user: {
      include: {
        address: true,
      },
    },
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

  private getPrismaParameters({
    filter = {},
  }: {
    filter?: ProfessionalFilter;
  }) {
    const filtersToApply: Prisma.ProfessionalWhereInput[] = [];

    const { dni, name, speciality, profession, medical_license_number } =
      filter;

    if (dni)
      filtersToApply.push({
        user: {
          dni: {
            contains: dni,
          },
        },
      });

    if (name)
      filtersToApply.push({
        user: {
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
        },
      });

    if (speciality)
      filtersToApply.push({
        speciality: {
          contains: speciality,
        },
      });

    if (profession)
      filtersToApply.push({
        profession: {
          contains: profession,
        },
      });

    if (medical_license_number)
      filtersToApply.push({
        medical_license_number: {
          contains: medical_license_number,
        },
      });

    return filtersToApply;
  }

  getList({
    filter,
    skip,
    take,
  }: {
    filter?: ProfessionalFilter;
    skip?: number;
    take?: number;
  }) {
    const whereFilters = this.getPrismaParameters({
      filter,
    });

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
          ...whereFilters,
        ],
      },
      include: this.include,
      skip,
      take,
    });
  }

  getListByRole(
    role: string,
    {
      filter,
      skip,
      take,
    }: {
      filter?: ProfessionalFilter;
      skip?: number;
      take?: number;
    },
  ) {
    const whereFilters = this.getPrismaParameters({
      filter,
    });

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
          {
            user: {
              RoleUser: {
                some: {
                  role: {
                    name: {
                      contains: role,
                    },
                  },
                  deleted_by: null,
                },
              },
            },
          },
          ...whereFilters,
        ],
      },
      include: this.include,
      skip,
      take,
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
            medical_license_number: professional.medical_license_number,
            speciality: professional.speciality,
            created_by: userId,
          },
        },
        RoleUser: {
          create: {
            roleId: professionalRole.id,
          },
        },
        ...(address
          ? {
              address: {
                create: {
                  ...address,
                  created_by: userId,
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
      select: {
        id: true,
      },
    });

    return this.findById(result.id);
  }

  async createAdministrator(input: CreateProfessionalInput, userId: number) {
    await this.usersService.validateRegister(input);
    input.password = await this.hashService.hash(input.password);
    const { professional, address, phone_type_id, ...createUserInput } = input;

    const administratorRole = await this.prismaService.role.findFirst({
      where: {
        dts: null,
        name: SystemRoles.Administrador,
      },
    });

    if (!administratorRole) {
      throw new InternalServerErrorException(
        undefined,
        'Administrator role is not found',
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
            profession: 'Administrador',
            medical_license_number: '0',
            speciality: 'Administrador',
            created_by: userId,
          },
        },
        RoleUser: {
          create: {
            roleId: administratorRole.id,
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

  async createCoordinator(input: CreateProfessionalInput, userId: number) {
    await this.usersService.validateRegister(input);
    input.password = await this.hashService.hash(input.password);
    const { professional, address, phone_type_id, ...createUserInput } = input;

    const coordinatorRole = await this.prismaService.role.findFirst({
      where: {
        dts: null,
        name: SystemRoles.Coordinador,
      },
    });

    if (!coordinatorRole) {
      throw new InternalServerErrorException(
        undefined,
        'Coordinator role is not found',
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
            profession: 'Coordinador',
            medical_license_number: '0',
            speciality: 'Coordinador',
            created_by: userId,
          },
        },
        RoleUser: {
          create: {
            roleId: coordinatorRole.id,
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

  async createDirector(input: CreateProfessionalInput, userId: number) {
    await this.usersService.validateRegister(input);
    input.password = await this.hashService.hash(input.password);
    const { address, phone_type_id, ...createUserInput } = input;

    const directorRole = await this.prismaService.role.findFirst({
      where: {
        dts: null,
        name: SystemRoles.Director,
      },
    });

    if (!directorRole) {
      throw new InternalServerErrorException(
        undefined,
        'Director role is not found',
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
            profession: 'Director',
            medical_license_number: '0',
            speciality: 'Director',
            created_by: userId,
          },
        },
        RoleUser: {
          create: {
            roleId: directorRole.id,
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

  async createPhysiatrist(input: CreateProfessionalInput, userId: number) {
    await this.usersService.validateRegister(input);
    input.password = await this.hashService.hash(input.password);
    const { professional, address, phone_type_id, ...createUserInput } = input;

    const physiatristRole = await this.prismaService.role.findFirst({
      where: {
        dts: null,
        name: SystemRoles.Fisiatra,
      },
    });

    if (!physiatristRole) {
      throw new InternalServerErrorException(
        undefined,
        'Physiatrist role is not found',
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
            profession: 'Fisiatra',
            medical_license_number: professional.medical_license_number,
            speciality: professional.speciality,
            created_by: userId,
          },
        },
        RoleUser: {
          create: {
            roleId: physiatristRole.id,
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
    await this.usersService.validateUpdate(
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

  async getRolesThatProfessionalDontHave(id: number) {
    await this.prismaService.role.findMany({});
  }
}
