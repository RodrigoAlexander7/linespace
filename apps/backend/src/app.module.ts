import { Module } from "@nestjs/common";
import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";
import { AuthModule } from "@/auth/auth.module";
import { UsersModule } from "@/users/users.module";
import { GroupsModule } from "@/groups/groups.module";
import { NotesModule } from "@/notes/notes.module";
import { CategoriesModule } from "@/categories/categories.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "./prisma/prisma.module";

import { validationSchema } from "./configs/validations";
import configuration from "./configs/configuration";

@Module({
  // Imports are allways modules, not services
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [configuration],
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("authSecret"),
        global: true,
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    GroupsModule,
    NotesModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  // Services by the module it self (no from other module)
  providers: [AppService],
})
export class AppModule {}
