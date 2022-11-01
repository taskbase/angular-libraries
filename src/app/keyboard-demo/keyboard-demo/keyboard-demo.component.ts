import {Component} from '@angular/core';
import {AngularKeyboardService} from '@taskbase/angular-keyboard';

@Component({
  selector: 'app-keyboard-demo',
  templateUrl: './keyboard-demo.component.html'
})
export class KeyboardDemoComponent {

  input$ = this.keyboardService.input$;

  constructor(
    private keyboardService: AngularKeyboardService
  ) {
  }

  onTextChange(text: string) {
    console.info(text);
  }

}
