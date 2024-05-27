import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { RoleEnum } from './role.enum';
import { AddReportDto } from './dto/add-report.dto';
import { SubscribeDto } from './dto/subscribe.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('report')
  @UseGuards(JwtAuthGuard)
  @Roles([RoleEnum.ADMIN])
  async getReports() {
    return await this.userService.findAllReports();
  }

  @Post('report')
  @UseGuards(JwtAuthGuard)
  async addReport(@Body() addReportDto: AddReportDto) {
    return await this.userService.addReport(addReportDto);
  }

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  async subscribe(@Body() subscribeDto: SubscribeDto) {
    return await this.userService.subscribeToCategory(subscribeDto);
  }

  @Post('unsubscribe')
  @UseGuards(JwtAuthGuard)
  async unsubscribe(@Body() subscribeDto: SubscribeDto) {
    return await this.userService.unsubscribeFromCategory(subscribeDto);
  }

  @Post('issubscribed')
  @UseGuards(JwtAuthGuard)
  async isSubscribed(@Body() subscribeDto: SubscribeDto) {
    return await this.userService.isSubscribed(subscribeDto);
  }
}
