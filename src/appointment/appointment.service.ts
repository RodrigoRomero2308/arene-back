import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AppointmentFilter } from './dto/appointment.filter';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { UpdateAppointmentInput } from './dto/update-appointment.input';

@Injectable()
export class AppointmentService {
  constructor(private readonly prismaService: PrismaService) {}

  private include: Prisma.AppointmentInclude = {
    treatment: true,
    professional: true,
  };

  private getPrismaParameters({ filter = {} }: { filter?: AppointmentFilter }) {
    const filtersToApply: Prisma.AppointmentWhereInput[] = [];

    const {
      id,
      treatment_id,
      professional_id,
      day_of_the_week,
      start_hour,
      end_hour,
    } = filter;

    if (id)
      filtersToApply.push({
        id,
      });

    if (treatment_id)
      filtersToApply.push({
        treatment_id,
      });

    if (professional_id)
      filtersToApply.push({
        professional_id,
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
        AND: whereFilters,
      },
      include: this.include,
      skip,
      take,
    });
  }

  async checkAppointmentExistence(
    dayOfTheWeek: string,
    startHour: string,
    endHour: string,
  ) {
    const existingAppointment = await this.prismaService.appointment.count({
      where: {
        day_of_the_week: dayOfTheWeek,
        start_hour: startHour,
        end_hour: endHour,
      },
    });
    if (existingAppointment > 0) {
      return true;
    } else {
      return false;
    }
  }

  async create(input: CreateAppointmentInput) {
    /*    await this.checkAppointmentExistence(input.start_date, input.end_date); */

    return this.prismaService.appointment.create({
      data: {
        ...input,
      },
    });
  }

  async update(id: number, input: UpdateAppointmentInput) {
    return this.prismaService.appointment.update({
      where: {
        id,
      },
      data: {
        ...input,
      },
    });
  }

  async delete(id: number) {
    return this.prismaService.appointment.delete({
      where: {
        id,
      },
    });
  }
}
