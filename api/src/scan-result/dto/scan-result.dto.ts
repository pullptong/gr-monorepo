import {
  IsEnum,
  IsString,
  IsDateString,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Status } from '../scan-result.interface';

class BeginDto {
  @IsNumber()
  line: number;
}

class PositionDto {
  @ValidateNested()
  @Type(() => BeginDto)
  begin: BeginDto;
}

class LocationDto {
  @IsString()
  @IsNotEmpty()
  path: string;

  @ValidateNested()
  @Type(() => PositionDto)
  positions: PositionDto;
}

class MetadataDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  severity: string;
}

class FindingDto {
  @IsString()
  type: string;

  @IsString()
  ruleId: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ValidateNested()
  @Type(() => MetadataDto)
  metadata: MetadataDto;
}

export class CreateScanResultDto {
  @IsEnum(Status)
  status: Status;

  @IsString()
  @IsNotEmpty()
  repository_name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FindingDto)
  findings: FindingDto[];

  @IsOptional()
  @IsDateString()
  queued_at: string;

  @IsOptional()
  @IsDateString()
  scanning_at: string;

  @IsOptional()
  @IsDateString()
  finished_at: string;
}
