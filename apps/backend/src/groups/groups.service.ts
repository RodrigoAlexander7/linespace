import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto, UpdateGroupDto } from './dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createGroupDto: CreateGroupDto) {
    return this.prisma.client.group.create({
      data: {
        ...createGroupDto,
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
    return this.prisma.client.group.findMany({
      where: { userId },
      include: {
        _count: {
          select: { notes: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const group = await this.prisma.client.group.findUnique({
      where: { id },
      include: {
        notes: {
          include: {
            categories: {
              include: {
                category: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: { notes: true },
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return group;
  }

  async update(id: string, userId: string, updateGroupDto: UpdateGroupDto) {
    // Check ownership
    const group = await this.prisma.client.group.findUnique({
      where: { id },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.client.group.update({
      where: { id },
      data: updateGroupDto,
      include: {
        _count: {
          select: { notes: true },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    // Check ownership
    const group = await this.prisma.client.group.findUnique({
      where: { id },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.client.group.delete({
      where: { id },
    });

    return { message: 'Group deleted successfully' };
  }
}
