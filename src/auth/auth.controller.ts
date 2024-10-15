import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { SignUpDto } from 'src/dto/sign-up.dto';
import { LoginDto } from 'src/dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get()
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    async getAll() {
        return await this.authService.getAuth();
    }

    @Post('/signup')
    async signUp(@Body() data: SignUpDto): Promise<{ token: string }> {
        return await this.authService.signUp(data);
    }

    @Post('/login')
    async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
        return await this.authService.login(loginDto);
    }

    @Patch('/:id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return await this.authService.updateUser(id, updateUserDto);
    }

    @Delete('/:id')
    async deleteUser(@Param() param) {
        return await this.authService.deleteUser(param.id);
    }
}
