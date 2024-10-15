import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from 'src/dto/create-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('request')
export class RequestController {
    constructor(private requestService: RequestService) {}

    @Get()
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    async getRequest() {
        return this.requestService.getRequest();
    }

    @Post()
    @UseGuards(AuthGuard())
    async createRequest(
        @Body() createRequestDto: CreateRequestDto, 
        @Req() req,
    ) {
        return await this.requestService.createRequest(createRequestDto, req.user);
    }
}
