import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SKILLS_FEATURE } from '@constants/skills.constants';
import { SharedUiModule } from '@modules/reusable';
import { SkillsComponent, SkillComponent } from './components';
import { SlugTextifyPipe, TextSlugifyPipe } from './pipes';
import { SkillsRoutingModule } from './skills-routing.module';
import { SkillsEffects } from './store/effects';
import { skillsReducer } from './store/reducers';

@NgModule({
  declarations: [SkillsComponent, SkillComponent, TextSlugifyPipe, SlugTextifyPipe],
  imports: [
    CommonModule,
    SkillsRoutingModule,
    SharedUiModule,
    StoreModule.forFeature(SKILLS_FEATURE, skillsReducer),
    EffectsModule.forFeature([SkillsEffects]),
  ],
})
export class SkillsModule {}
