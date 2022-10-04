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
import { TicketProviderService } from './ticket-provider.service';
import { ApiResponseHelper } from '@src/common/helpers/api-response.helper';
import { CreateTicketProviderValidationDto } from './dto/create.ticket-provider.validation.dto';
import { UpdateTicketProviderValidationDto } from './dto/update.ticket-provider.validation.dto';
import { TicketProvider } from './ticket-provider.entity';
import { PagingResult } from 'typeorm-cursor-pagination';
import { TicketProviderFilterDto } from './dto/ticket-provider.filter.dto';
import { PaginatedResult } from '@src/common/pagination/pagination.types';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('ticket-providers')
export class TicketProviderController {
  constructor(private readonly ticketProviderService: TicketProviderService) {}

  @ApiOperation({ description: `Create a ticket provider` })
  @ApiResponse(ApiResponseHelper.success(TicketProvider, HttpStatus.CREATED))
  @ApiResponse(ApiResponseHelper.validationError(`Ticket provider is not valid`))
  @Post()
  async create(@Body() createTicketProviderDto: CreateTicketProviderValidationDto) {
    return this.ticketProviderService.create(createTicketProviderDto);
  }

  @ApiOperation({ description: `Update Ticket provider properties` })
  @ApiResponse(ApiResponseHelper.success(TicketProvider, HttpStatus.OK))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed (id is expected)`))
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketProviderDto: UpdateTicketProviderValidationDto,
  ) {
    return this.ticketProviderService.update(id, updateTicketProviderDto);
  }

  @ApiOperation({ description: `Get all ticket providers with pagination` })
  @ApiResponse(ApiResponseHelper.success(PaginatedResult<TicketProvider>))
  @Get()
  async findAllPaginated(@Query() searchParams: TicketProviderFilterDto): Promise<PagingResult<TicketProvider>> {
    return this.ticketProviderService.findAllPaginated(searchParams);
  }

  @ApiOperation({ description: `Get a ticket provider by id` })
  @ApiResponse(ApiResponseHelper.success(TicketProvider))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed (id is expected)`))
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketProviderService.findById(id);
  }

  @ApiOperation({ description: `Delete a ticket providers` })
  @ApiResponse(ApiResponseHelper.success(TicketProvider, HttpStatus.CREATED))
  @ApiResponse(ApiResponseHelper.validationErrors(['Validation failed (id is expected)']))
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.ticketProviderService.remove(id);
  }
}
