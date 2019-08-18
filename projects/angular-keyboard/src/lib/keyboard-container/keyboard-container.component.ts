import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularKeyboardService} from '../angular-keyboard.service';
import {isAncestor} from '../dom-utils';
import {Subscription} from 'rxjs';

@Component({
  selector: 'tb-keyboard-container',
  templateUrl: './keyboard-container.component.html',
  styleUrls: ['./keyboard-container.component.scss']
})
export class KeyboardContainerComponent implements OnInit, OnDestroy {

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
      .map(fakeInputElt => isAncestor(e.target, fakeInputElt.nativeElement))
      .reduce((a, b) => a || b, false);
    if (isFakeInput) {
      // don't blur
    } else {
      this.angularKeyboardService.inputFocused$.next(null);
    }
  }

  onKeyboardViewInit() {

    if (this.inputFocused != null) {
      this.inputFocused.scrollIntoView();
    }
  }

}
