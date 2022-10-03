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
import { PagingResult } from 'typeorm-cursor-pagination';
import { PaginatedResult } from '@src/common/pagination/pagination.types';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { TicketProviderApiTokenService } from './ticket-provider-api-token.service';
import { ApiResponseHelper } from '@src/common/helpers/api-response.helper';
import { TicketProviderApiToken } from './ticket-provider-api-token.entity';
import { CreateTicketProviderApiTokenValidationDto } from './dto/create-ticket-provider-api-token.validation.dto';
import { TicketProviderApiTokenFilterDto } from './dto/ticket-provider-api-token.filter.dto';

@UseGuards(JwtAuthGuard)
@Controller('ticket-provider-api-tokens')
export class TicketProviderApiTokenController {
  constructor(private readonly ticketProviderApiTokenService: TicketProviderApiTokenService) {}

  @ApiOperation({ description: `Create a ticket provider api token` })
  @ApiResponse(ApiResponseHelper.success(TicketProviderApiToken, HttpStatus.CREATED))
  @ApiResponse(ApiResponseHelper.validationError(`Ticket provider is not valid`))
  @Post()
  async create(@Body() createTicketProviderApiTokenDto: CreateTicketProviderApiTokenValidationDto) {
    return this.ticketProviderApiTokenService.create(createTicketProviderApiTokenDto);
  }

  @ApiOperation({ description: `Get all ticket provider api tokens with pagination` })
  @ApiResponse(ApiResponseHelper.success(PaginatedResult<TicketProviderApiToken>))
  @Get()
  async findAllPaginated(
    @Query() searchParams: TicketProviderApiTokenFilterDto,
  ): Promise<PagingResult<TicketProviderApiToken>> {
    return this.ticketProviderApiTokenService.findAllPaginated(searchParams);
  }

  @ApiOperation({ description: `Get a ticket provider api token by id` })
  @ApiResponse(ApiResponseHelper.success(TicketProviderApiToken))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed (uuid is expected)`))
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketProviderApiTokenService.findById(id);
  }

  @ApiOperation({ description: `Delete a ticket provider api tokens` })
  @ApiResponse(ApiResponseHelper.success(TicketProviderApiToken, HttpStatus.CREATED))
  @ApiResponse(ApiResponseHelper.validationErrors(['Validation failed (uuid is expected)']))
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.ticketProviderApiTokenService.remove(id);
  }
}
