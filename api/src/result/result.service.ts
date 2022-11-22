import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateResultDto } from './dto/result.dto';
import { Result } from './entities/result.entity';
import { Status } from './result.interface';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(Result)
    private resultRepository: Repository<Result>,
  ) {}

  getAll() {
    return this.resultRepository.find({ order: { id: 'DESC' } });
  }

  getOne(id: number) {
    return this.resultRepository.findOneBy({ id });
  }

  create(createResultDto: CreateResultDto) {
    const result = this.resultRepository.create({
      status: createResultDto.status,
      repositoryName: createResultDto.repository_name,
      queuedAt: createResultDto.queued_at || null,
      scanningAt: createResultDto.scanning_at || null,
      finishedAt: createResultDto.finished_at || null,
      findings: createResultDto.findings,
    });
    return this.resultRepository.insert(result);
  }

  update(id: number, updateResultDto: CreateResultDto) {
    return this.resultRepository.update(
      { id },
      {
        status: updateResultDto.status,
        repositoryName: updateResultDto.repository_name,
        queuedAt: updateResultDto.queued_at || null,
        scanningAt: updateResultDto.scanning_at || null,
        finishedAt: updateResultDto.finished_at || null,
        findings: updateResultDto.findings,
      },
    );
  }

  delete(id: number) {
    return this.resultRepository.delete({ id });
  }

  validateStatusAndTimestamp(createResultDto: CreateResultDto) {
    if (createResultDto.status === Status.Queued && !createResultDto.queued_at) {
      throw new BadRequestException('queued_at is required when status is queued');
    } else if (createResultDto.status === Status.InProgress && !createResultDto.scanning_at) {
      throw new BadRequestException('scanning_at is required when status is in_progress');
    } else if ([Status.Success, Status.Failure].includes(createResultDto.status) && !createResultDto.finished_at) {
      throw new BadRequestException('finished_at is required when status is success or failure');
    }
  }
}
