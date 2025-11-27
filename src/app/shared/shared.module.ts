
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { SettingsToggleComponent } from './components/settings-toggle/settings-toggle.component';

/**
 * Shared Module
 * Contains commonly used components, pipes, and directives
 */
@NgModule({
  declarations: [
    SafeHtmlPipe,
    TruncatePipe,
    SettingsToggleComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule
  ],
  exports: [
    CommonModule,
    TranslateModule,
    SafeHtmlPipe,
    TruncatePipe,
    SettingsToggleComponent
  ]
})
export class SharedModule { }
