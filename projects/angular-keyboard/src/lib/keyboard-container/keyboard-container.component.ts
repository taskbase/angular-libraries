import {Component, OnInit} from '@angular/core';
import {AngularKeyboardService} from '../angular-keyboard.service';
import {isAncestor} from '../dom-utils';

@Component({
  selector: 'tb-keyboard-container',
  templateUrl: './keyboard-container.component.html',
  styleUrls: ['./keyboard-container.component.scss']
})
export class KeyboardContainerComponent implements OnInit {

  inputFocused$ = this.angularKeyboardService.inputFocused$;

  constructor(
    private angularKeyboardService: AngularKeyboardService
  ) {
  }

  ngOnInit() {
  }

  onClickKeyboard(e) {
    e.stopPropagation();
  }

  onClickOnPage(e) {
    const isFakeInput = this.angularKeyboardService.inputFields
      .map(fakeInputElt => isAncestor(e.target, fakeInputElt.nativeElement))
      .reduce((a, b) => a || b, false);
    if (isFakeInput) {
      // don't blur
    } else {
      this.angularKeyboardService.inputFocused$.next(null);
    }
  }

}
