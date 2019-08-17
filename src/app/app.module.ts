import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AngularKeyboardModule} from '../../projects/angular-keyboard/src/lib/angular-keyboard.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularKeyboardModule.forRoot({
      inputFieldStyling: {
        'font-family': '"Palatino Linotype","Book Antiqua",Palatino,serif',
        'font-size': '120%',
        display: 'block',
        'line-height': '1.61',
        padding: '20px',
        'border-radius': '5px',
        background: '#f5f5f5',
        'box-shadow': 'inset 0 1px 1px rgba(0,0,0,.05)',
        'text-align': 'left'
      }
    }),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
