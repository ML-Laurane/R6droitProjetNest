import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      if (!request.headers['authorization']) {
        throw new ForbiddenException(
          'You are not allowed to access this resource',
        );
      }
      const token = request.headers['authorization'].replace('Bearer ', ' ');
      const res = await fetch(`http://localhost:4500/introspect/${token}`);
      const data = await res.json();
      if (data.error) {
        throw new ForbiddenException(
          'You are not allowed to access this resource',
        );
      }
      return true;
    }
  }