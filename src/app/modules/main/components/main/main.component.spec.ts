import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedUiModule } from '@modules/reusable';
import { MockComponent, MockModule } from 'ng-mocks';

import { AuthenticationService } from '@modules/authentication';
import { NavigationComponent } from '../navigation/navigation.component';
import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainComponent, MockComponent(NavigationComponent)],
      imports: [RouterTestingModule, MockModule(SharedUiModule)],
      providers: [
        {
          provide: AuthenticationService,
          useValue: {},
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
