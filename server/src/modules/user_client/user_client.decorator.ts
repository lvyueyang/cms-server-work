import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserClient } from './user_client.entity';

export const UserByClient = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as UserClient;
});
