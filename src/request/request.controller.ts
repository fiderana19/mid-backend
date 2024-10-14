import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from 'src/dto/create-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('request')
export class RequestController {
    constructor(private requestService: RequestService) {}

    @UseGuards(AuthGuard())
    @Get()
    async getRequest() {
        return this.requestService.getRequest();
    }

    @UseGuards(AuthGuard())
    @Post()
    async createRequest(
        @Body() createRequestDto: CreateRequestDto, 
        @Req() req,
    ) {
        return await this.requestService.createRequest(createRequestDto, req.user);
    }
}
