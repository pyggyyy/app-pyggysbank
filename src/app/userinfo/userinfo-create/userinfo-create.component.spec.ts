import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoCreateComponent } from './userinfo-create.component';

describe('UserInfoCreateComponent', () => {
  let component: UserInfoCreateComponent;
  let fixture: ComponentFixture<UserInfoCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserInfoCreateComponent]
    });
    fixture = TestBed.createComponent(UserInfoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
