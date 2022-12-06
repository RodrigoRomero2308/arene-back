import { ProfessionalAreaArea_idProfessional_idCompoundUniqueInput } from '@/prisma-models/professional-area/professional-area-area-id-professional-id-compound-unique.input';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateAreaProfessionalInput } from './dto/create-area-professional.input';

@Injectable()
export class AreaProfessionalService {
  constructor(private readonly prismaService: PrismaService) {}

  async checkAreaProfessional({
    professionalId,
    areaId,
  }: {
    professionalId: number;
    areaId: number;
  }) {
    const areaProfessionalExist =
      await this.prismaService.professionalArea.count({
        where: {
          professional_id: professionalId,
          area_id: areaId,
        },
      });

    const areaExist = await this.prismaService.area.count({
      where: {
        id: areaId,
        deleted_by: null,
      },
    });

    const professionalExist = await this.prismaService.professional.count({
      where: {
        user_id: professionalId,
        deleted_by: null,
      },
    });

    if (areaExist == 0) {
      throw new Error('Id de rol inexistente');
    }
    if (professionalExist == 0) {
      throw new Error('Id de usuario inexistente');
    }
    if (areaProfessionalExist) {
      throw new Error(
        `Relacion ya existente entre el profesional ${professionalId} y area ${areaId}}`,
      );
    }
  }

  async createAreaProfessional(
    input: CreateAreaProfessionalInput,
    userId: number,
  ) {
    this.checkAreaProfessional({
      areaId: input.area_id,
      professionalId: input.professional_id,
    });

    return this.prismaService.professionalArea.create({
      data: {
        ...input,
        created_by: userId,
      },
    });
  }

  async deleteAreaProfessional(
    input: ProfessionalAreaArea_idProfessional_idCompoundUniqueInput,
  ) {
    await this.prismaService.professionalArea.delete({
      where: {
        area_id_professional_id: input,
      },
    });
  }

  async getRoleUsersByProfessionalId(professionalId: number) {
    return this.prismaService.professionalArea.findMany({
      where: {
        professional_id: professionalId,
      },
      include: {
        area: true,
      },
    });
  }
}
