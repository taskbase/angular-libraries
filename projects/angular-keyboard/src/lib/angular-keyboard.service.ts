import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AngularKeyboardService {

  inputFocused$ = new Subject<boolean>();

  input$ = new Subject();

  constructor() {
  }

}
