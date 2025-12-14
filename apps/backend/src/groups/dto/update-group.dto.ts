import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class UpdateGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @IsOptional()
  name?: string;
}
