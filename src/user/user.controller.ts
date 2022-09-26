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
  @Post()
  async create(@Body() createUserDto: CreateUserValidationDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ description: `Update user properties` })
  @ApiResponse(ApiResponseHelper.success(Event, HttpStatus.CREATED))
  @Patch('/:uuid')
  async update(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserValidationDto) {
    return this.userService.update(uuid, updateUserDto);
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
  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    return this.userService.findByUid(uuid);
  }

  @ApiOperation({ description: `Delete user` })
  @ApiResponse(ApiResponseHelper.success(Event, HttpStatus.CREATED))
  @ApiResponse(ApiResponseHelper.validationErrors(['Validation failed (numeric string is expected)']))
  @Delete('/:uuid')
  async delete(@Param('uuid') uuid: string) {
    return this.userService.remove(uuid);
  }
}
