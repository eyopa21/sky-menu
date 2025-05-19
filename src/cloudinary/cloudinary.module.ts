import { Module } from '@nestjs/common';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { ConfigModule } from '@nestjs/config';
import cloudinaryConfig from './config/cloudinary,config';

@Module({
  imports: [ConfigModule.forFeature(cloudinaryConfig)],
  controllers: [CloudinaryController],
  providers: [CloudinaryService],
})
export class CloudinaryModule {}
