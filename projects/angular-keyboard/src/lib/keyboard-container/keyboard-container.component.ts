import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AngularKeyboardService} from '../angular-keyboard.service';

@Component({
  selector: 'tb-keyboard-container',
  templateUrl: './keyboard-container.component.html',
  styleUrls: ['./keyboard-container.component.scss']
})
export class KeyboardContainerComponent implements OnInit {

  @ViewChild('keyboard', {static: true}) keyboardContainer: ElementRef;

  constructor(
    private angularKeyboardService: AngularKeyboardService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.angularKeyboardService.keyboardContainer = this.keyboardContainer;
  }

}
