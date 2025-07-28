import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleauthsuccessComponent } from './googleauthsuccess.component';

describe('GoogleauthsuccessComponent', () => {
  let component: GoogleauthsuccessComponent;
  let fixture: ComponentFixture<GoogleauthsuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleauthsuccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleauthsuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
