import {Component} from '@angular/core';
import {AngularKeyboardService} from '@taskbase/angular-keyboard';

@Component({
  selector: 'app-keyboard-hidden-demo',
  templateUrl: './keyboard-hidden-demo.component.html'
})
export class KeyboardHiddenDemoComponent {

  input$ = this.keyboardService.input$;

  constructor(
    private keyboardService: AngularKeyboardService
  ) {
  }

  onTextChange(text: string) {
    console.log(text);
  }
}
