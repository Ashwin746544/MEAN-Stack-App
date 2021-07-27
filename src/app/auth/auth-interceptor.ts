import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
@Injectable()
export class AuthInterceptor implements HttpInterceptor{
  constructor(private authService: AuthService){}
  intercept(req: HttpRequest<any>,next: HttpHandler){
    const authToken = this.authService.getToken();
    console.log("token is:" +authToken);
    let authRequest = req.clone({headers: req.headers.set("Authorization","Bearer " + authToken)}); //"Bearer token" is a convention all api use,you can also send only token without concatenation with "Bearer"
    return next.handle(authRequest);
    //here above if we change req header without cloning it then there may be chnace to get unwanted result so here we clone req,change header and then pass it.
  }
}
