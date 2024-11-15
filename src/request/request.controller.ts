import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from 'src/dto/create-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { UpdateRequestDto } from 'src/dto/update-request.dto';
import { TreatRequestDto } from 'src/dto/treat-request.dto';

@Controller('request')
export class RequestController {
  constructor(private requestService: RequestService) {}

  //Get all request
  @Get('/all')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async getRequest() {
    return this.requestService.getRequest();
  }

  //Create request
  @Post('/create')
  @UseGuards(AuthGuard())
  async createRequest(@Body() createRequestDto: CreateRequestDto, @Req() req) {
    return await this.requestService.createRequest(createRequestDto, req.user);
  }

  //Get request by user
  @Get('/get/:id')
  async getRequestById(@Param('id') id: string) {
    return await this.requestService.getRequestById(id);
  }

  //Get request by user
  @Get('/user/:id')
  async getRequestByUser(@Param('id') id: string) {
    return await this.requestService.getRequestByUser(id);
  }

  //Count request by user
  @Get('/count/user/:id')
  async countRequestByUser(@Param('id') id: string) {
    return await this.requestService.countRequestByUser(id);
  }

  //Get request by status
  @Get('/status/:status_request')
  async getRequestByStatus(@Param('status_request') status_request: string) {
    return await this.requestService.getRequestByStatus(status_request);
  }

  //Count all request
  @Get('/count/all')
  async countAllRequest() {
    return await this.requestService.countAllRequest();
  }

  //Count request by status
  @Get('/count/status/:status_request')
  async countRequestByStatus(@Param('status_request') status_request: string) {
    return await this.requestService.countRequestByStatus(status_request);
  }

  //Treat request
  @Patch('/accept/:id')
  async acceptRequest(
    @Param('id') id: string,
    @Body() treatRequestDto: TreatRequestDto,
  ) {
    return await this.requestService.acceptRequest(id, treatRequestDto);
  }

  //Treat request
  @Patch('/deny/:id')
  async denyRequest(
    @Param('id') id: string,
    @Body() treatRequestDto: TreatRequestDto,
  ) {
    return await this.requestService.denyRequest(id, treatRequestDto);
  }

  //Update request
  @Patch('/update/:id')
  async updateRequest(
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
  ) {
    return await this.requestService.updateRequest(id, updateRequestDto);
  }

  //Delete request
  @Delete('/delete/:id')
  async deleteRequest(@Param('id') id: string) {
    return await this.requestService.deleteRequest(id);
  }

  //Get request for chart
  @Get('/chart')
  async getRequestForChart() {
    return await this.requestService.getRequestForChart();
  }
}
