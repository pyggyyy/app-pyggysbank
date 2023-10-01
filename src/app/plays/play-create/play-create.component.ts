import { Component, OnInit, OnDestroy} from '@angular/core';
import { Play } from './../play.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, ParamMap} from '@angular/router';

import { PlayService } from '../../services/plays.service';
import { mimeType } from './mimi-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-play-create',
  templateUrl: './play-create.component.html',
  styleUrls: ['./play-create.component.css']
})
export class PlayCreateComponent implements OnInit, OnDestroy {

  private mode = 'create';
  private playId: string;
  play: Play;
  isLoading = false;

  //Edit Img Preview
  playHasImg = false;
  playExistingImg : string;

  //Define Form on TS
  form: FormGroup;

  imagePreview: string;

  private authStatusSub: Subscription;

  constructor(public playsService: PlayService, public route: ActivatedRoute, private authSerivce:AuthService){};

  ngOnInit() {
    this.authStatusSub = this.authSerivce.getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    })
    this.form = new FormGroup({
      'title': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'content': new FormControl(null, []),
      'image': new FormControl(null, {asyncValidators: [mimeType]}),
      'stake': new FormControl(null,[]),
      'payout': new FormControl(null,[]),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      /*if(paramMap.has('playId')){
        this.mode = 'edit';
        this.playId = paramMap.get('playId');
        this.isLoading = true;
        this.playsService.getPlay(this.playId).subscribe(playData => {
          this.isLoading = false;
          this.play = {
            id:playData._id,
            title:playData.title,
            content:playData.content,
            imagePath: playData.imagePath,
            creator:playData.creator
          }
          if(this.play.imagePath){
            this.playHasImg = true;
            this.playExistingImg = this.play.imagePath;
          }
          this.form.setValue({title:this.play.title,content:this.play.content,image:this.play.imagePath})
        })
      }
      else{*/
        this.mode = 'create';
        this.playId = null;
      //}
    });
  }

  //Image Upload Method
  onImagePicked(event:Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  //method
  onCreate() {
    if(this.form.invalid){
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create'){
      this.playsService.addPlay(this.form.value.title,this.form.value.content,this.form.value.image,this.form.value.stake,this.form.value.payout);
    }
    /*else{
      //Edit
      this.playsService.updatePlay(this.playId,this.form.value.title, this.form.value.content,this.form.value.image);
    }*/
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
