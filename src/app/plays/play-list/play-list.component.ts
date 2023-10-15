import { Component,  Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {Subscription} from 'rxjs';

import { Play } from './../play.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

//Import Service
import { PlayService } from '../../services/plays.service';
import { TagService } from 'src/app/services/tags.service';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';
import { UserInfoService } from 'src/app/services/userinfo.service';
import { Tag } from '../tag.model';

@Component({
  selector: 'app-play-list',
  templateUrl: './play-list.component.html',
  styleUrls: ['./play-list.component.css']
})
export class PlayListComponent implements OnInit, OnDestroy {
  @Input() userIdProfile: string = '';
  //Declare Variable
  plays: Play[] = [];
  isLoading = false;
  totalPlays = 0;
  playsPerPage = 5;
  currentPage = 1;
  playSizeOptions = [2,5,10];
  userIsAuthenticated = false;
  userId: string;
  panelSpinnerLoading: boolean = false;
  panelUser : string;
  panelNet: number;
  panelPic: string;
  //Tags
  tagIni: boolean = false;
  tags: Tag[] = [];

  form: FormGroup;


  private playsSub: Subscription;
  private authStatusSub: Subscription;
  private tagsSub: Subscription;

  

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public playsService: PlayService, private authService: AuthService, private userinfoService: UserInfoService, private tagService: TagService){};

  ngOnInit() {
    console.log(this.userIdProfile);
    this.isLoading = true;
    console.log(this.userIdProfile);
    this.playsService.getPlays(this.playsPerPage, this.currentPage, this.userIdProfile);
    this.userId = this.authService.getUserId();
    console.log(this.userId);
    this.tagService.getTags(this.userId);
    this.playsSub = this.playsService.getPlayUpdateListener()
    .subscribe((playsData: { plays: Play[], playCount: number }) => {
      this.isLoading = false;
      this.totalPlays = playsData.playCount; // Update totalPlays here
      this.plays = playsData.plays;
      console.log(this.plays);
    });
    //Get Tags
    this.tagsSub = this.tagService.getTagUpdateListener()
    .subscribe((tagsData:{tags: Tag[]}) => {
      this.tags = tagsData.tags;
      console.log(this.tags);
    })
    this.userIsAuthenticated = this.authService.getIsAuth();
    //Set Subscription Listener for Authorizatoin
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
      console.log(this.userId);
    });
    console.log('hrehre');
    this.form = new FormGroup({
      'title': new FormControl(null, [Validators.required, Validators.minLength(3)]),
    });
  }

  onPanelOpened(play: any) {
    // Add your code here to perform the desired action when a panel is opened
    
    this.panelSpinnerLoading = true;
    this.userinfoService.getUserInfo(play.creator).subscribe((userinfoData) => {
      this.isLoading = false;
      console.log(userinfoData);
      this.panelUser = userinfoData.username;
      this.panelNet = userinfoData.net;
      this.panelPic = userinfoData.profilePic;
    });
    // You can call any method or perform any action here
  }

  addTagInitiate(){
    this.tagIni = true;
  }

  createTag(){
    alert('ya');
    if(this.form.invalid){
      return;
    }
    this.isLoading = true;
    //Add Tag to database, then add tag to Play
    console.log(this.form.value.title);
    this.tagService.addTag(this.form.value.title);
    /*else{
      //Edit
      this.playsService.updatePlay(this.playId,this.form.value.title, this.form.value.content,this.form.value.image);
    }*/
    this.isLoading = false;
    this.tagIni= false;
    this.form.reset();
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage=pageData.pageIndex + 1;
    this.playsPerPage = pageData.pageSize;
    this.playsService.getPlays(this.playsPerPage,this.currentPage,this.userIdProfile);
  }

  onWin(playId: string, netAdd: number) {
    this.isLoading = true;
    console.log(netAdd);
    this.playsService.winPlay(playId, netAdd);
    this.isLoading = false;
  }
  onLose(playId: string, netLoss: number) {
    this.isLoading = true;
    console.log(netLoss);
    this.playsService.losePlay(playId, netLoss);
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.playsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
    this.tagsSub.unsubscribe();
  }
}
