import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CharCursor} from './char-cursor';
import {Char, CharState} from '../char';

@Component({
  selector: 'app-fake-char',
  templateUrl: './fake-char.component.html',
  styleUrls: ['./fake-char.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FakeCharComponent implements OnInit {

  @Input() cursor = CharCursor.NONE;
  @Input() char: Char;

  @Output() clickLeft = new EventEmitter();
  @Output() clickRight = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onClick(e) {
    e.stopPropagation(); // OPTIMIZE: maybe there is a way without this.
    const clickTarget = e.target;
    const clickTargetWidth = clickTarget.offsetWidth;
    const xCoordInClickTarget = e.clientX - clickTarget.getBoundingClientRect().left;
    if (clickTargetWidth / 2 > xCoordInClickTarget) {
      this.clickLeft.emit();
    } else {
      this.clickRight.emit();
    }
  }

  get isCursorLeft() {
    return this.cursor === CharCursor.LEFT;
  }

  get isCursorRight() {
    return this.cursor === CharCursor.RIGHT;
  }

  get ngClass() {
    return {
      'cursor-left': this.isCursorLeft,
      'cursor-right': this.isCursorRight,
      added: this.char.charState === CharState.ADDED,
      removed: this.char.charState === CharState.REMOVED
    };
  }

}
