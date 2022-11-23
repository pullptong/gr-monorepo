import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { CreateResultDto } from './dto/result.dto';
import { Result } from './entities/result.entity';
import { Status } from './result.interface';
import { ResultService } from './result.service';

// @ts-ignore
export const repositoryMockFactory: () => Repository<Result> = jest.fn(() => ({
  find: jest.fn((entity) => entity),
  findOneBy: jest.fn((entity) => entity),
  update: jest.fn((entity) => entity),
  insert: jest.fn((entity) => entity),
  create: jest.fn((entity) => entity),
  delete: jest.fn((entity) => entity),
  // ...
}));

describe('ResultController', () => {
  let resultService: ResultService;
  let resultRepository: Repository<Result>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ResultService,
        {
          provide: getRepositoryToken(Result),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    resultService = moduleRef.get<ResultService>(ResultService);
    resultRepository = moduleRef.get(getRepositoryToken(Result));
  });

  describe('getAll', () => {
    it('should return an array of result', async () => {
      const results: Result[] = [
        {
          id: 1,
          repositoryName: 'queued',
          status: Status.Queued,
          queuedAt: new Date(),
          findings: [],
          finishedAt: null,
          scanningAt: null,
        },
      ];

      jest.spyOn(resultRepository, 'find').mockImplementation(() => Promise.resolve(results));

      expect(await resultService.getAll()).toBe(results);
      expect(resultRepository.find).toBeCalledWith({ order: { id: 'DESC' } });
    });
  });

  describe('getOne', () => {
    const id = 1;
    it('should return an result', async () => {
      const result: Result = {
        id: 1,
        repositoryName: 'queued',
        status: Status.Queued,
        queuedAt: new Date(),
        findings: [],
        finishedAt: null,
        scanningAt: null,
      };
      jest.spyOn(resultRepository, 'findOneBy').mockImplementation(() => Promise.resolve(result));

      expect(await resultService.getOne(id)).toBe(result);
      expect(resultRepository.findOneBy).toBeCalledWith({ id });
    });
  });

  describe('create', () => {
    it('should call create with correct params when status is Queued', async () => {
      const createResultDto: CreateResultDto = {
        repository_name: 'queued',
        status: Status.Queued,
        queued_at: new Date().toISOString(),
        findings: [
          {
            type: 'sast',
            ruleId: 'G402',
            location: {
              path: 'connectors/apigateway.go',
              positions: {
                begin: {
                  line: 60,
                },
              },
            },
            metadata: {
              description: 'TLS InsecureSkipVerify set true.',
              severity: 'HIGH',
            },
          },
        ],
        finished_at: undefined,
        scanning_at: undefined,
      };
      const insertResult: InsertResult = {
        raw: '',
        generatedMaps: [],
        identifiers: [],
      };
      const result: Result = {
        id: 1,
        repositoryName: 'queued',
        status: Status.Queued,
        queuedAt: new Date(),
        findings: [],
        finishedAt: null,
        scanningAt: null,
      };
      jest.spyOn(resultRepository, 'create').mockImplementation(() => result);
      jest.spyOn(resultRepository, 'insert').mockImplementation(() => Promise.resolve(insertResult));

      expect(await resultService.create(createResultDto)).toBe(insertResult);
      expect(resultRepository.create).toBeCalledWith({
        status: createResultDto.status,
        repositoryName: createResultDto.repository_name,
        queuedAt: createResultDto.queued_at,
        scanningAt: null,
        finishedAt: null,
        findings: createResultDto.findings,
      });
      expect(resultRepository.insert).toBeCalledWith(result);
    });

    it('should call create with correct params when status is In Progress', async () => {
      const createResultDto: CreateResultDto = {
        repository_name: 'in progress',
        status: Status.InProgress,
        queued_at: undefined,
        findings: [
          {
            type: 'sast',
            ruleId: 'G402',
            location: {
              path: 'connectors/apigateway.go',
              positions: {
                begin: {
                  line: 60,
                },
              },
            },
            metadata: {
              description: 'TLS InsecureSkipVerify set true.',
              severity: 'HIGH',
            },
          },
        ],
        finished_at: undefined,
        scanning_at: new Date().toISOString(),
      };
      const insertResult: InsertResult = {
        raw: '',
        generatedMaps: [],
        identifiers: [],
      };
      const result: Result = {
        id: 1,
        repositoryName: 'in progress',
        status: Status.InProgress,
        queuedAt: null,
        findings: [],
        finishedAt: null,
        scanningAt: new Date(),
      };
      jest.spyOn(resultRepository, 'create').mockImplementation(() => result);
      jest.spyOn(resultRepository, 'insert').mockImplementation(() => Promise.resolve(insertResult));

      expect(await resultService.create(createResultDto)).toBe(insertResult);
      expect(resultRepository.create).toBeCalledWith({
        status: createResultDto.status,
        repositoryName: createResultDto.repository_name,
        queuedAt: null,
        scanningAt: createResultDto.scanning_at,
        finishedAt: null,
        findings: createResultDto.findings,
      });
      expect(resultRepository.insert).toBeCalledWith(result);
    });

    it('should call create with correct params when status is Success or Failure', async () => {
      const createResultDto: CreateResultDto = {
        repository_name: 'success',
        status: Status.Success,
        queued_at: undefined,
        findings: [
          {
            type: 'sast',
            ruleId: 'G402',
            location: {
              path: 'connectors/apigateway.go',
              positions: {
                begin: {
                  line: 60,
                },
              },
            },
            metadata: {
              description: 'TLS InsecureSkipVerify set true.',
              severity: 'HIGH',
            },
          },
        ],
        finished_at: new Date().toISOString(),
        scanning_at: undefined,
      };
      const insertResult: InsertResult = {
        raw: '',
        generatedMaps: [],
        identifiers: [],
      };
      const result: Result = {
        id: 1,
        repositoryName: 'sucess',
        status: Status.Success,
        queuedAt: null,
        findings: [],
        finishedAt: new Date(),
        scanningAt: null,
      };
      jest.spyOn(resultRepository, 'create').mockImplementation(() => result);
      jest.spyOn(resultRepository, 'insert').mockImplementation(() => Promise.resolve(insertResult));

      expect(await resultService.create(createResultDto)).toBe(insertResult);
      expect(resultRepository.create).toBeCalledWith({
        status: createResultDto.status,
        repositoryName: createResultDto.repository_name,
        queuedAt: null,
        scanningAt: null,
        finishedAt: createResultDto.finished_at,
        findings: createResultDto.findings,
      });
      expect(resultRepository.insert).toBeCalledWith(result);
    });
  });

  describe('update', () => {
    const id = 1;
    it('should call update with correct params when status is Queued', async () => {
      const updateResultDto: CreateResultDto = {
        repository_name: 'queued',
        status: Status.Queued,
        queued_at: new Date().toISOString(),
        findings: [
          {
            type: 'sast',
            ruleId: 'G402',
            location: {
              path: 'connectors/apigateway.go',
              positions: {
                begin: {
                  line: 60,
                },
              },
            },
            metadata: {
              description: 'TLS InsecureSkipVerify set true.',
              severity: 'HIGH',
            },
          },
        ],
        finished_at: undefined,
        scanning_at: undefined,
      };
      const updateResult: UpdateResult = {
        raw: '',
        generatedMaps: [],
        affected: 1,
      };
      jest.spyOn(resultRepository, 'update').mockImplementation(() => Promise.resolve(updateResult));

      expect(await resultService.update(id, updateResultDto)).toBe(updateResult);
      expect(resultRepository.update).toBeCalledWith(
        { id },
        {
          status: updateResultDto.status,
          repositoryName: updateResultDto.repository_name,
          queuedAt: updateResultDto.queued_at,
          scanningAt: null,
          finishedAt: null,
          findings: updateResultDto.findings,
        },
      );
    });

    it('should call update with correct params when status is In Progress', async () => {
      const updateResultDto: CreateResultDto = {
        repository_name: 'in progress',
        status: Status.InProgress,
        queued_at: undefined,
        findings: [
          {
            type: 'sast',
            ruleId: 'G402',
            location: {
              path: 'connectors/apigateway.go',
              positions: {
                begin: {
                  line: 60,
                },
              },
            },
            metadata: {
              description: 'TLS InsecureSkipVerify set true.',
              severity: 'HIGH',
            },
          },
        ],
        finished_at: undefined,
        scanning_at: new Date().toISOString(),
      };
      const updateResult: UpdateResult = {
        raw: '',
        generatedMaps: [],
        affected: 1,
      };
      jest.spyOn(resultRepository, 'update').mockImplementation(() => Promise.resolve(updateResult));

      expect(await resultService.update(id, updateResultDto)).toBe(updateResult);
      expect(resultRepository.update).toBeCalledWith(
        { id },
        {
          status: updateResultDto.status,
          repositoryName: updateResultDto.repository_name,
          queuedAt: null,
          scanningAt: updateResultDto.scanning_at,
          finishedAt: null,
          findings: updateResultDto.findings,
        },
      );
    });

    it('should call update with correct params when status is Success or Failure', async () => {
      const updateResultDto: CreateResultDto = {
        repository_name: 'success',
        status: Status.Success,
        queued_at: undefined,
        findings: [
          {
            type: 'sast',
            ruleId: 'G402',
            location: {
              path: 'connectors/apigateway.go',
              positions: {
                begin: {
                  line: 60,
                },
              },
            },
            metadata: {
              description: 'TLS InsecureSkipVerify set true.',
              severity: 'HIGH',
            },
          },
        ],
        finished_at: new Date().toISOString(),
        scanning_at: undefined,
      };
      const updateResult: UpdateResult = {
        raw: '',
        generatedMaps: [],
        affected: 1,
      };
      jest.spyOn(resultRepository, 'update').mockImplementation(() => Promise.resolve(updateResult));

      expect(await resultService.update(id, updateResultDto)).toBe(updateResult);
      expect(resultRepository.update).toBeCalledWith(
        { id },
        {
          status: updateResultDto.status,
          repositoryName: updateResultDto.repository_name,
          queuedAt: null,
          scanningAt: null,
          finishedAt: updateResultDto.finished_at,
          findings: updateResultDto.findings,
        },
      );
    });
  });

  describe('delete', () => {
    const id = 1;
    it('should call delete with correct params', async () => {
      const deleteResult: DeleteResult = {
        raw: '',
        affected: 1,
      };
      jest.spyOn(resultRepository, 'delete').mockImplementation(() => Promise.resolve(deleteResult));

      expect(await resultService.delete(id)).toBe(deleteResult);
      expect(resultRepository.delete).toBeCalledWith({ id });
    });
  });

  describe('validateStatusAndTimestamp', () => {
    it('should throw an error when status is Queued but queued_at is undefined', () => {
      const createResultDto: CreateResultDto = {
        repository_name: 'queued',
        status: Status.Queued,
        queued_at: undefined,
        findings: [],
        finished_at: undefined,
        scanning_at: undefined,
      };
      expect(() => resultService.validateStatusAndTimestamp(createResultDto)).toThrowError(
        'queued_at is required when status is Queued',
      );
    });

    it('should throw an error when status is In Progress but scanning_at is undefined', () => {
      const createResultDto: CreateResultDto = {
        repository_name: 'in progress',
        status: Status.InProgress,
        queued_at: undefined,
        findings: [],
        finished_at: undefined,
        scanning_at: undefined,
      };
      expect(() => resultService.validateStatusAndTimestamp(createResultDto)).toThrowError(
        'scanning_at is required when status is In Progress',
      );
    });

    it('should throw an error when status is Success but finished_at is undefined', () => {
      const createResultDto: CreateResultDto = {
        repository_name: 'finished',
        status: Status.Success,
        queued_at: undefined,
        findings: [],
        finished_at: undefined,
        scanning_at: undefined,
      };
      expect(() => resultService.validateStatusAndTimestamp(createResultDto)).toThrowError(
        'finished_at is required when status is Success or Failure',
      );
    });

    it('should throw an error when status is Failure but finished_at is undefined', () => {
      const createResultDto: CreateResultDto = {
        repository_name: 'finished',
        status: Status.Failure,
        queued_at: undefined,
        findings: [],
        finished_at: undefined,
        scanning_at: undefined,
      };
      expect(() => resultService.validateStatusAndTimestamp(createResultDto)).toThrowError(
        'finished_at is required when status is Success or Failure',
      );
    });

    it('should not throw an error when status is Queued and queued_at is defined', () => {
      const createResultDto: CreateResultDto = {
        repository_name: 'queued',
        status: Status.Queued,
        queued_at: new Date().toISOString(),
        findings: [],
        finished_at: undefined,
        scanning_at: undefined,
      };
      expect(() => resultService.validateStatusAndTimestamp(createResultDto)).not.toThrowError();
    });

    it('should not throw an error when status is In Progress and scanning_at is defined', () => {
      const createResultDto: CreateResultDto = {
        repository_name: 'in progress',
        status: Status.InProgress,
        queued_at: undefined,
        findings: [],
        finished_at: undefined,
        scanning_at: new Date().toISOString(),
      };
      expect(() => resultService.validateStatusAndTimestamp(createResultDto)).not.toThrowError();
    });

    it('should not throw an error when status is Success and finished_at is defined', () => {
      const createResultDto: CreateResultDto = {
        repository_name: 'finished',
        status: Status.Success,
        queued_at: undefined,
        findings: [],
        finished_at: new Date().toISOString(),
        scanning_at: undefined,
      };
      expect(() => resultService.validateStatusAndTimestamp(createResultDto)).not.toThrowError();
    });

    it('should not throw an error when status is Failure and finished_at is defined', () => {
      const createResultDto: CreateResultDto = {
        repository_name: 'finished',
        status: Status.Failure,
        queued_at: undefined,
        findings: [],
        finished_at: new Date().toISOString(),
        scanning_at: undefined,
      };
      expect(() => resultService.validateStatusAndTimestamp(createResultDto)).not.toThrowError();
    });
  });
});
