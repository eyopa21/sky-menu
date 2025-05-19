import { Module } from '@nestjs/common';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { ConfigModule } from '@nestjs/config';
import cloudinaryConfig from './config/cloudinary,config';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  imports: [ConfigModule.forFeature(cloudinaryConfig)],
  controllers: [CloudinaryController],
  providers: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
