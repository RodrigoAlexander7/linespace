import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto, UpdateGroupDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt.strategy';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Request() req, @Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(req.user.userId, createGroupDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.groupsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.groupsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupsService.update(id, req.user.userId, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.groupsService.remove(id, req.user.userId);
  }
}
