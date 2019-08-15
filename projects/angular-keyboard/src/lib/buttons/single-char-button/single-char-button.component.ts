import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'tb-single-char-button',
  templateUrl: './single-char-button.component.html',
  styleUrls: [
    '../keyboard-button.base.scss',
    './single-char-button.component.scss'
  ]
})
export class SingleCharButtonComponent implements OnInit {

  @Input() btn: string;

  @Output() buttonClick = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

}
