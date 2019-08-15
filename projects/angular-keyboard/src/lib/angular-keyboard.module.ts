import {NgModule} from '@angular/core';
import {KeyboardContainerComponent} from './keyboard-container/keyboard-container.component';
import {KeyboardComponent} from './keyboard/keyboard.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SingleCharButtonComponent} from './buttons/single-char-button/single-char-button.component';
import {SpacebarButtonComponent} from './buttons/spacebar-button/spacebar-button.component';
import {IconButtonComponent} from './buttons/icon-button/icon-button.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    KeyboardContainerComponent,
    KeyboardComponent,
    SingleCharButtonComponent,
    IconButtonComponent,
    SpacebarButtonComponent
  ],
  exports: [
    KeyboardContainerComponent
  ]
})
export class AngularKeyboardModule {
}
