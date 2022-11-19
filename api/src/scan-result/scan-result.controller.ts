import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { CreateScanResultDto } from './dto/scan-result.dto';
import { Status } from './scan-result.interface';
import { ScanResultService } from './scan-result.service';

@Controller('scan-results')
export class ScanResultController {
  constructor(private readonly scanResultService: ScanResultService) {}

  @Get()
  getAll() {
    return this.scanResultService.getAll();
  }

  @Post()
  create(@Body() createScanResultDto: CreateScanResultDto) {
    if (createScanResultDto.status === Status.Queued && !createScanResultDto.queued_at) {
      throw new BadRequestException('queued_at is required when status is queued');
    } else if (createScanResultDto.status === Status.InProgress && !createScanResultDto.scanning_at) {
      throw new BadRequestException('scanning_at is required when status is in_progress');
    } else if (
      [Status.Success, Status.Failure].includes(createScanResultDto.status) &&
      !createScanResultDto.finished_at
    ) {
      throw new BadRequestException('finished_at is required when status is success or failure');
    }
    return this.scanResultService.create(createScanResultDto);
  }
}
