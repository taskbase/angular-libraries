# AngularKeyboard

## Installation

1. npm install @taskbase/angular-keyboard
2. `import {AngularKeyboard} from '@taskbase/angular-keyboard'` and add to imports of your main AppModule.
3. Wrap the whole app content in `app.component.html` with `<tb-keyboard-container>...</tb-keyboard-container>`


## Demo
https://angular-keyboard-demo.firebaseapp.com/

## 

## Issues
It's not an easy task to build this lib, so there are some pending issues we're well aware of. Here's a list.

### Major Issues
- Ranges... => disabled :(
- handle multi-key commands
- newline / enter behaves weirdly

### Minor Issues
- On the word "Yo" in some fonts, the o is below the Y. The border right/left of the cursor then changes this by drawing a hard line between the two, causing a slight jumping behaviour of the text...
- improve left / right arrow keys



========================================================================

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.3.

## Code scaffolding

Run `ng generate component component-name --project angular-keyboard` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project angular-keyboard`.
> Note: Don't forget to add `--project angular-keyboard` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build angular-keyboard` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build angular-keyboard`, go to the dist folder `cd dist/angular-keyboard` and run `npm publish`.

## Running unit tests

Run `ng test angular-keyboard` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
