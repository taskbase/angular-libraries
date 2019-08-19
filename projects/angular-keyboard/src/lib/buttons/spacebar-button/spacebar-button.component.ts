import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'tb-spacebar-button',
  templateUrl: './spacebar-button.component.html',
  styleUrls: [
    '../keyboard-button.base.scss',
    './spacebar-button.component.scss'
  ]
})
export class SpacebarButtonComponent implements OnInit {

  @Output() buttonClick = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    this.buttonClick.emit(' ');
  }

}
