import {ModuleWithProviders, NgModule} from '@angular/core';
import {KeyboardContainerComponent} from './keyboard-container/keyboard-container.component';
import {KeyboardComponent} from './keyboard/keyboard.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FakeInputComponent} from './fake-input/fake-input.component';
import {FakeCharComponent} from './fake-input/fake-char/fake-char.component';
import {KEYBOARD_CONFIG} from './constants';

export interface AngularKeyboardModuleConfig {
  styles?: {
    inputField?: any;
    addedChar?: any;
    removedChar?: any;
  };
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    KeyboardContainerComponent,
    KeyboardComponent,

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
  static forRoot(config: AngularKeyboardModuleConfig): ModuleWithProviders<AngularKeyboardModule> {
    return {
      ngModule: AngularKeyboardModule,
      providers: [
        {provide: KEYBOARD_CONFIG, useValue: config}
      ]
    };
  }
}
