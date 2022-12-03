import { Module } from '@nestjs/common';
import { PatientInformationService } from './patient-information.service';
import { PatientInformationResolver } from './patient-information.resolver';

@Module({
  exports: [PatientInformationService],
  providers: [PatientInformationResolver, PatientInformationService],
})
export class PatientInformationModule {}
