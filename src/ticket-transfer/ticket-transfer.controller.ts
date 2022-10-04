import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiResponseHelper } from '@src/common/helpers/api-response.helper';
import { RequestToBodyInterceptor } from '@src/common/interceptors/request-to-body.interceptor';
import { AuthRequest } from '@src/common/types/auth.request';
import { CreateTicketTransferDto } from './dto/create-ticket-transfer.dto';
import { TicketTransfer } from './ticket-transfer.entity';
import { TicketTransferService } from './ticket-transfer.service';

@ApiResponse(ApiResponseHelper.unauthorized())
@Controller('ticket-transfers')
export class TicketTransferController {
  constructor(private readonly ticketTransferService: TicketTransferService) {}

  @ApiOperation({ description: `Get ticket transfer operation by uuid` })
  @ApiResponse(ApiResponseHelper.success(TicketTransfer))
  @ApiResponse(ApiResponseHelper.notFound('Ticket transfer not found'))
  @ApiResponse(ApiResponseHelper.validationErrors(['Validation failed (uuid is expected)']))
  @Get(':uuid')
  async findOne(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<TicketTransfer> {
    const ticketTransfer = await this.ticketTransferService.findByUuid(uuid);

    if (!ticketTransfer) {
      throw new NotFoundException('Ticket transfer not found');
    }

    return ticketTransfer;
  }

  @ApiOperation({ description: `Transfer ticket to another user` })
  @ApiResponse(ApiResponseHelper.success(TicketTransfer, HttpStatus.CREATED))
  @ApiResponse(ApiResponseHelper.validationErrors(['Validation failed (uuid is expected)']))
  @UseInterceptors(ClassSerializerInterceptor, new RequestToBodyInterceptor('ticketProvider', 'ticketProvider'))
  @Post()
  async create(@Body() createDto: CreateTicketTransferDto): Promise<TicketTransfer> {
    return this.ticketTransferService.create(createDto);
  }
}
