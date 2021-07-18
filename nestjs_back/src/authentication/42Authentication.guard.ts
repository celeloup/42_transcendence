import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
 
@Injectable()
export default class FortyTwoAuthenticationGuard extends AuthGuard('42') {}