// cloudinary.service.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary.response';
// import { CloudinaryResponse } from './cloudinary-response';
import streamifier from 'streamifier';
// const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(new Error('Upload failed'));
          resolve(result!);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  uploadMultipleFiles(
    files: Array<Express.Multer.File>,
  ): Promise<CloudinaryResponse[]> {
    return Promise.all(
      files.map(async (file) => {
        const uploadedfile = await this.uploadFile(file);
        return uploadedfile;
      }),
    );
  }

  async deleteFile(public_id: string) {
    try {
      await cloudinary.uploader.destroy(public_id);
      return true;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(error.message);
    }
  }
}
