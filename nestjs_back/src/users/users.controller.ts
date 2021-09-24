import { Body, Controller, Put, Req, Get, Res, UseGuards, Param, Delete, SerializeOptions, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import FindOneParams from '../utils/findOneParams';
import UsersService from './users.service';
import User from './user.entity';
import UpdateUserDto from './dto/updateUser.dto';
import RequestWithUser from '../authentication/interface/requestWithUser.interface';
import JwtTwoFactorGuard from '../authentication/guard/jwtTwoFactor.guard';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import AddFriendDto from './dto/addFriend.dto';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-uploading.utils';
import { extname } from  'path';

@SerializeOptions({
  groups: ['users']
})
@ApiTags('users')
@Controller('users')
export default class UsersController {
  SERVER_URL:  string  =  "http://localhost:8080/";
  constructor(
    private readonly userService: UsersService
  ) { }

  @UseGuards(JwtTwoFactorGuard)
  @ApiOperation({ summary: "Update the user" })
  @ApiBearerAuth('bearer-authentication')
  @ApiCookieAuth('cookie-authentication')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: User
  })
  @Put('me')
  async changeName(@Req() req: RequestWithUser, @Body() user: UpdateUserDto): Promise<User> {
    return this.userService.changeName(req.user.id, user);
  }

@Post('avatar/:id')
   @UseInterceptors(FileInterceptor('file',
      {
        storage: diskStorage({
          destination: './files',
        filename: editFileName,
        // , 
        //   filename: (req, file, cb) => {
        //   const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        //   return cb(null, `${randomName}${extname(file.originalname)}`)
        //}
        }),
        fileFilter: imageFileFilter,
      }
    )
    )
  async uploadAvatar(@Param() { id }:FindOneParams, @UploadedFile() file: Express.Multer.File) {
      this.userService.setAvatar(Number(id), `${this.SERVER_URL}${file.path}`);
  }

   @Get('avatar/:id')
  async serveAvatar(@Param() { id }:FindOneParams, @Res() res: any): Promise<any> {
    res.sendFile(id, { root: './files' });
    //(id, { root: '/home/user42/Transcendance/nestjs_back/files'});
  }

  // async uploadedFile(@Param() id: FindOneParams, @UploadedFile() file: Express.Multer.File) {
    
  //   const response = {
  //     originalname: file.originalname,
  //     filename: file.filename,
  //   };
  //   return response;
  // }

  @Delete('/:id')
  @ApiOperation({ summary: "Delete a user//Not working so far" })
  async deleteUser(@Param() { id }: FindOneParams) {
    return this.userService.deleteUser(Number(id));
  }

  @Get()
  @ApiOperation({ summary: "Get all the users" })
  GetAllUsers() {
    return this.userService.getAllUsers();
  }

  @ApiParam({ name: 'id', type: Number, description: 'user id' })
  @Get(':id')
  @ApiOperation({ summary: "Get a user" })
  getById(@Param() { id }: FindOneParams) {
    return this.userService.getById(Number(id));
  }

  @ApiParam({ name: 'id', type: Number, description: 'user id' })
  @Get('matches/:id')
  @ApiOperation({ summary: "Get matches of a user" })
  getMatchesByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getMatchesByUserId(Number(id));
  }

  @ApiParam({ name: 'id', type: Number, description: 'user id' })
  @Get('channels/:id')
  @ApiOperation({ summary: "Get channels of a user" })
  getChannelsByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getChannelsByUserId(Number(id));
  }

  @ApiParam({ name: 'id', type: Number, description: 'user id' })
  @Get('achievements/:id')
  @ApiOperation({ summary: "Get achievements of a user" })
  getAchievementsByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getAchievementsByUserId(Number(id));
  }

  @ApiParam({ name: 'id', type: Number, description: 'user id' })
  @Get('friends/:id')
  @ApiOperation({ summary: "Get friends of a user" })
  getFriendsByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getFriendsByUserId(Number(id));
  }

  @ApiParam({ name: 'id', type: Number, description: 'user id' })
  @Get('infos/:id')
  @ApiOperation({ summary: "Get infos of a user" })
  getAllInfosByUserId(@Param() { id }: FindOneParams) {
    return this.userService.getAllInfosByUserId(Number(id));
  }

  @ApiParam({ name: 'id', type: Number, description: 'user id' })
  @Put('friend/:id')
  @ApiOperation({ summary: "Add a fiend to a user" })
  addAFriend(@Param() { id }: FindOneParams, @Body() friend: AddFriendDto) {
    return this.userService.addAFriend(Number(id), friend.friendId);
  }

  @ApiParam({ name: 'id', type: Number, description: 'user id' })
  @Delete('friend/:id')
  @ApiOperation({ summary: "Delete a fiend to a user" })
  deleteAFriend(@Param() { id }: FindOneParams, @Body() friend: AddFriendDto) {
    return this.userService.deleteAFriend(Number(id), friend.friendId);
  }

  @ApiParam({ name: 'id', type: Number, description: 'user id' })
  @Put('block/:id')
  @ApiOperation({ summary: "Block a user for another user" })
  blockAUser(@Param() { id }: FindOneParams, @Body() friend: AddFriendDto) {
    return this.userService.blockAUser(Number(id), friend.friendId);
  }

  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
    type: User
  })
  @ApiParam({ name: 'id', type: Number, description: 'user id' })
  @Delete('block/:id')
  @ApiOperation({ summary: "Unblock a user for another user" })
  unblockAUser(@Param() { id }: FindOneParams, @Body() friend: AddFriendDto) {
    return this.userService.unblockAUser(Number(id), friend.friendId);
  }
}