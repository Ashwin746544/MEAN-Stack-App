import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit,OnDestroy{
  constructor(private authService: AuthService){}
isLoading = false;
authStatusSubs: Subscription;

ngOnInit(){
   this.authStatusSubs = this.authService.getAuthStatusListerner().subscribe(
     authStatus => {
       this.isLoading = false;
     }
   )
}
onSignup(form: NgForm){
  if(form.invalid){
    return;
  }
  this.isLoading = true;
  this.authService.createUser(form.value.email,form.value.password);
}
ngOnDestroy(){
  this.authStatusSubs.unsubscribe();
}
}
