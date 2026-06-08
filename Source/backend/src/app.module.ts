import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { DistrictModule } from './district/district.module';
import { InfrastructureTypeModule } from './infrastructure-type/infrastructure-type.module';
import { InfrastructureObjectModule } from './infrastructure-object/infrastructure-object.module';
import { EventModule } from './event/event.module';
import { AuthModule } from './auth/auth.module';
import { AuthUser } from './auth/auth-user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '112233',
      database: 'district',
      autoLoadEntities: true,
      synchronize: false, 
    }),
    JwtModule.register({
      global: true,
      secret: 'my-super-secret-key-123', 
      signOptions: { expiresIn: '1d' },
    }),
    UsersModule,
    DistrictModule,
    InfrastructureTypeModule,
    InfrastructureObjectModule,
    EventModule,
    AuthModule,
  ],
})
export class AppModule {}