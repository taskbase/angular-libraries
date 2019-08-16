import {Component, ElementRef, HostListener, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';

import {KeyboardCommandButton} from '../../../../../../../../Downloads/angular-super-keyboard(2)/src/app/keyboard/keyboard-commands';
import {CharCursor} from './fake-char/char-cursor';
import {AngularKeyboardService} from '../angular-keyboard.service';

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

export function isAncestor(descendant: HTMLElement, potentialAncestor: HTMLElement): boolean {
  if (descendant === potentialAncestor) {
    return true;
  } else {
    const parentNode = descendant.parentNode;
    if (parentNode instanceof HTMLElement) {
      if (parentNode === document.body) {
        return false;
      } else {
        return isAncestor(parentNode, potentialAncestor);
      }
    } else {
      throw new Error(`parent node was not of type HTMLElement, was ${parentNode} instead.`);
    }
  }
}

@Component({
  selector: 'app-fake-input',
  templateUrl: './fake-input.component.html',
  styleUrls: ['./fake-input.component.scss']
})
export class FakeInputComponent implements OnInit {

  @Input() key: string;
  @ViewChild('text', {static: true}) textElement: ElementRef;
  @ViewChild('wrapper', {static: true}) wrapper: ElementRef;
  @ViewChildren('fakechar', {read: ElementRef}) charElements: QueryList<ElementRef>;

  chars: Char[] = [];

  private cursorPrivate: Cursor | null = null;
  get cursor() {
    return this.cursorPrivate;
  }
  set cursor(cursor: Cursor | null) {
    this.cursorPrivate = cursor;
    this.angularKeyboardService.cursor$.next(this.cursor);
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
    this.angularKeyboardService.input$.subscribe(next => {
      this.handleKeyInput(next);
    });
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


  @HostListener('document:click', ['$event'])
  handleClickOnDocument(e: MouseEvent | TouchEvent) {
    if (
      this.cursor != null
      && !isAncestor(e.target as HTMLElement, this.wrapper.nativeElement)
      && !isAncestor(e.target as HTMLElement, this.angularKeyboardService.keyboardContainer)
    ) {
      this.cursor = null;
    }
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


  moveCursorUp() {
    // TODO
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


  clickedInsideHorizontal(e, elt) {
    const bound = elt.getBoundingClientRect();
    return e.clientX > bound.left && e.clientX < elt.right;
  }


  clickedInsideVertical(e, elt) {
    const bound = elt.getBoundingClientRect();
    return e.clientY > bound.top && e.clientY < bound.bottom;
  }

  onClickInputField(e) {
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
