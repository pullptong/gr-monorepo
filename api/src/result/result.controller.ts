import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateResultDto } from './dto/result.dto';
import { ResultService } from './result.service';

@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Get()
  getAll() {
    return this.resultService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.resultService.getOne(parseInt(id));
  }

  @Post()
  create(@Body() createResultDto: CreateResultDto) {
    this.resultService.validateStatusAndTimestamp(createResultDto);
    return this.resultService.create(createResultDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateResultDto: CreateResultDto) {
    this.resultService.validateStatusAndTimestamp(updateResultDto);
    return this.resultService.update(id, updateResultDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.resultService.delete(id);
  }
}
