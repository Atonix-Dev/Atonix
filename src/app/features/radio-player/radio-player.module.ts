import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RadioPlayerComponent } from './components/radio-player/radio-player.component';
import { StationListComponent } from './components/station-list/station-list.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { FilterComponent } from './components/filter/filter.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: RadioPlayerComponent }
];

@NgModule({
  declarations: [
    RadioPlayerComponent,
    StationListComponent,
    AudioPlayerComponent,
    FilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class RadioPlayerModule { }