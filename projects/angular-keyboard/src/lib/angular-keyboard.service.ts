import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AngularKeyboardService {

  keyboardContainer: HTMLElement | null = null;

  cursor$ = new Subject();

  input$ = new Subject();

  constructor() {
  }

}
