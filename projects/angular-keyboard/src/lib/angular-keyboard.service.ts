import {ElementRef, Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AngularKeyboardService {

  inputFields: ElementRef[] = [];

  inputFocused$ = new Subject<null | HTMLElement>();

  input$ = new Subject();

  constructor() {
  }

}
