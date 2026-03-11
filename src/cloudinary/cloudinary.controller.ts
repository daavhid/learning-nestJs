import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { TransformDto } from 'src/_cores/interceptors/response.interceptor';
import { CloudinaryresponseDto } from './dtos/response.dto';
import { CloudinaryService } from './cloudinary.service';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('cloudinary')
@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @ApiOperation({ summary: 'Upload single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  @TransformDto(CloudinaryresponseDto)
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.cloudinaryService.uploadFile(file);
  }

  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Files to upload',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Files uploaded successfully' })
  @Post('upload/multiple-files')
  @TransformDto(CloudinaryresponseDto)
  @UseInterceptors(FilesInterceptor('files'))
  uploadMultipleFile(@UploadedFiles() files: Express.Multer.File[]) {
    console.log(files);
    return this.cloudinaryService.uploadMultipleFiles(files);
  }
}
