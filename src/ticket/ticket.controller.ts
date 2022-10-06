import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { ApiResponseHelper } from '@src/common/helpers/api-response.helper';
import { CreateTicketValidationDto } from './dto/create.ticket.validation.dto';
import { UpdateTicketValidationDto } from './dto/update.ticket.validation.dto';
import { Ticket } from './ticket.entity';
import { PagingResult } from 'typeorm-cursor-pagination';
import { TicketFilterDto } from './dto/ticket.filter.dto';
import { PaginatedResult } from '@src/common/pagination/pagination.types';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';

@ApiResponse(ApiResponseHelper.unauthorized())
@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @ApiOperation({ description: `Create a ticket ` })
  @ApiResponse(ApiResponseHelper.success(Ticket, HttpStatus.CREATED))
  @Post()
  async create(@Body() createTicketDto: CreateTicketValidationDto) {
    return this.ticketService.create(createTicketDto);
  }

  @ApiOperation({ description: `Update Ticket  properties` })
  @ApiResponse(ApiResponseHelper.success(Ticket, HttpStatus.OK))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed (uuid is expected)`))
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateTicketDto: UpdateTicketValidationDto) {
    return this.ticketService.update(id, updateTicketDto);
  }

  @ApiOperation({ description: `Get all ticket s with pagination` })
  @ApiResponse(ApiResponseHelper.success(PaginatedResult<Ticket>))
  @Get()
  async findAllPaginated(@Query() searchParams: TicketFilterDto): Promise<PagingResult<Ticket>> {
    return this.ticketService.findAllPaginated(searchParams);
  }

  @ApiOperation({ description: `Get a ticket  by id` })
  @ApiResponse(ApiResponseHelper.success(Ticket))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed (uuid is expected)`))
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.findById(id);
  }

  @ApiOperation({ description: `Delete a ticket s` })
  @ApiResponse(ApiResponseHelper.success(Ticket, HttpStatus.CREATED))
  @ApiResponse(ApiResponseHelper.validationErrors(['Validation failed (uuid is expected)']))
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.remove(id);
  }
}
