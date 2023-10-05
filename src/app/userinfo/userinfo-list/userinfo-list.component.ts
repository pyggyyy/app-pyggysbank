import { UserInfo } from '../userinfo.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { UserInfoService } from 'src/app/services/userinfo.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-userinfo-list',
  templateUrl: './userinfo-list.component.html',
  styleUrls: ['./userinfo-list.component.css']
})
export class UserInfoListComponent implements OnInit, OnDestroy {
  private userinfoId: string;
  userinfo: UserInfo;
  isLoading = false;

  userId: string;

  name: string;
  profile:string;
  net: number;

  private authStatusSub: Subscription;

  constructor(
    public userinfoService: UserInfoService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus) => {
      this.isLoading = false;
    });

    

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userinfoId')) {
        this.userId = paramMap.get('userinfoId');
        this.userinfoId = paramMap.get('userinfoId');
        this.isLoading = true;
        this.userinfoService.getUserInfo(this.userinfoId).subscribe((userinfoData) => {
          this.isLoading = false;
          
          
          this.net = userinfoData.net;
          this.name = userinfoData.username;
          this.profile = userinfoData.profilePic;

          
        });
      } else {
        alert('leave');
      }
    });
  }

  

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
