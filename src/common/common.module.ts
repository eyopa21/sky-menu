import { forwardRef, Module } from '@nestjs/common';
import { AuthGuard } from './guard/auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

import { RedisModule } from 'src/redis/redis.module';
import { OwnershipGuard } from './guard/ownership.guard';

@Module({
  imports: [AuthModule, RedisModule, 
    forwardRef(() => UsersModule),
  ],
  providers: [AuthGuard],
  exports: [AuthGuard, RedisModule],
})
export class CommonModule {}
