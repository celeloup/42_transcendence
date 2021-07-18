import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpService } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42')
{
	constructor(
		private authService: AuthenticationService,
		private http: HttpService
	) {
		// to put on .env file
		super({
			authorizationURL: "https://api.intra.42.fr/oauth/authorize?client_id=19e5ab89328bbc134e124cc4611ecc7c3fd0d88176bd38eda6e7ee23d649df3b&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fauthentication%2Foauth&response_type=code",
			tokenURL        : "https://api.intra.42.fr/oauth/token",
			clientID        : "19e5ab89328bbc134e124cc4611ecc7c3fd0d88176bd38eda6e7ee23d649df3b",
			clientSecret    : "4ff16f47ecb4026d42903f9c8d182447de87e7b4bc26ffe40ad7f2c92217c363",
			callbackURL     : "http://localhost:8080/api/authentication/oauth",
			scope           : "public",
		});
	}

	async validate(accessToken: string): Promise<any> {
		const { data } = await this.http.get("https://api.intra.42.fr/v2/me", {
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

		// set information on cookie and return ?
	}
}