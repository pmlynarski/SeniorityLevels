import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { DataSharingService } from '@shared/services/data-sharing.service';
import { User } from 'firebase';

import { ICategoryProgress, ISeniorityCount } from '@core/interfaces';
import { UsersService } from '@modules/users/services/users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent {
  private userDetails: User;
  private progress: ISeniorityCount;
  data: ICategoryProgress[];

  constructor(private usersService: UsersService, private dataSharingService: DataSharingService, private cdRef: ChangeDetectorRef) {
    this.userDetails = this.dataSharingService.getUser();
    this.cdRef.markForCheck();
    this.progress = {
      junior: 82,
      middle: 15,
      senior: 3,
    };
  }
}
