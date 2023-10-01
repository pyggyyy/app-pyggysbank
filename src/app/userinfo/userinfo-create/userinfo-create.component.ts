import { UserInfo } from './../userinfo.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { UserInfoService } from 'src/app/services/userinfo.service';
import { mimeType } from './mimi-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-userinfo-create',
  templateUrl: './userinfo-create.component.html',
  styleUrls: ['./userinfo-create.component.css']
})
export class UserInfoCreateComponent implements OnInit, OnDestroy {
  private mode = 'create';
  private userinfoId: string;
  userinfo: UserInfo;
  isLoading = false;

  // Edit Img Preview
  userinfoHasImg = false;
  userinfoExistingImg: string;

  // Define Form on TS
  form: FormGroup;

  imagePreview: string;

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

    this.form = new FormGroup({
      'username': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'bio': new FormControl(null),
      'profilePic': new FormControl(null, { asyncValidators: [mimeType] })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userinfoId')) {
        this.mode = 'edit';
        this.userinfoId = paramMap.get('userinfoId');
        this.isLoading = true;
        this.userinfoService.getUserInfo(this.userinfoId).subscribe((userinfoData) => {
          this.isLoading = false;
          console.log(userinfoData);
          this.userinfo = {
            id: userinfoData._id,
            username: userinfoData.username,
            bio: userinfoData.bio,
            profilePic: userinfoData.profilePic,
            creator: userinfoData.creator,
            net: userinfoData.net
          };
          this.net = userinfoData.net;
          console.log(this.userinfo.id);
          console.log(this.userinfo.creator);
          console.log(this.net);

          if (this.userinfo.profilePic) {
            this.userinfoHasImg = true;
            this.userinfoExistingImg = this.userinfo.profilePic;
          }

          this.form.setValue({
            username: this.userinfo.username,
            bio: this.userinfo.bio,
            profilePic: this.userinfo.profilePic,
          });
        });
      } else {
        this.mode = 'create';
        this.userinfoId = null;
      }
    });
  }

  // Image Upload Method
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ 'profilePic': file });
    this.form.get('profilePic').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // Create or Edit User Info
  onCreate() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
        console.log('creating');
      this.userinfoService.createUserInfo(this.form.value.username, this.form.value.bio, this.form.value.profilePic);
    } else {
      // Edit
      this.userinfoService.updateUserInfo(this.userinfo.id, this.form.value.username, this.form.value.bio, this.form.value.profilePic, this.net);
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
