//Get Model
import { Injectable } from '@angular/core';
import {Tag} from '../plays/tag.model';

import {HttpClient} from '@angular/common/http'
import { Subject } from 'rxjs';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { UserInfoService } from './userinfo.service';

const BACKENDURL = environment.apiUrl + 'tags/';

@Injectable({providedIn: 'root'})
export class TagService {
    private tags: Tag[] = [];
    private tagsUpdated = new Subject<{tags: Tag[]}>();

    constructor(private http: HttpClient, private router: Router, public userinfoService: UserInfoService) {

    }

    getTags(userIdString: string) {
        console.log('hihi');
        console.log(userIdString);
        const queryParams = `?userIdString=${userIdString}`;
        console.log('running');

        this.http.get<{message: string,tags:any}>(BACKENDURL + queryParams)
        .pipe(map((tagsData) => {
            return {tags: tagsData.tags.map(tag => {
                return{
                    title: tag.title,
                    
                    id: tag._id,
                   
                    creator:tag.creator,
                   
                }
            }), }
        }))
        .subscribe((transformedTagsData) => {
            this.tags = transformedTagsData.tags;
            this.tagsUpdated.next({tags: [...this.tags]});
        });
    }

    getTagUpdateListener() {
        return this.tagsUpdated.asObservable()
    }

    /*getPlay(id: string){
        return this.http.get<{_id:string, title:string,content:string, imagePath: string,creator:string}>(BACKENDURL+ id);
    }*/

    addTag(title:string){
        const queryParams = `?title=${title}`;
        this.http.post<{message:string, tag: Tag}>(BACKENDURL + queryParams,null)
        .subscribe(responseData => {
            console.log('Got Tags');
        });
    }

    
}