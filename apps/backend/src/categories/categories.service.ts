import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createCategoryDto: CreateCategoryDto) {
    // Check for duplicate name
    const existing = await this.prisma.client.category.findUnique({
      where: {
        userId_name: {
          userId,
          name: createCategoryDto.name,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Category with this name already exists');
    }

    return this.prisma.client.category.create({
      data: {
        ...createCategoryDto,
        userId,
      },
      include: {
        _count: {
          select: { notes: true },
        },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.client.category.findMany({
      where: { userId },
      include: {
        _count: {
          select: { notes: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const category = await this.prisma.client.category.findUnique({
      where: { id },
      include: {
        notes: {
          include: {
            note: {
              include: {
                group: true,
              },
            },
          },
        },
        _count: {
          select: { notes: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return category;
  }

  async update(id: string, userId: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.client.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Check for duplicate name if name is being updated
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existing = await this.prisma.client.category.findUnique({
        where: {
          userId_name: {
            userId,
            name: updateCategoryDto.name,
          },
        },
      });

      if (existing) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    return this.prisma.client.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        _count: {
          select: { notes: true },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const category = await this.prisma.client.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.client.category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  }
}
