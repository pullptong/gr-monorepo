import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScanResultDto } from './dto/scan-result.dto';
import { ScanResult } from './entities/scan-result.entity';
import { Status } from './scan-result.interface';

@Injectable()
export class ScanResultService {
  constructor(
    @InjectRepository(ScanResult)
    private scanResultRepository: Repository<ScanResult>,
  ) {}

  getAll() {
    return this.scanResultRepository.find({ order: { id: 'DESC' } });
  }

  create(createScanResultDto: CreateScanResultDto) {
    const scanResult = this.scanResultRepository.create({
      status: createScanResultDto.status,
      repositoryName: createScanResultDto.repository_name,
      queuedAt: createScanResultDto.queued_at || null,
      scanningAt: createScanResultDto.scanning_at || null,
      finishedAt: createScanResultDto.finished_at || null,
      findings: createScanResultDto.findings,
    });
    return this.scanResultRepository.insert(scanResult);
  }

  update(id: number, updateScanResultDto: CreateScanResultDto) {
    return this.scanResultRepository.update(
      { id },
      {
        status: updateScanResultDto.status,
        repositoryName: updateScanResultDto.repository_name,
        queuedAt: updateScanResultDto.queued_at || null,
        scanningAt: updateScanResultDto.scanning_at || null,
        finishedAt: updateScanResultDto.finished_at || null,
        findings: updateScanResultDto.findings,
      },
    );
  }

  delete(id: number) {
    return this.scanResultRepository.delete({ id });
  }

  validateStatusAndTimestamp(createScanResultDto: CreateScanResultDto) {
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
  }
}
