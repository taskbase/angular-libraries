import {Component, ElementRef, HostListener, Inject, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';

import {CharCursor} from './fake-char/char-cursor';
import {AngularKeyboardService} from '../angular-keyboard.service';
import {Subscription} from 'rxjs';
import {KeyboardCommandButton} from '../keyboard-commands';
import {Char, CharState} from './char';
import {AngularKeyboardModuleConfig} from '../angular-keyboard.module';
import {KEYBOARD_CONFIG} from '../constants';

enum Side {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

interface Cursor {
  index: number;
  side: Side;
}

@Component({
  selector: 'app-fake-input',
  templateUrl: './fake-input.component.html',
  styleUrls: ['./fake-input.component.scss']
})
export class FakeInputComponent implements OnInit, OnDestroy {

  @Input() key: string;
  @Input() suggestionMode = false;

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
      this.angularKeyboardService.inputFocused$.next(this.wrapper.nativeElement);
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
    private angularKeyboardService: AngularKeyboardService,
    @Inject(KEYBOARD_CONFIG) private config: AngularKeyboardModuleConfig
  ) {
    console.log(config);
  }

  ngOnInit() {
    this.registerInputField();
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
        if (next !== this.wrapper.nativeElement) {
          this.cursor = null;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.deregisterInputField();
  }

  registerInputField() {
    this.angularKeyboardService.inputFields.push(this.wrapper);
  }

  deregisterInputField() {
    const indexOfInputField = this.angularKeyboardService.inputFields.indexOf(this.wrapper);
    if (indexOfInputField !== -1) {
      this.angularKeyboardService.inputFields.splice(indexOfInputField, 1);
    } else {
      throw new Error('element not found for deregistration');
    }
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
        [KeyboardCommandButton.ARROW_DOWN]: () => this.moveCursorDown(),
        [KeyboardCommandButton.ESCAPE]: () => this.angularKeyboardService.inputFocused$.next(null),
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
    this.angularKeyboardService.inputFocused$.next(this.wrapper.nativeElement);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(e: KeyboardEvent) {
    if (this.cursorPos != null) {
      e.preventDefault();
      this.angularKeyboardService.input$.next(e.key);
    }
  }

  insertChar(char: string) {
    const newChar = {
      char,
      charState: this.suggestionMode ? CharState.ADDED : null
    };
    this.chars = [
      ...this.chars.slice(0, this.cursorPos),
      newChar,
      ...this.chars.slice(this.cursorPos, this.chars.length)
    ];
    this.cursor = {
      index: this.cursorPos,
      side: Side.RIGHT
    };

    this.cleanSuggestions();
  }

  cleanSuggestions() {
    if (this.suggestionMode) {
      const updatedChars = [];
      // tslint:disable-next-line
      for (let i = 0; i < this.chars.length; i++) {
        const char = this.chars[i];
        const nextChar = this.chars[i + 1];
        if (
          char.charState === CharState.ADDED &&
          nextChar != null && nextChar.charState === CharState.REMOVED &&
          char.char === nextChar.char
        ) {
          // this and the next char should be removed.
          updatedChars.push({
            ...char,
            charState: null
          });

          // Skip the next index.
          i = i + 1;
        } else {
          updatedChars.push(char);
        }
      }
      this.chars = updatedChars;
    }
  }

  deleteChar(charIndex: number) {
    this.chars = [
      ...this.chars.slice(0, charIndex - 1),
      ...this.chars.slice(charIndex, this.chars.length)
    ];
  }

  deleteCharLeftAndAdjustCursor() {
    if (this.cursorPos === 0) {
      // cannot delete more...
    } else {
      if (this.suggestionMode) {
        this.handleSuggestionModeOnDeleteCharLeft();
      } else {
        this.deleteChar(this.cursorPos);
      }
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

  handleSuggestionModeOnDeleteCharLeft() {
    const charLeft = this.chars[this.cursorPos - 1];
    if (charLeft.charState === CharState.ADDED) {
      // it's ok to kick it out
      this.deleteChar(this.cursorPos);
    } else {
      // mark the char left as deleted but don't actually delete
      this.chars[this.cursorPos - 1] = {
        ...charLeft,
        charState: CharState.REMOVED
      };
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

  setCursorToElement(elt: HTMLElement, side: Side) {
    this.charElements.toArray().forEach((charElt, idx) => {
      if (charElt.nativeElement === elt) {
        this.cursor = {
          index: idx,
          side
        };
      }
    });
  }

  moveCursorUp() {
    const selected = this.charElements.toArray()[this.cursor.index].nativeElement as HTMLElement;
    const charRows = this.charRows;
    const selectedElementRow = this.getSelectedElementRow(selected, charRows);
    if (selectedElementRow === 0) {
      this.cursor = {
        index: 0,
        side: Side.LEFT
      };
    } else if (selectedElementRow > 0) {
      const charRowAboveSelectedElement = charRows[selectedElementRow - 1];
      this.moveCursorUpDownHelper(selected, charRowAboveSelectedElement);
    } else {
      throw new Error('did not expect to get here');
    }
  }

  moveCursorDown() {
    const selected = this.charElements.toArray()[this.cursor.index].nativeElement as HTMLElement;
    const charRows = this.charRows;
    const selectedElementRow = this.getSelectedElementRow(selected, charRows);
    if (selectedElementRow === charRows.length - 1) {
      this.cursor = {
        index: this.charElements.length - 1,
        side: Side.RIGHT
      };
    } else if (selectedElementRow < charRows.length - 1) {
      const charRowBelowSelectedElement = charRows[selectedElementRow + 1];
      this.moveCursorUpDownHelper(selected, charRowBelowSelectedElement);
    } else {
      throw new Error('did not expect to get here');
    }
  }

  getSelectedElementRow(selected: HTMLElement, charRows: HTMLElement[][]): number {
    // TODO: disable the stoopid for loop rule...
    // tslint:disable-next-line
    for (let i = 0; i < charRows.length; i++) {
      const charRow = charRows[i];
      if (charRow.find(charElt => charElt === selected) != null) {
        return i;
      }
    }
    throw new Error('should not reach here');
  }

  moveCursorUpDownHelper(selected: HTMLElement, row: HTMLElement[]) {
    const cursorX = this.cursor.side === Side.LEFT
      ? selected.getBoundingClientRect().left
      : selected.getBoundingClientRect().right;
    for (const charElt of row) {
      const charEltBound = charElt.getBoundingClientRect();
      const isInside = charEltBound.left <= cursorX && charEltBound.right >= cursorX;
      if (isInside) {
        const side = cursorX - charEltBound.left < charEltBound.right - cursorX
          ? Side.LEFT
          : Side.RIGHT;
        this.setCursorToElement(charElt, side);
        return;
      }
    }
    // if nothing is found, the cursor is set to the last element on the right
    this.setCursorToElement(row[row.length - 1], Side.RIGHT);
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
