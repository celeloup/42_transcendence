import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-oauth2';
import AuthenticationService from '../authentication.service';

@Injectable()
export default class FortyTwoStrategy extends PassportStrategy(Strategy, '42')
{
	constructor(
		private readonly configService: ConfigService,
		private authService: AuthenticationService,
		private http: HttpService
	) {
		super({
			authorizationURL: `${configService.get('OAUTH_URL')}authorize?client_id=${configService.get('OAUTH_CLIENT_ID')}&redirect_uri=${configService.get('OAUTH_CALLBACK_PARAM')}&response_type=code`,
			tokenURL        : `${configService.get('OAUTH_URL')}token`,
			clientID        : configService.get('OAUTH_CLIENT_ID'),
			clientSecret    : configService.get('OAUTH_CLIENT_SECRET'),
			callbackURL     : configService.get('OAUTH_CALLBACK_URL'),
			scope           : configService.get('OAUTH_SCOPE'),
		});
	}

	async validate(accessToken: string): Promise<any> {
		const { data } = await this.http.get(this.configService.get('OAUTH_ME_URL'), {
			headers: { Authorization: `Bearer ${ accessToken }` },
		})
		.toPromise();
		const user = await this.authService.findUserFrom42Id(data.id);
		if (user) {
			return user;
		}
		return this.authService.register({
			id42: data.id,
			email: data.email,
			name: data.login
		});
	}
}