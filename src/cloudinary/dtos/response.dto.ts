import { Expose } from 'class-transformer';

export class CloudinaryresponseDto {
  @Expose()
  width: number;
  @Expose()
  height: number;
  @Expose()
  format: string;
  @Expose()
  public_id: string;
  @Expose()
  resource_type: string;
  @Expose()
  created_at: Date;
  @Expose()
  type: string;
  @Expose()
  placeholder: boolean;
  @Expose({ name: 'secure_url' })
  url: string;
  @Expose()
  asset_folder: string;
  @Expose()
  display_name: string;
  @Expose()
  version: string;
}
