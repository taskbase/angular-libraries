import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AngularKeyboardService} from '../angular-keyboard.service';
import {isAncestor} from '../dom-utils';
import {Subscription} from 'rxjs';

@Component({
  selector: 'tb-keyboard-container',
  templateUrl: './keyboard-container.component.html',
  styleUrls: ['./keyboard-container.component.scss']
})
export class KeyboardContainerComponent implements OnInit, OnDestroy {

  @Input() keyboardHidden = false;

  inputFocused: HTMLElement | null;

  constructor(
    private angularKeyboardService: AngularKeyboardService
  ) {
  }

  subs: Subscription[] = [];

  ngOnInit() {
    this.angularKeyboardService.inputFocused$.subscribe(next => {
      this.inputFocused = next;
    });
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onClickOnPage(e) {
    const isFakeInput = this.angularKeyboardService.inputFields
      .map(fakeInputElt => {
        try {
          // Check if the fake input element is an ancestor of the clicked element
          return isAncestor(e.target, fakeInputElt.nativeElement);
        } catch {
          // It is possible that the clicked element is already not present anymore in the DOM, then isAncestor throws an error.
          // In this case assume a click outside to close the keyboard
          return false;
        }
      })
      .reduce((a, b) => a || b, false);
    if (isFakeInput) {
      // don't blur
    } else {
      this.angularKeyboardService.inputFocused$.next(null);
    }
  }

}
