import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { CreateResultDto } from './dto/result.dto';
import { Result } from './entities/result.entity';
import { ResultController } from './result.controller';
import { Status } from './result.interface';
import { ResultService } from './result.service';

// @ts-ignore
export const repositoryMockFactory: () => Repository<Result> = jest.fn(() => ({
  find: jest.fn((entity) => entity),
  findOneBy: jest.fn((entity) => entity),
  // ...
}));

describe('ResultController', () => {
  let resultController: ResultController;
  let resultService: ResultService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ResultController],
      providers: [
        ResultService,
        {
          provide: getRepositoryToken(Result),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    resultService = moduleRef.get<ResultService>(ResultService);
    resultController = moduleRef.get<ResultController>(ResultController);
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
      jest.spyOn(resultService, 'getAll').mockImplementation(() => Promise.resolve(results));

      expect(await resultController.getAll()).toBe(results);
    });
  });

  describe('getOne', () => {
    const id = '1';
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
      jest.spyOn(resultService, 'getOne').mockImplementation(() => Promise.resolve(result));

      expect(await resultController.getOne(id)).toBe(result);
      expect(resultService.getOne).toBeCalledWith(1);
    });
  });

  describe('create', () => {
    it('should call create with correct params', async () => {
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
      jest.spyOn(resultService, 'create').mockImplementation(() => Promise.resolve(insertResult));
      jest.spyOn(resultService, 'validateStatusAndTimestamp').mockImplementation(() => Promise.resolve(undefined));

      expect(await resultController.create(createResultDto)).toBe(insertResult);
      expect(resultService.validateStatusAndTimestamp).toBeCalledWith(createResultDto);
      expect(resultService.create).toBeCalledWith(createResultDto);
    });
  });

  describe('update', () => {
    const id = '1';
    it('should call update with correct params', async () => {
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
      jest.spyOn(resultService, 'update').mockImplementation(() => Promise.resolve(updateResult));
      jest.spyOn(resultService, 'validateStatusAndTimestamp').mockImplementation(() => Promise.resolve(undefined));

      expect(await resultController.update(id, updateResultDto)).toBe(updateResult);
      expect(resultService.validateStatusAndTimestamp).toBeCalledWith(updateResultDto);
      expect(resultService.update).toBeCalledWith(1, updateResultDto);
    });
  });

  describe('delete', () => {
    const id = '1';
    it('should call delete with correct params', async () => {
      const deleteResult: DeleteResult = {
        raw: '',
        affected: 1,
      };
      jest.spyOn(resultService, 'delete').mockImplementation(() => Promise.resolve(deleteResult));

      expect(await resultController.delete(id)).toBe(deleteResult);
      expect(resultService.delete).toBeCalledWith(1);
    });
  });
});
