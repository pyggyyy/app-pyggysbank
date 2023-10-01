import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayCreateComponent } from './play-create.component';

describe('PlayCreateComponent', () => {
  let component: PlayCreateComponent;
  let fixture: ComponentFixture<PlayCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayCreateComponent]
    });
    fixture = TestBed.createComponent(PlayCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
