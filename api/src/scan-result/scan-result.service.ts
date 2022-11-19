import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScanResultDto } from './dto/scan-result.dto';
import { ScanResult } from './entities/scan-result.entity';

@Injectable()
export class ScanResultService {
  constructor(
    @InjectRepository(ScanResult)
    private scanResultRepository: Repository<ScanResult>,
  ) {}

  getAll() {
    return this.scanResultRepository.find();
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
}
