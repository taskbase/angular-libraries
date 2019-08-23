import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {KeyboardDemoComponent} from './keyboard-demo/keyboard-demo.component';


const routes: Routes = [{
  path: '',
  component: KeyboardDemoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KeyboardDemoRoutingModule {
}
