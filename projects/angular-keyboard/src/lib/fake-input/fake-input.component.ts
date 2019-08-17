import {Component, ElementRef, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';

import {CharCursor} from './fake-char/char-cursor';
import {AngularKeyboardService} from '../angular-keyboard.service';
import {Subscription} from 'rxjs';
import {KeyboardCommandButton} from '../keyboard-commands';

// import {FakeCharComponent} from './fake-char/fake-char.component';

enum Side {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

interface Char {
  char: string;
}

interface Cursor {
  index: number;
  side: Side;
}

export const FAKE_INPUT_SELECTOR = 'app-fake-input';

@Component({
  selector: FAKE_INPUT_SELECTOR,
  templateUrl: './fake-input.component.html',
  styleUrls: ['./fake-input.component.scss']
})
export class FakeInputComponent implements OnInit, OnDestroy {

  @Input() key: string;
  @ViewChild('text', {static: true}) textElement: ElementRef;
  @ViewChild('wrapper', {static: true}) wrapper: ElementRef;
  @ViewChildren('fakechar', {read: ElementRef}) charElements: QueryList<ElementRef>;

  chars: Char[] = [];

  private cursorInternal: Cursor | null = null;

  get cursor() {
    return this.cursorInternal;
  }

  set cursor(c: Cursor | null) {
    this.cursorInternal = c;
    if (this.cursorInternal != null) {
      this.angularKeyboardService.inputFocused$.next(true);
    }
  }

  get cursorPos(): null | number {
    if (this.cursor != null) {
      if (this.cursor.side === Side.LEFT) {
        return this.cursor.index;
      } else if (this.cursor.side === Side.RIGHT) {
        return this.cursor.index + 1;
      } else {
        throw new Error(`Expected side to be left or right, but was ${this.cursor.side}`);
      }
    } else {
      return null;
    }
  }

  subscriptions: Subscription[] = [];

  constructor(
    private angularKeyboardService: AngularKeyboardService
  ) {
  }

  ngOnInit() {
    this.chars = 'You need these concepts to check if the mouse is inside a line: Define the starting & ending points of a line.'
      .split('').map(char => {
        return {
          char
        };
      });
    this.subscriptions.push(
      this.angularKeyboardService.input$.subscribe(next => {
        this.handleKeyInput(next);
      }),
      this.angularKeyboardService.inputFocused$.subscribe(next => {
        if (next === false) {
          this.cursor = null;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  handleKeyInput(next) {
    if (this.cursor != null) {
      const handledEvents = {
        [KeyboardCommandButton.BACKSPACE]: () => {
          if (this.cursorPos > 0) {
            this.deleteCharLeftAndAdjustCursor();
          }
        },
        [KeyboardCommandButton.SPACEBAR]: () => this.insertChar(' '),
        [KeyboardCommandButton.ARROW_LEFT]: () => this.moveCursorLeft(),
        [KeyboardCommandButton.ARROW_RIGHT]: () => this.moveCursorRight(),
        [KeyboardCommandButton.ARROW_UP]: () => this.moveCursorUp(),
        [KeyboardCommandButton.ESCAPE]: () => this.angularKeyboardService.inputFocused$.next(false),
        [KeyboardCommandButton.ENTER]: () => this.insertChar('\n')
      };
      const action = handledEvents[next];
      if (action instanceof Function) {
        action();
      } else {
        const isChar = next.length === 1; // could also be unhandlet command like shift, so we need to check here.
        if (next.length === 1) {
          this.insertChar(next);
        }
      }
    }
  }

  focusInput() {
    this.angularKeyboardService.inputFocused$.next(true);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(e: KeyboardEvent) {
    if (this.cursorPos != null) {
      e.preventDefault();
      this.angularKeyboardService.input$.next(e.key);
    }
  }

  insertChar(char: string) {
    this.chars = [
      ...this.chars.slice(0, this.cursorPos),
      {char},
      ...this.chars.slice(this.cursorPos, this.chars.length)
    ];
    this.cursor = {
      index: this.cursorPos,
      side: Side.RIGHT
    };
  }

  deleteCharLeftAndAdjustCursor() {
    if (this.cursorPos === 0) {
      // cannot delete more...
    } else {
      // actually delete the char
      this.chars = [
        ...this.chars.slice(0, this.cursorPos - 1),
        ...this.chars.slice(this.cursorPos, this.chars.length)
      ];
      // adjust the cursor
      if (this.cursorPos === 1) {
        this.cursor = {
          index: 0,
          side: Side.LEFT
        };
      } else {
        this.cursor = {
          index: this.cursorPos - 2,
          side: Side.RIGHT
        };
      }
    }
  }

  get charRows() {
    const charClustersByRow: HTMLElement[][] = [];
    let lastSeen: HTMLElement | null = null;
    let currentIndex = 0;
    this.charElements.toArray().forEach(elt => {
      const nativeElement = elt.nativeElement as HTMLElement;
      if (lastSeen != null) {
        const l = lastSeen as HTMLElement;
        if (l.getBoundingClientRect().top === nativeElement.getBoundingClientRect().top) {
          charClustersByRow[currentIndex].push(nativeElement);
        } else {
          currentIndex = currentIndex + 1;
          charClustersByRow.push([nativeElement]);
        }
      } else {
        charClustersByRow.push([nativeElement]);
      }
      lastSeen = nativeElement;
    });
    return charClustersByRow;
  }

  setCursorToElement(elt: HTMLElement) {
    this.charElements.toArray().forEach((charElt, idx) => {
      if (charElt.nativeElement === elt) {
        this.cursor = {
          index: idx,
          side: Side.LEFT
        };
      }
    });
  }

  moveCursorUp() {
    const selected = this.charElements.toArray()[this.cursor.index].nativeElement as HTMLElement;
    const charRows = this.charRows;
    let selectedElementRow: number;
    // OPTIMIZE: no need to iterate through entire thing, use continue and traditional for loop...?
    charRows.forEach((charRow, charRowIndex) => {
      if (charRow.find(charElt => charElt === selected) != null) {
        selectedElementRow = charRowIndex;
      }
    });
    if (selectedElementRow === 0) {
      this.cursor = {
        index: 0,
        side: Side.LEFT
      };
    } else if (selectedElementRow > 0) {
      const centerOfSelectedElement = (selected.getBoundingClientRect().left + selected.getBoundingClientRect().right) / 2;
      const charRowAboveSelectedElement = charRows[selectedElementRow - 1];
      charRowAboveSelectedElement.forEach(charElt => {
        const charEltBound = charElt.getBoundingClientRect();
        const isInside = charEltBound.left < centerOfSelectedElement && charEltBound.right > centerOfSelectedElement;
        if (isInside) {
          this.setCursorToElement(charElt);
        }
      });
    } else {
      throw new Error('did not expect to get here');
    }
  }

  moveCursorLeft() {
    if (this.cursor.side === Side.RIGHT) {
      this.cursor.side = Side.LEFT;
    } else {
      if (this.cursorPos > 0) {
        this.cursor.index = this.cursor.index - 1;
      } else {
        // nothing to do
      }
    }
  }

  moveCursorRight() {
    if (this.cursor.side === Side.LEFT) {
      this.cursor.side = Side.RIGHT;
    } else {
      if (this.cursorPos < this.charElements.length) {
        this.cursor.index = this.cursor.index + 1;
      } else {
        // nothing to do
      }
    }
  }

  elementRightOfCursor() {
    const eltRight = this.charElements.toArray()[this.cursorPos];
    return eltRight ? eltRight.nativeElement : null;
  }

  onClickCharLeft(char: string, index: number) {
    this.focusInput();
    this.cursor = {
      index,
      side: Side.LEFT
    };
  }

  onClickCharRight(char: string, index: number) {
    this.focusInput();
    this.cursor = {
      index,
      side: Side.RIGHT
    };
  }

  findClosestHorizontalChar(e) {
    let closest: {
      idx: number,
      distanceX: number;
      distanceY: number;
      elt: HTMLElement;
      isLeft: boolean;
    } | null = null;
    this.charElements.forEach((charElt, idx) => {
      // console.log(charElt.nativeElement.innerText, JSON.stringify(charElt.nativeElement.getBoundingClientRect()));
      const nativeElement = charElt.nativeElement;
      const distanceX = this.clickedInsideHorizontal(e, nativeElement) ? 0 : Math.min(
        Math.abs(e.clientX - nativeElement.getBoundingClientRect().left),
        Math.abs(e.clientX - nativeElement.getBoundingClientRect().right)
      );
      const distanceY = this.clickedInsideVertical(e, nativeElement) ? 0 : Math.min(
        Math.abs(e.clientY - nativeElement.getBoundingClientRect().top),
        Math.abs(e.clientY - nativeElement.getBoundingClientRect().bottom)
      );
      const isLeft = e.clientX < nativeElement.getBoundingClientRect().left;
      const updateClosest = () => {
        closest = {
          distanceX,
          distanceY,
          idx,
          elt: nativeElement,
          isLeft
        };
      };
      if (closest != null) {
        if (distanceY < closest.distanceY) {
          updateClosest();
        } else if (distanceY === closest.distanceY && distanceX < closest.distanceX) {
          updateClosest();
        } else {
          // no improvement
        }
      } else {
        updateClosest();
      }
    });
    return closest;
  }


  clickedInsideHorizontal(e, elt: HTMLElement) {
    const bound = elt.getBoundingClientRect();
    return e.clientX > bound.left && e.clientX < bound.right;
  }

  clickedInsideVertical(e, elt: HTMLElement) {
    const bound = elt.getBoundingClientRect();
    return e.clientY > bound.top && e.clientY < bound.bottom;
  }

  isInside(x: number, y: number, elt: HTMLElement) {
    const bound = elt.getBoundingClientRect();
    return x > bound.left && x < bound.right && y > bound.top && y < bound.bottom;
  }

  onClickInputField(e) {
    this.focusInput();
    const closest = this.findClosestHorizontalChar(e);
    if (closest.isLeft) {
      this.cursor = {
        index: closest.idx,
        side: Side.LEFT
      };
    } else {
      this.cursor = {
        index: closest.idx,
        side: Side.RIGHT
      };
    }
  }

  getCursor(idx: number) {
    if (this.cursor != null && this.cursor.index === idx) {
      return this.cursor.side === Side.LEFT ? CharCursor.LEFT : CharCursor.RIGHT;
    } else {
      return CharCursor.NONE;
    }
  }

}
