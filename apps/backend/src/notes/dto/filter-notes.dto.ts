import { IsEnum, IsOptional, IsString } from 'class-validator';
import { NoteStatus } from '@generated/prisma/client';

export class FilterNotesDto {
  @IsEnum(NoteStatus)
  @IsOptional()
  status?: NoteStatus;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  groupId?: string;
}
