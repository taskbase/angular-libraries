import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {KeyboardCommandButton} from '../../keyboard-commands';

@Component({
  selector: 'tb-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: [
    '../keyboard-button.base.scss',
    './icon-button.component.scss'
  ]
})
export class IconButtonComponent implements OnInit {

  @Input() activated: boolean;

  @Input() btn: string;

  @Output() buttonClick = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  get buttonDisplay() {
    // http://xahlee.info/comp/unicode_computing_symbols.html
    const buttons = {
      [KeyboardCommandButton.SHIFT]: '&#8679;',
      [KeyboardCommandButton.BACKSPACE]: '&#9003',
      [KeyboardCommandButton.ONE_TWO_THREE]: '123'
    };
    return buttons[this.btn] || '???';
  }

}
