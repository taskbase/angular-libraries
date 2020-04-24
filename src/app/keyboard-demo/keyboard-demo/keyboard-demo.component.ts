import {Component} from '@angular/core';
import {AngularKeyboardService} from '@taskbase/angular-keyboard';

@Component({
  selector: 'app-keyboard-demo',
  templateUrl: './keyboard-demo.component.html',
  styleUrls: ['./keyboard-demo.component.scss']
})
export class KeyboardDemoComponent {

  input$ = this.keyboardService.input$;

  constructor(
    private keyboardService: AngularKeyboardService
  ) {
  }

  onTextChange(text: string) {
    console.log(text);
  }

}
