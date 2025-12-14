import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto, UpdateNoteDto, FilterNotesDto } from './dto';
import { NoteStatus } from '@generated/prisma/client';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createNoteDto: CreateNoteDto) {
    const { categoryIds, ...noteData } = createNoteDto;

    // Verify group ownership
    const group = await this.prisma.client.group.findUnique({
      where: { id: createNoteDto.groupId },
    });

    if (!group || group.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Verify category ownership if provided
    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.prisma.client.category.findMany({
        where: {
          id: { in: categoryIds },
          userId,
        },
      });

      if (categories.length !== categoryIds.length) {
        throw new ForbiddenException('Invalid category IDs');
      }
    }

    return this.prisma.client.note.create({
      data: {
        ...noteData,
        categories: categoryIds
          ? {
              create: categoryIds.map((categoryId) => ({
                category: {
                  connect: { id: categoryId },
                },
              })),
            }
          : undefined,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        group: true,
      },
    });
  }

  async findAll(userId: string, filterDto?: FilterNotesDto) {
    const where: any = {
      group: {
        userId,
      },
    };

    if (filterDto?.status) {
      where.status = filterDto.status;
    }

    if (filterDto?.groupId) {
      where.groupId = filterDto.groupId;
    }

    if (filterDto?.categoryId) {
      where.categories = {
        some: {
          categoryId: filterDto.categoryId,
        },
      };
    }

    return this.prisma.client.note.findMany({
      where,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        group: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const note = await this.prisma.client.note.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        group: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.group.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return note;
  }

  async update(id: string, userId: string, updateNoteDto: UpdateNoteDto) {
    const note = await this.findOne(id, userId);

    const { categoryIds, ...noteData } = updateNoteDto;

    // Verify category ownership if provided
    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.prisma.client.category.findMany({
        where: {
          id: { in: categoryIds },
          userId,
        },
      });

      if (categories.length !== categoryIds.length) {
        throw new ForbiddenException('Invalid category IDs');
      }
    }

    // If categoryIds provided, update the categories
    if (categoryIds !== undefined) {
      // Delete existing categories
      await this.prisma.client.noteCategory.deleteMany({
        where: { noteId: id },
      });

      // Add new categories
      if (categoryIds.length > 0) {
        await this.prisma.client.noteCategory.createMany({
          data: categoryIds.map((categoryId) => ({
            noteId: id,
            categoryId,
          })),
        });
      }
    }

    return this.prisma.client.note.update({
      where: { id },
      data: noteData,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        group: true,
      },
    });
  }

  async archive(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.client.note.update({
      where: { id },
      data: { status: NoteStatus.ARCHIVED },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        group: true,
      },
    });
  }

  async unarchive(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.client.note.update({
      where: { id },
      data: { status: NoteStatus.ACTIVE },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        group: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.client.note.delete({
      where: { id },
    });

    return { message: 'Note deleted successfully' };
  }
}
