import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { DatabaseConfig } from './app.interface';
import { AppService } from './app.service';
import config from './config';
import { ScanResult } from './scan-result/entities/scan-result.entity';
import { ScanResultModule } from './scan-result/scan-result.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<DatabaseConfig>('database');
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.name,
          entities: [ScanResult],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    ScanResultModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
