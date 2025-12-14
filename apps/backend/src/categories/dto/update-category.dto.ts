import { IsString, IsNotEmpty, MaxLength, IsOptional, Matches } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-F]{6}$/i, {
    message: 'Color must be a valid hex color (e.g., #FF5733)',
  })
  color?: string;
}
