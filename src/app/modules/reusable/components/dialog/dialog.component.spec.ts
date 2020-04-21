import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { MockModule } from 'ng-mocks';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

import { MaterialModule } from '@core/material';
import { deleteUser, selectDeletingUser, UsersModuleState } from '@modules/users/store';
import { of } from 'rxjs';
import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let store: SpyObj<Store<UsersModuleState>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogComponent],
      imports: [MockModule(MaterialModule), MockModule(FormsModule)],
      providers: [
        {
          provide: MatDialogRef,
          useValue: createSpyObj('matDialogRef', ['open', 'close']),
        },
        {
          provide: Store,
          useValue: createSpyObj('store', ['dispatch', 'select']),
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id: 'userId',
            caption: 'Are you sure about deleting your account?',
            classToApply: 'classToApply',
            isCurrent: true,
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(Store) as SpyObj<Store<UsersModuleState>>;
    store.select.withArgs(selectDeletingUser).and.returnValue(of(false));
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onAccept method', () => {
    it('should dispatch action if not loading', () => {
      component.onAccept('userId');
      expect(store.dispatch).toHaveBeenCalledWith(deleteUser({ userId: 'userId', isCurrent: true }));
    });

    it('should not dispatch action if loading', () => {
      component.isDeleting = true;
      component.onAccept('userId');
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
