import {Component, ViewChild} from '@angular/core';
import {AngularKeyboardService} from '../../projects/angular-keyboard/src/lib/angular-keyboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  inputText = 'Hello World';
  input$ = this.keyboardService.input$;

  constructor(
    private keyboardService: AngularKeyboardService
  ) {
  }

  onFocus(inputElement: HTMLElement) {
    // inputElement.blur();
  }

}
