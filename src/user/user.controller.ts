import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ApiResponseHelper } from '@src/common/helpers/api-response.helper';
import { CreateUserValidationDto } from './dto/create.user.validation.dto';
import { UpdateUserValidationDto } from './dto/update.user.validation.dto';
import { User } from './user.entity';
import { PagingResult } from 'typeorm-cursor-pagination';
import { UserFilterDto } from './dto/user.filter.dto';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ description: `Create a new user` })
  @ApiResponse(ApiResponseHelper.success(Event, HttpStatus.CREATED))
  @ApiResponse(
    ApiResponseHelper.validationErrors([
      'name must be shorter than or equal to 128 characters',
      'name must be a string',
      'name should not be empty',
      'email must be shorter than or equal to 255 characters',
      'email must be an email',
      'email should not be empty',
      'phoneNumber must be shorter than or equal to 255 characters',
      'phoneNumber must be a valid phone number',
      'phoneNumber should not be empty',
      'walletAddress must be shorter than or equal to 255 characters',
      'walletAddress must be an Ethereum address',
      'walletAddress should not be empty',
      'ticketProviderId must be shorter than or equal to 255 characters',
      'ticketProviderId must be an integer number',
      'ticketProviderId should not be empty',
    ]),
  )
  @Post()
  async create(@Body() createUserDto: CreateUserValidationDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ description: `Update user properties` })
  @ApiResponse(ApiResponseHelper.success(Event, HttpStatus.CREATED))
  @ApiResponse(
    ApiResponseHelper.validationErrors([
      'name must be shorter than or equal to 128 characters',
      'name must be a string',
      'name should not be empty',
      'email must be shorter than or equal to 255 characters',
      'email must be an email',
      'email should not be empty',
      'phoneNumber must be shorter than or equal to 255 characters',
      'phoneNumber must be a valid phone number',
      'phoneNumber should not be empty',
      'walletAddress must be shorter than or equal to 255 characters',
      'walletAddress must be an Ethereum address',
      'walletAddress should not be empty',
      'ticketProviderId must be shorter than or equal to 255 characters',
      'ticketProviderId must be an integer number',
      'ticketProviderId should not be empty',
      'Validation failed (numeric string is expected)',
    ]),
  )
  @Patch('/:userId')
  async update(@Param('userId', ParseIntPipe) userId: number, @Body() updateUserDto: UpdateUserValidationDto) {
    return this.userService.update(userId, updateUserDto);
  }

  @ApiOperation({ description: `Get all user with pagination` })
  @ApiResponse(ApiResponseHelper.success(User))
  @Get()
  async findAllPaginated(@Query() searchParams: UserFilterDto): Promise<PagingResult<User>> {
    return this.userService.findAllPaginated(searchParams);
  }

  @ApiOperation({ description: `Get a user by id` })
  @ApiResponse(ApiResponseHelper.success(User))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed (numeric string is expected)`))
  @Get(':UserId')
  async findOne(@Param('UserId', ParseIntPipe) UserId: number) {
    return this.userService.findById(UserId);
  }

  @ApiOperation({ description: `Delete user` })
  @ApiResponse(ApiResponseHelper.success(Event, HttpStatus.CREATED))
  @ApiResponse(ApiResponseHelper.validationErrors(['Validation failed (numeric string is expected)']))
  @Delete('/:userId')
  async delete(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.remove(userId);
  }
}
