import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '@core/material';
import { SharedUiModule } from '@modules/reusable';
import { SkillsComponent, SkillComponent, SlugTextifyPipe, TextSlugifyPipe } from '@modules/skills';
import { SkillsRoutingModule } from './skills-routing.module';

@NgModule({
  declarations: [SkillsComponent, SkillComponent, TextSlugifyPipe, SlugTextifyPipe],
  imports: [CommonModule, MaterialModule, SkillsRoutingModule, SharedUiModule],
})
export class SkillsModule {}
