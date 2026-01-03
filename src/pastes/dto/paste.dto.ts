
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreatePasteDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  ttl_seconds?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  max_views?: number;
}
