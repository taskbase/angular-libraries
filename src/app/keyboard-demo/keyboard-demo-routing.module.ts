import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {KeyboardDemoComponent} from './keyboard-demo/keyboard-demo.component';
import {KeyboardHiddenDemoComponent} from './keyboard-hidden-demo/keyboard-hidden-demo.component';


const routes: Routes = [{
  path: '',
  component: KeyboardDemoComponent
}, {
  path: 'hidden',
  component: KeyboardHiddenDemoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KeyboardDemoRoutingModule {
}
