import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { default as data } from '@modules/users/components/skills/data';
import { User } from 'firebase';

import { IProgressCategory, ISeniority, ISubCategoryProgress } from '@core/interfaces';
import { UsersService } from '@modules/users/services/users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent {
  private userDetails: User;
  private progress: ISeniority;
  data: IProgressCategory[];
  chosenCategories: ISubCategoryProgress[];
  private skillVisible: boolean;

  constructor(private usersService: UsersService, private cdRef: ChangeDetectorRef) {
    this.usersService.getCurrentUser().subscribe((user) => {
      this.userDetails = user;
      this.cdRef.markForCheck();
    });
    this.progress = {
      junior: '82%',
      middle: '15%',
      senior: '3%',
    };
    this.data = data;
    this.skillVisible = false;
  }

  chooseCategory(categories: ISubCategoryProgress[]) {
    this.chosenCategories = categories;
    this.skillVisible = true;
  }

  get skillVisibility() {
    return this.skillVisible;
  }

  hideSkill() {
    this.skillVisible = false;
  }
}
