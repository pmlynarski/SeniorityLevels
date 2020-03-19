import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ROUTES_PATH } from '@constants/routes.constants';
import { IRoutesConst, ISeniorityValues, ISubCategoryDescription } from '@core/interfaces';
import { seniorityEnum } from '@modules/skills/enums/seniority.enum';
import { SlugTextifyPipe } from '@modules/skills/pipes/slug-textify';
import { SkillsService } from '@modules/skills/services/skills.service';
import { DataSharingService } from '@shared/services/data-sharing.service';
import { User } from 'firebase';
import { throwError } from 'rxjs';
import { default as data } from '../../services/data';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SlugTextifyPipe],
})
export class SkillComponent {
  private catTitle: string;
  private subCategories: ISubCategoryDescription[];
  private chosenSubCat: ISubCategoryDescription;
  private levels: ISeniorityValues;
  private currentlyDisplayedLevel: seniorityEnum;
  private clickable: boolean;
  private currentUser: User;
  private routes: IRoutesConst;

  constructor(
    private cdRef: ChangeDetectorRef,
    private skillsService: SkillsService,
    private dataSharingService: DataSharingService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private textifyPipe: SlugTextifyPipe,
  ) {
    this.setInitialValues();
    this.activatedRoute.params.subscribe(
      (param) => {
        this.catTitle = this.textifyPipe.transform(param.category);
        const categoriesFiltered = data.filter((element) => element.title === this.catTitle);
        if (categoriesFiltered.length < 1) {
          throwError('Wrong category name');
        } else {
          this.subCategories = categoriesFiltered[0].subCategories;
          this.chooseSubCategory(this.subCategories[0], 0);
          this.cdRef.markForCheck();
        }
      },
      () => {
        this.router.navigate([ROUTES_PATH.skills]);
      },
    );
  }

  get contentLoaded() {
    return this.chosenSubCat !== undefined;
  }

  setInitialValues() {
    this.routes = ROUTES_PATH;
    this.currentUser = this.dataSharingService.getUser();
    this.currentlyDisplayedLevel = seniorityEnum.junior;
    this.clickable = true;
  }

  chooseSubCategory(subCat: ISubCategoryDescription, index: number) {
    this.document.querySelectorAll('.table__label').forEach((element) => {
      element.classList.remove('u-text--black');
    });
    this.skillsService.getSkillsBySubCategory(this.catTitle, subCat.title, this.currentUser.uid).subscribe(
      (res) => {
        this.levels = res;
        this.chosenSubCat = subCat;
        this.cdRef.markForCheck();
        this.document.querySelectorAll('.table__label')[index].classList.add('u-text--black');
      },
      (error) => {
        throwError(error);
      },
    );
  }

  setSkill(level: string) {
    if (this.clickable) {
      this.levels[level] = !this.levels[level];
      this.cdRef.markForCheck();
      this.sendSkill();
    }
  }

  sendSkill() {
    this.clickable = false;
    this.skillsService.setUsersSkills(this.catTitle, this.chosenSubCat.title, this.levels, this.currentUser.uid).subscribe(
      () => {
        this.clickable = true;
      },
      (error) => {
        this.clickable = false;
        throwError(error);
      },
    );
  }

  requirementsUp() {
    switch (this.currentlyDisplayedLevel) {
      case seniorityEnum.junior: {
        this.currentlyDisplayedLevel = seniorityEnum.middle;
        break;
      }

      case seniorityEnum.middle: {
        this.currentlyDisplayedLevel = seniorityEnum.senior;
        break;
      }

      case seniorityEnum.senior: {
        this.currentlyDisplayedLevel = seniorityEnum.junior;
        break;
      }

      default: {
        this.currentlyDisplayedLevel = seniorityEnum.junior;
        break;
      }
    }
    this.cdRef.markForCheck();
  }
}