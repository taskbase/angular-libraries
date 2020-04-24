import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {KeyboardDemoRoutingModule} from './keyboard-demo-routing.module';
import {KeyboardDemoComponent} from './keyboard-demo/keyboard-demo.component';
import {NavModule} from '../nav/nav.module';
import {AngularKeyboardModule} from '@taskbase/angular-keyboard';
import {KeyboardHiddenDemoComponent} from './keyboard-hidden-demo/keyboard-hidden-demo.component';

@NgModule({
  declarations: [KeyboardDemoComponent, KeyboardHiddenDemoComponent],
  imports: [
    CommonModule,
    KeyboardDemoRoutingModule,
    NavModule,
    AngularKeyboardModule.forRoot({
      styles: {
        inputField: {
          'font-family': '"Palatino Linotype","Book Antiqua",Palatino,serif',
          'font-size': '120%',
          display: 'block',
          'line-height': '1.61',
          padding: '20px',
          'border-radius': '5px',
          background: '#f5f5f5',
          'box-shadow': 'inset 0 1px 1px rgba(0,0,0,.05)',
          'text-align': 'left'
        },
        addedChar: {
          'font-weight': 'bold',
          color: 'blue'
        },
        removedChar: {
          color: 'lightblue',
          'text-decoration': 'line-through'
        }
      }
    })
  ]
})
export class KeyboardDemoModule {
}
