import { extname } from 'path';
import { FileFilterCallback } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';

export const editFileName = (req: any, file: any, callback: any) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const imageFileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(new HttpException('Only jpg or png image files are allowed', HttpStatus.UNSUPPORTED_MEDIA_TYPE));
  }
  callback(null, true);
};