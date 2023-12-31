import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UserInfoService } from '../services/userinfo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userId: string; // Add userId property
  userName: string;
  profilePic: string; // Add profilePic property
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService, private userinfoService: UserInfoService){}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    if(this.userIsAuthenticated){
      this.userId = this.authService.getUserId();
      console.log(this.userId);
      this.userinfoService.getUserInfo(this.userId).subscribe((userinfoData) => {
        this.profilePic = userinfoData.profilePic;
        this.userName = userinfoData.username;
      });
    }
   // console.log(this.userIsAuthenticated);
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      console.log(isAuthenticated);
      this.userIsAuthenticated = isAuthenticated;
      if(isAuthenticated){
        this.userId = this.authService.getUserId();
        console.log(this.userId);
        this.userinfoService.getUserInfo(this.userId).subscribe((userinfoData) => {
          this.profilePic = userinfoData.profilePic;
          this.userName = userinfoData.username;
        });
      }
    })
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
