import {ModuleWithProviders, NgModule} from '@angular/core';
import {KeyboardContainerComponent} from './keyboard-container/keyboard-container.component';
import {KeyboardComponent} from './keyboard/keyboard.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SingleCharButtonComponent} from './buttons/single-char-button/single-char-button.component';
import {SpacebarButtonComponent} from './buttons/spacebar-button/spacebar-button.component';
import {IconButtonComponent} from './buttons/icon-button/icon-button.component';
import {FakeInputComponent} from './fake-input/fake-input.component';
import {FakeCharComponent} from './fake-input/fake-char/fake-char.component';
import {KEYBOARD_CONFIG} from './constants';

export interface AngularKeyboardModuleConfig {
  inputFieldStyling: any;
}

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
    SpacebarButtonComponent,

    // Input Stuff
    FakeInputComponent,
    FakeCharComponent
  ],
  exports: [
    KeyboardContainerComponent,
    FakeInputComponent
  ]
})
export class AngularKeyboardModule {
  static forRoot(config: AngularKeyboardModuleConfig): ModuleWithProviders {
    return {
      ngModule: AngularKeyboardModule,
      providers: [
        {provide: KEYBOARD_CONFIG, useValue: config}
      ]
    };
  }
}
