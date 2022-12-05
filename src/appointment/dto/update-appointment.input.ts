import { CreateAppointmentInput } from './create-appointment.input';
import { InputType, Field, Int, PartialType, OmitType } from '@nestjs/graphql';
import { AppointmentUncheckedCreateInput } from '@/prisma-models/appointment/appointment-unchecked-create.input';

@InputType()
export class UpdateAppointmentInput extends OmitType(
  PartialType(AppointmentUncheckedCreateInput),
  ['treatment_id', 'professional_id'],
) {}
