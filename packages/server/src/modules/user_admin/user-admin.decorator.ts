import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAdmin } from './user_admin.entity';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserAdmin;
  },
);
