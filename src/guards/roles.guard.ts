import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY , [
      context.getHandler(),
      context.getClass(),
    ])

    if(!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if(!user) {
      return true;
    }

    return matchRoles(requiredRoles, user?.roles);
  }
}

function matchRoles(requiredRoles: string[], userRole: string[]) {
  return requiredRoles.some((role: string) => userRole?.includes(role))
}
