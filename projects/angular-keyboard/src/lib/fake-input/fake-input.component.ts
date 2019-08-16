import {Component, ElementRef, HostListener, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';

import {KeyInputService} from './key-input.service';

import {KeyboardCommandButton} from '../../../../../../../../Downloads/angular-super-keyboard(2)/src/app/keyboard/keyboard-commands';
import {CharCursor} from './fake-char/char-cursor';

// import {FakeCharComponent} from './fake-char/fake-char.component';

enum Side {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

interface Char {
  char: string
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
export class FakeInputComponent implements OnInit {

  @Input() key: string;
  @ViewChild('text', {static: true}) textElement: ElementRef;
  @ViewChildren('fakechar', {read: ElementRef}) charElements: QueryList<ElementRef>;

  chars: Char[] = [];

  cursor: Cursor | null = null;

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

  constructor(
    private keyInputService: KeyInputService
  ) {
  }

  ngOnInit() {
    this.chars = 'Some textSome textSome textSome textSome textSome textSome textSome textSome textSome textSome textSome textSome'
      .split('').map(char => {
        return {
          char
        };
      });
    this.keyInputService.input$.subscribe((next: string) => {
      const handledEvents = {
        [KeyboardCommandButton.BACKSPACE]: () => {
          if (this.cursorPos > 0) {
            this.deleteCharLeftAndAdjustCursor();
            console.log(this.cursor);
          }
        },
        [KeyboardCommandButton.SPACEBAR]: () => this.insertChar(' '),
        [KeyboardCommandButton.ARROW_LEFT]: () => this.moveCursorLeft(),
        [KeyboardCommandButton.ARROW_RIGHT]: () => this.moveCursorRight(),
        [KeyboardCommandButton.ARROW_UP]: () => this.moveCursorUp(),
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
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(e: KeyboardEvent) {
    if (this.cursorPos != null) {
      e.preventDefault();
      this.keyInputService.input$.next(e.key);
    }
  }

  insertChar(char: string) {
    this.chars = [
      ...this.chars.slice(0, this.cursorPos),
      {char: char},
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

  moveCursorUp() {
    // ok this is tricky...
    // implementation: store cursor distance from left of the input box,
    // then travel up until you find another element that is more to the right, then find an element that is further to the left... :)
    const elementRightOfCursor = this.elementRightOfCursor();
    if (elementRightOfCursor instanceof HTMLElement) {
      console.log('here', elementRightOfCursor.offsetLeft);
    }
  }

  moveCursorLeft() {
    if (this.cursorPos > 0) {

    }
  }

  elementRightOfCursor() {
    const eltRight = this.charElements.toArray()[this.cursorPos];
    return eltRight ? eltRight.nativeElement : null;
  }

  moveCursorRight() {
    if (this.cursorPos < this.chars.length) {
      // TODO;
    }
  }

  onClickCharLeft(char: string, index: number) {
    this.cursor = {
      index,
      side: Side.LEFT
    };
  }

  onClickCharRight(char: string, index: number) {
    this.cursor = {
      index,
      side: Side.RIGHT
    };
  }

  displayCursor(idx: number) {
    return this.cursorPos === idx;
  }

  onClickInputField(e) {
    const clickTarget = e.target;
    const yCoordInClickTarget = e.clientY - clickTarget.getBoundingClientRect().top;
    const rowNumber = Math.floor(yCoordInClickTarget / this.keyInputService.charHeight);

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
    this.cursor = {
      index: charClustersByRow.slice(0, rowNumber + 1).map(row => row.length).reduce((a, b) => a + b, 0) - 1,
      side: Side.RIGHT
    };

  }

  getCursor(idx: number) {
    if (this.cursor != null && this.cursor.index === idx) {
      return this.cursor.side === Side.LEFT ? CharCursor.LEFT : CharCursor.RIGHT;
    } else {
      return CharCursor.NONE;
    }
  }


}
