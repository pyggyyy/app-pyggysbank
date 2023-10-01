import { Injectable } from '@angular/core';
import { UserInfo } from '../userinfo/userinfo.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from './../../environments/environment';

const BACKENDURL = environment.apiUrl + 'userinfo/';

@Injectable({ providedIn: 'root' })
export class UserInfoService {
  private userinfos: UserInfo[] = [];
  private userinfosUpdated = new Subject<{ userinfos: UserInfo[]; userinfoCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}



  getUserInfoUpdateListener() {
    return this.userinfosUpdated.asObservable();
  }


  getUserInfo(id: string) {
    return this.http.get<{ _id: string; username: string; bio: string; profilePic: string; creator: string, net:number }>(BACKENDURL + id);
  }

  createUserInfo(username:string, bio:string, image: File){
        const userinfoData = new FormData();
        userinfoData.append('username', username);
        if(bio){
            userinfoData.append('bio', bio);
        }
        else{
            userinfoData.append('content', '');
        }
        if(image){
            userinfoData.append('image', image, username);
        }
        console.log(userinfoData);
        this.http.post<{message:string, userinfo: UserInfo}>(BACKENDURL,userinfoData)
        .subscribe(responseData => {
            console.log(responseData);
            this.router.navigate(['/']);
        });
    }

  updateUserInfo(id: string, username: string, bio: string, profilePic: File | string, net: number) {
    let userinfoData: UserInfo | FormData;
    if (typeof profilePic === 'object') {
      userinfoData = new FormData();
      userinfoData.append('id', id);
      userinfoData.append('username', username);
      if (bio) {
        userinfoData.append('bio', bio);
      } else {
        userinfoData.append('bio', '');
      }
      if (profilePic) {
        userinfoData.append('profilePic', profilePic, username);
      }
    } else {
      userinfoData = {
        id: id,
        username: username,
        bio: bio,
        profilePic: profilePic as string,
        net: net,
        creator: null,
      };
    }
    this.http.put(BACKENDURL + id, userinfoData).subscribe((response) => {
      this.router.navigate(['/']);
    });
  }
}
