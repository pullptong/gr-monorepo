import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateScanResultDto } from './dto/scan-result.dto';
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
    this.scanResultService.validateStatusAndTimestamp(createScanResultDto);
    return this.scanResultService.create(createScanResultDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateScanResultDto: CreateScanResultDto) {
    this.scanResultService.validateStatusAndTimestamp(updateScanResultDto);
    return this.scanResultService.update(id, updateScanResultDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.scanResultService.delete(id);
  }
}
