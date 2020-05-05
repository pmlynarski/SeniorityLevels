import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ROUTES_PATH } from '@constants/routes.constants';
import { roleEnum } from '@core/enums/role.enum';
import { IBasicUser, IComment } from '@core/interfaces';
import { AuthModuleState } from '@modules/authentication/store/reducers';
import { selectCurrentUser } from '@modules/authentication/store/selectors';
import { Store } from '@ngrx/store';
import { AppFormControl, AppFormGroup } from '@shared/forms';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DialogService } from '../../services/dialog.service';
import * as reusableActions from '../../store/actions';
import { ReusableModuleState } from '../../store/reducers';
import {
  selectComments,
  selectCommentsLoading,
  selectCommentEditing,
  selectCommentFormLoading,
  selectFormVisibility,
} from '../../store/selectors';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsComponent implements OnChanges, OnDestroy {
  @Input() catTitle: string;
  @Input() subCatTitle: string;
  @Input() description: string;
  @Input() level: string;
  @Input() userId: string;
  author: IBasicUser;
  formVisible$: Observable<boolean>;
  comments$: Observable<[string, IComment][]>;
  commentsLoading$: Observable<boolean>;
  subscription: Subscription;
  commentForm: AppFormGroup;
  editCommentForm: AppFormGroup;
  editingComment: { [key: number]: boolean };
  readonly adminRole: roleEnum;

  constructor(private store: Store<ReusableModuleState | AuthModuleState>, private router: Router, private dialogService: DialogService) {
    this.adminRole = roleEnum.admin;
    this.editingComment = {};
    this.commentForm = new AppFormGroup({
      content: new AppFormControl('', [Validators.required]),
    });
    this.editCommentForm = new AppFormGroup({
      editContent: new AppFormControl('', Validators.required),
    });
    this.formVisible$ = this.store.select(selectFormVisibility);
    const formLoading$ = this.store.select(selectCommentFormLoading).subscribe((res) => {
      if (res === true) {
        this.commentForm.disable();
      } else {
        this.commentForm.enable();
      }
    });
    this.subscription = new Subscription();
    this.subscription.add(formLoading$);
    this.comments$ = this.store.select(selectComments);
    this.commentsLoading$ = this.store.select(selectCommentsLoading);
    const toggleEditLoading = this.store.select(selectCommentEditing).subscribe((val) => {
      val === true ? this.editCommentForm.disable() : this.editCommentForm.enable();
    });
    this.subscription.add(toggleEditLoading);
  }

  ngOnChanges(changes: SimpleChanges) {
    const catTitle = changes.catTitle;
    const subCatTitle = changes.subCatTitle;
    const level = changes.level;
    this.store.dispatch(
      reusableActions.loadComments({
        userId: this.userId,
        catTitle: catTitle ? changes.catTitle.currentValue : this.catTitle,
        subCatTitle: subCatTitle ? changes.subCatTitle.currentValue : this.subCatTitle,
        level: level ? changes.level.currentValue : this.level,
      }),
    );

    const currentUser = this.store
      .select(selectCurrentUser)
      .pipe(filter((res) => res !== null))
      .subscribe((res) => {
        this.author = res;
        if (!(this.userId === res.uid || res.role === roleEnum.admin)) {
          this.router.navigate([ROUTES_PATH.userList]);
        }
      });
    this.subscription.add(currentUser);
  }

  get content() {
    return this.commentForm.get('content');
  }

  get editContent() {
    return this.editCommentForm.get('editContent');
  }

  formToggle() {
    this.store.dispatch(reusableActions.toggleCommentForm());
  }

  addComment() {
    const data = {
      userId: this.userId,
      catTitle: this.catTitle,
      subCatTitle: this.subCatTitle,
      level: this.level,
      comment: {
        author: this.author,
        content: this.content.value,
        dateCreated: new Date().toLocaleString('pl'),
      },
    };
    this.store.dispatch(reusableActions.addComment(data));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  deleteComment(commentId: string) {
    this.dialogService.showDeleteCommentUserDialog(
      commentId,
      this.userId,
      this.catTitle,
      this.subCatTitle,
      this.level,
      'Do you want to' + ' delete comment?',
      'It can not be undone',
    );
  }

  showEditForm(id: number, content: string, value = true) {
    this.editingComment = {};
    this.editContent.setValue(content);
    this.editingComment[id] = value;
  }

  editComment(commentId: string) {
    this.editingComment = {};
    this.store.dispatch(
      reusableActions.editComment({
        commentId,
        catTitle: this.catTitle,
        subCatTitle: this.subCatTitle,
        level: this.level,
        userId: this.userId,
        content: this.editContent.value,
      }),
    );
  }
}
