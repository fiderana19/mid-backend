import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { SignUpDto } from 'src/dto/sign-up.dto';
import { LoginDto } from 'src/dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { ValidateUserDto } from 'src/dto/validate-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('/all')
    // @Roles(Role.ADMIN)
    // @UseGuards(AuthGuard(), RolesGuard)
    async getAll() {
        return await this.authService.getAuth();
    }

    //Get user by validation
    @Get('/validation/:validation')
    async getUserByValidation(@Param('validation') validation: boolean) {
        return await this.authService.getUserByValidation(validation);
    }

    //Get user by id
    @Get('/get/:id')
    async getUserById(@Param('id') id: string) {
        return await this.authService.getUserById(id);
    }

    //Count user by validation
    @Get('/count/:validation')
    async countUserByValidation(@Param('validation') validation: boolean) {
        return await this.authService.countUserByValidation(validation);
    }

    //Count user by validation
    @Get('/check/:email')
    async checkUser(@Param('email') email: string) {
        return await this.authService.checkUser(email);
    }

    //Create user
    @Post('/signup')
    async signUp(@Body() data: SignUpDto): Promise<any> {
        return await this.authService.signUp(data);
    }

    //Login
    @Post('/login')
    async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
        return await this.authService.login(loginDto);
    }

    //Update user
    @Patch('/update/:id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return await this.authService.updateUser(id, updateUserDto);
    }

    //Validate user
    @Patch('/validate/:id')
    async validateUser(@Param('id') id: string, @Body() validateUserDto: ValidateUserDto) {
        return await this.authService.validateUser(id, validateUserDto);
    }

    //Delete user
    @Delete('/delete/:id')
    async deleteUser(@Param() param) {
        return await this.authService.deleteUser(param.id);
    }
}
