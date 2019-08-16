import { Injectable } from '@angular/core';

import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeyInputService {

  charHeight = 20;

  input$ = new Subject();
  
  constructor() { }

}
