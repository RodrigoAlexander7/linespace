import { IsString, IsNotEmpty, MaxLength, IsOptional, IsArray, IsEnum } from 'class-validator';
import { NoteStatus } from '@generated/prisma/client';

export class UpdateNoteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(NoteStatus)
  @IsOptional()
  status?: NoteStatus;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];
}
