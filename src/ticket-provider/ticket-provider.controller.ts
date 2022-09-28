import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TicketProviderService } from './ticket-provider.service';
import { ApiResponseHelper } from '@src/common/helpers/api-response.helper';
import { CreateTicketProviderValidationDto } from './dto/create.ticket-provider.validation.dto';
import { UpdateTicketProviderValidationDto } from './dto/update.ticket-provider.validation.dto';
import { TicketProvider } from './ticket-provider.entity';
import { PagingResult } from 'typeorm-cursor-pagination';
import { TicketProviderFilterDto } from './dto/ticket-provider.filter.dto';
import { PaginatedResult } from '@src/common/pagination/pagination.types';
@Controller('ticket-providers')
export class TicketProviderController {
  constructor(private readonly ticketProviderService: TicketProviderService) {}

  @ApiOperation({ description: `Create a ticket provider` })
  @ApiResponse(ApiResponseHelper.success(TicketProvider, HttpStatus.CREATED))
  @Post()
  async create(@Body() createTicketProviderDto: CreateTicketProviderValidationDto) {
    return this.ticketProviderService.create(createTicketProviderDto);
  }

  @ApiOperation({ description: `Update Ticket provider properties` })
  @ApiResponse(ApiResponseHelper.success(TicketProvider, HttpStatus.OK))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed (uuid is expected)`))
  @Patch(':uuid')
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateTicketProviderDto: UpdateTicketProviderValidationDto,
  ) {
    return this.ticketProviderService.update(uuid, updateTicketProviderDto);
  }

  @ApiOperation({ description: `Get all ticket providers with pagination` })
  @ApiResponse(ApiResponseHelper.success(PaginatedResult<TicketProvider>))
  @Get()
  async findAllPaginated(@Query() searchParams: TicketProviderFilterDto): Promise<PagingResult<TicketProvider>> {
    return this.ticketProviderService.findAllPaginated(searchParams);
  }

  @ApiOperation({ description: `Get a ticket provider by id` })
  @ApiResponse(ApiResponseHelper.success(TicketProvider))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed (uuid is expected)`))
  @Get(':uuid')
  async findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.ticketProviderService.findByUuid(uuid);
  }

  @ApiOperation({ description: `Delete a ticket providers` })
  @ApiResponse(ApiResponseHelper.success(TicketProvider, HttpStatus.CREATED))
  @ApiResponse(ApiResponseHelper.validationErrors(['Validation failed (uuid is expected)']))
  @Delete(':uuid')
  async delete(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.ticketProviderService.remove(uuid);
  }
}
