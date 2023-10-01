//Get Model
import { Injectable } from '@angular/core';
import {Play} from '../plays/play.model';
import {HttpClient} from '@angular/common/http'
import { Subject } from 'rxjs';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

const BACKENDURL = environment.apiUrl + 'plays/';

@Injectable({providedIn: 'root'})
export class PlayService {
    private plays: Play[] = [];
    private playsUpdated = new Subject<{plays: Play[], playCount: number}>();

    constructor(private http: HttpClient, private router: Router) {

    }

    getPlays(playsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${playsPerPage}&page=${currentPage}`;
        this.http.get<{message: string,plays:any,maxPlays: number}>(BACKENDURL + queryParams)
        .pipe(map((playData) => {
            return {plays: playData.plays.map(play => {
                return{
                    title: play.title,
                    content: play.content,
                    id: play._id,
                    imagePath: play.imagePath,
                    creator:play.creator,
                    stake: play.stake,
                    payout: play.payout,
                    ifWin:play.ifWin,
                    graded: play.graded
                }
            }), maxPlays: playData.maxPlays}
        }))
        .subscribe((transformedPlaysData) => {
            this.plays = transformedPlaysData.plays;
            this.playsUpdated.next({plays: [...this.plays],playCount:transformedPlaysData.maxPlays});
        });
    }

    getPlayUpdateListener() {
        return this.playsUpdated.asObservable()
    }

    /*getPlay(id: string){
        return this.http.get<{_id:string, title:string,content:string, imagePath: string,creator:string}>(BACKENDURL+ id);
    }*/

    addPlay(title:string, content:string, image: File, stake: number, payout: number){
        const playData = new FormData();
        playData.append('title', title);
        playData.append('stake', stake.toString());
        playData.append('payout', payout.toString());
        if(content){
            playData.append('content', content);
        }
        else{
            playData.append('content', '');
        }
        if(image){
            playData.append('image', image, title);
        }
        this.http.post<{message:string, play: Play}>(BACKENDURL,playData)
        .subscribe(responseData => {
            this.router.navigate(['/']).then(() => {
                setTimeout(() => {
                    window.location.reload();
                  }, 1500);
              });
        });
    }

    /*updatePlay(id: string, title: string, content: string, image: File | string){
        let playData: Play | FormData;
        if(typeof(image) === 'object'){
            playData = new FormData();
            playData.append('id',id);
            playData.append('title',title);
            if(content){
                playData.append('content', content);
            }
            else{
                playData.append('content', '');
            }
            if(image){
                playData.append('image',image, title);
            }
        }
        else{
            playData = {
                id:id,
                title: title,
                content:content,
                imagePath:image as string,
                creator:null
            }
        }
        this.http.put(BACKENDURL+ id, playData)
        .subscribe(response => {
            this.router.navigate(['/']).then(() => {
                setTimeout(() => {
                    window.location.reload();
                  }, 1500);
            });
        });
    }*/

    deletePlay(playId: string) {
        return this.http.delete(BACKENDURL+playId)
        
    }
}