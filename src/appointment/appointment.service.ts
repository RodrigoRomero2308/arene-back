import { PatientInformationTypes } from '@/enums/patientInformationType.enum';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthenticatedUser } from '@/users/entity/authenticated.user.model';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AppointmentFilter } from './dto/appointment.filter';
import { CreateAppointmentInput } from './dto/create-appointment.input';

@Injectable()
export class AppointmentService {
  constructor(private readonly prismaService: PrismaService) {}

  private include: Prisma.AppointmentInclude = {
    treatment: {
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
    },
  };

  private getPrismaParameters({ filter = {} }: { filter?: AppointmentFilter }) {
    const filtersToApply: Prisma.AppointmentWhereInput[] = [];

    const { id, treatment_id, day_of_the_week, start_hour, end_hour } = filter;

    if (id)
      filtersToApply.push({
        id,
        dts: null,
      });

    if (treatment_id)
      filtersToApply.push({
        treatment_id,
      });

    if (day_of_the_week)
      filtersToApply.push({
        day_of_the_week,
      });

    if (start_hour)
      filtersToApply.push({
        start_hour,
      });

    if (end_hour)
      filtersToApply.push({
        end_hour,
      });

    return filtersToApply;
  }

  getList({
    filter,
    skip,
    take,
  }: {
    filter?: AppointmentFilter;
    skip?: number;
    take?: number;
  }) {
    const whereFilters = this.getPrismaParameters({
      filter,
    });

    return this.prismaService.appointment.findMany({
      where: {
        AND: [
          {
            dts: null,
          },
          ...whereFilters,
        ],
      },
      include: this.include,
      skip,
      take,
    });
  }

  async create(input: CreateAppointmentInput, user: AuthenticatedUser) {
    await this.checkAppointments(
      input.treatment_id,
      input.day_of_the_week,
      input.start_hour,
      input.end_hour,
    );

    const treatment = await this.prismaService.treatment.findFirst({
      where: {
        id: input.treatment_id,
        dts: null,
      },
      include: {
        area: true,
      },
    });

    if (!treatment) {
      throw new BadRequestException('El tratamiento no existe');
    }

    const [result] = await this.prismaService.$transaction([
      this.prismaService.appointment.create({
        data: {
          ...input,
          created_by: user.id,
        },
      }),
      this.prismaService.patientInformation.create({
        data: {
          information: `Turno asignado para el tratamiento del area ${treatment.area.name}`,
          patient_information_type_id: PatientInformationTypes.TurnoAsignado,
          patient_id: treatment.patient_id,
          created_by: user.id,
        },
      }),
    ]);

    return result;
  }

  async checkAppointments(
    treatment_id: number,
    day_of_the_week: string,
    start_hour: string,
    end_hour: string,
  ) {
    const treatment = await this.prismaService.treatment.findFirst({
      where: {
        id: treatment_id,
        dts: null,
      },
    });

    if (!treatment) {
      throw new BadRequestException('El tratamiento no existe');
    }

    const otherTreatmentCount = await this.prismaService.appointment.count({
      where: {
        treatment: {
          patient_id: treatment.patient_id,
          dts: null,
        },
        day_of_the_week,
        start_hour,
        end_hour,
        dts: null,
      },
    });

    if (otherTreatmentCount) {
      throw new InternalServerErrorException(
        'El paciente ya tiene otro turno en el mismo dia y horario',
      );
    }
  }

  async delete(id: number, user: AuthenticatedUser) {
    const appointment = await this.prismaService.appointment.findFirst({
      where: {
        id,
        dts: null,
      },
      include: {
        treatment: {
          include: {
            area: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new BadRequestException('El turno no existe');
    }

    const [result] = await this.prismaService.$transaction([
      this.prismaService.appointment.update({
        where: {
          id,
        },
        data: {
          dts: new Date(),
          deleted_by: user.id,
        },
      }),
      this.prismaService.patientInformation.create({
        data: {
          information: `Turno eliminado para el tratamiento del area ${appointment.treatment.area.name}`,
          created_by: user.id,
          patient_id: appointment.treatment.patient_id,
          patient_information_type_id: PatientInformationTypes.TurnoEliminado,
        },
      }),
    ]);

    return result;
  }
}
