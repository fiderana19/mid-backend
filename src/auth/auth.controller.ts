import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { SignUpDto } from 'src/dto/sign-up.dto';
import { LoginDto } from 'src/dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { UpdateUserPasswordForFirstLogin } from 'src/dto/update-user-password-first-login.dto';
import { UpdateUserPassword } from 'src/dto/update-user-paswword.dto';
import {
  FileFieldsInterceptor,
} from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/all')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAll() {
    return await this.authService.getAuth();
  }

  //Get user by validation
  @Get('/validation/:validation')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async getUserByValidation(@Param('validation') validation: boolean) {
    return await this.authService.getUserByValidation(validation);
  }

  //Get user by id
  @Get('/get/:id')
  @Roles(Role.ADMIN,Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async getUserById(@Param('id') id: string) {
    return await this.authService.getUserById(id);
  }

  //Get user first login by id
  @Get('/firstlogin/:id')
  @Roles(Role.ADMIN,Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async checkUserFirstLogin(@Param('id') id: string) {
    return await this.authService.checkUserFirstLogin(id);
  }

  @Get('/chart')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async countUserForChart() {
    return await this.authService.countUserStat();
  }

  //Count user by validation
  @Get('/count/:validation')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profile_photo', maxCount: 1 },
      { name: 'cni_photo', maxCount: 1 },
    ]),
  )
  async signUp(
    @Body() data: SignUpDto,
    @UploadedFiles()
    files: {
      profile_photo?: Express.Multer.File[];
      cni_photo?: Express.Multer.File[];
    },
  ): Promise<any> {
    return await this.authService.signUp(
      data,
      files.profile_photo,
      files.cni_photo,
    );
  }

  //Login
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return await this.authService.login(loginDto);
  }

  //Update user
  @Patch('/update/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.authService.updateUser(id, updateUserDto);
  }

  //Update user password for first login
  @Patch('/first/password/:id')
  @Roles(Role.ADMIN,Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async initializePassword(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserPasswordForFirstLogin,
  ) {
    return await this.authService.initializePassword(id, updateUserDto);
  }

  //Update user password
  @Patch('/password/:id')
  @Roles(Role.ADMIN,Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async updateUserPassword(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserPassword,
  ) {
    return await this.authService.updateUserPassword(id, updateUserDto);
  }

  //Validate user
  @Patch('/validate/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async validateUser(@Param('id') id: string) {
    return await this.authService.validateUser(id);
  }

  //Delete user
  @Delete('/delete/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async deleteUser(@Param() param) {
    return await this.authService.deleteUser(param.id);
  }

  //Get latest user
  @Get('/latest/')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async getLatestUser() {
    return await this.authService.getLatestUser();
  }
}
