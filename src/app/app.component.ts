import {Component} from '@angular/core';
import {AngularKeyboardService} from '../../projects/angular-keyboard/src/lib/angular-keyboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  input$ = this.keyboardService.input$;

  constructor(
    private keyboardService: AngularKeyboardService
  ) {
  }

}
