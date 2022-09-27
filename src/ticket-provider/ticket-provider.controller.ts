import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TicketProviderService } from './ticket-provider.service';
import { ApiResponseHelper } from '@src/common/helpers/api-response.helper';
import { CreateTicketProviderValidationDto } from './dto/create.ticket-provider.validation.dto';
import { UpdateTicketProviderValidationDto } from './dto/update.ticket-provider.validation.dto';
import { TicketProvider } from './ticket-provider.entity';
import { PagingResult } from 'typeorm-cursor-pagination';
import { TicketProviderFilterDto } from './dto/ticket-provider.filter.dto';
@Controller('ticket-providers')
export class TicketProviderController {
  constructor(private readonly ticketProviderService: TicketProviderService) {}

  @ApiOperation({ description: `Create a ticket provider` })
  @ApiResponse(ApiResponseHelper.success(Event, HttpStatus.CREATED))
  @Post()
  async create(@Body() createTicketProviderDto: CreateTicketProviderValidationDto) {
    return this.ticketProviderService.create(createTicketProviderDto);
  }

  @ApiOperation({ description: `Update Ticket provider properties` })
  @ApiResponse(ApiResponseHelper.success(Event, HttpStatus.CREATED))
  @Patch('/:uuid')
  async update(@Param('uuid') uuid: string, @Body() updateTicketProviderDto: UpdateTicketProviderValidationDto) {
    return this.ticketProviderService.update(uuid, updateTicketProviderDto);
  }

  @ApiOperation({ description: `Get all ticket providers with pagination` })
  @ApiResponse(ApiResponseHelper.success(TicketProvider))
  @Get()
  async findAllPaginated(@Query() searchParams: TicketProviderFilterDto): Promise<PagingResult<TicketProvider>> {
    return this.ticketProviderService.findAllPaginated(searchParams);
  }

  @ApiOperation({ description: `Get a ticket provider by id` })
  @ApiResponse(ApiResponseHelper.success(TicketProvider))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed (numeric string is expected)`))
  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    return this.ticketProviderService.findByUid(uuid);
  }

  @ApiOperation({ description: `Delete a ticket providers` })
  @ApiResponse(ApiResponseHelper.success(Event, HttpStatus.CREATED))
  @ApiResponse(ApiResponseHelper.validationErrors(['Validation failed (numeric string is expected)']))
  @Delete('/:uuid')
  async delete(@Param('uuid') uuid: string) {
    return this.ticketProviderService.remove(uuid);
  }
}
