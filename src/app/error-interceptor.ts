import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
constructor(private dialog: MatDialog){}

  intercept(req: HttpRequest<any>,next: HttpHandler){
    return next.handle(req).pipe(
      catchError(
        (error: HttpErrorResponse) => {
          // console.log(error);
          // alert(error.error.error.message);
          let errorMessage = "An unknown Error occured!";
          if(error.error.message){
               errorMessage = error.error.message;
          }
          this.dialog.open(ErrorComponent,{data: {message: errorMessage}});
          return throwError(error);
        }
      )
    );// here we do not change the req but here we check the response for error and throw that error

  }
}
