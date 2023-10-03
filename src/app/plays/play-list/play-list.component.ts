import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {Subscription} from 'rxjs';

import { Play } from './../play.model';

//Import Service
import { PlayService } from '../../services/plays.service';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-play-list',
  templateUrl: './play-list.component.html',
  styleUrls: ['./play-list.component.css']
})
export class PlayListComponent implements OnInit, OnDestroy {
  //Declare Variable
  plays: Play[] = [];
  isLoading = false;
  totalPlays = 0;
  playsPerPage = 5;
  currentPage = 1;
  playSizeOptions = [2,5,10];
  userIsAuthenticated = false;
  userId: string;
  private playsSub: Subscription;
  private authStatusSub: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public playsService: PlayService, private authService: AuthService){};

  ngOnInit() {
    this.isLoading = true;
    this.playsService.getPlays(this.playsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.playsSub = this.playsService.getPlayUpdateListener()
    .subscribe((playsData: { plays: Play[], playCount: number }) => {
      this.isLoading = false;
      this.totalPlays = playsData.playCount; // Update totalPlays here
      this.plays = playsData.plays;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    //Set Subscription Listener for Authorizatoin
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage=pageData.pageIndex + 1;
    this.playsPerPage = pageData.pageSize;
    this.playsService.getPlays(this.playsPerPage,this.currentPage);
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
  }
}
