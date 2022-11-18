import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScanResult } from './entities/scan-result.entity';
import { ScanResultController } from './scan-result.controller';
import { ScanResultService } from './scan-result.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScanResult])],
  controllers: [ScanResultController],
  providers: [ScanResultService],
})
export class ScanResultModule {}
