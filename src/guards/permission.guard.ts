import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { REQUIRED_PERMISSIONS_KEY } from 'src/decorators/permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    // Intentional
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissionsRequired = this.reflector.get<string[]>(
      REQUIRED_PERMISSIONS_KEY,
      context.getHandler(),
    );

    console.log(permissionsRequired);

    if (!permissionsRequired?.length) {
      return true;
    }

    const request = GqlExecutionContext.create(context).getContext().req;

    console.log(request?.user);

    /* TODO: Cambiar por chequeo de permisos */
    return true;
  }
}
