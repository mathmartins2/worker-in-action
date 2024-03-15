import { Module } from '@nestjs/common';
import { ReportController } from './app.controller';
import { ReportService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyEntity } from './entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      username: 'example',
      password: 'example',
      database: 'example',
      port: 5432,
      synchronize: true,
      logging: true,
      entities: [MyEntity],
    }),
    TypeOrmModule.forFeature([MyEntity]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class AppModule {}
