import { Component, OnDestroy, OnInit } from "@angular/core";
import { SubscribableOrPromise, Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy{
  constructor(private authService: AuthService){}
  authStatusListenerSubs: Subscription;
  userIsAuthenticated = false;

  ngOnInit(){
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusListenerSubs = this.authService.getAuthStatusListerner().subscribe(isAuthenticated => this.userIsAuthenticated = isAuthenticated);
  }
  ngOnDestroy(){
    this.authStatusListenerSubs.unsubscribe();
  }
  onLogout(){
    this.authService.logout();
  }
}
