import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoListComponent } from './userinfo-list.component';

describe('UserInfoListComponent', () => {
  let component: UserInfoListComponent;
  let fixture: ComponentFixture<UserInfoListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserInfoListComponent]
    });
    fixture = TestBed.createComponent(UserInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
