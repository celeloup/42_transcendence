import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/RegisterDto';
import RequestWithUser from './requestWithUser.interface';
export declare class AuthenticationController {
    private readonly authenticationService;
    constructor(authenticationService: AuthenticationService);
    register(registrationData: RegisterDto): Promise<import("../users/user.entity").default>;
    authenticate(request: RequestWithUser): import("../users/user.entity").default;
    logIn(request: RequestWithUser): Promise<import("../users/user.entity").default>;
    logOut(request: RequestWithUser): Promise<void>;
}
