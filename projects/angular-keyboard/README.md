# AngularKeyboard

## Installation

1. npm install `@taskbase/angular-keyboard`
2. Add `import {AngularKeyboardModule} from '@taskbase/angular-keyboard'` to your AppModule
3. Configure the angular-keyboard in the module imports, something like this:
```
    AngularKeyboardModule.forRoot({
      styles: {
        inputField: {
          'font-family': '"Palatino Linotype","Book Antiqua",Palatino,serif',
          'font-size': '120%',
          display: 'block',
          'line-height': '1.61',
          padding: '20px',
          'border-radius': '5px',
          background: '#f5f5f5',
          'box-shadow': 'inset 0 1px 1px rgba(0,0,0,.05)',
          'text-align': 'left'
        },
        addedChar: {
          'font-weight': 'bold',
          color: 'blue'
        },
        removedChar: {
          color: 'lightblue',
          'text-decoration': 'line-through'
        }
      }
    }),
```
4. Wrap the whole app content in `app.component.html` with `<tb-keyboard-container>...</tb-keyboard-container>`

5. Add `<tb-input (text)="onTextChange($event)">
    </tb-input>`

Note: If you only need the feature on some specific pages, you can also only load it there. Just make sure that the whole page content is wrapped.


## Demo
https://taskbase-angular-libraries.firebaseapp.com/keyboard


## Issues
It's not an easy task to build this lib, so there are some pending issues we're well aware of. Here's a list.

### Major Issues
- Ranges... => disabled :(
- handle multi-key commands
- newline / enter behaves weirdly

### Minor Issues
- On the word "Yo" in some fonts, the o is below the Y. The border right/left of the cursor then changes this by drawing a hard line between the two, causing a slight jumping behaviour of the text...
- improve left / right arrow keys


This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.3.

## Code scaffolding

Run `ng generate component component-name --project angular-keyboard` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project angular-keyboard`.
> Note: Don't forget to add `--project angular-keyboard` or else it will be added to the default project in your `angular.json` file. 

## Build

Update the package version in the `package.json` in this folder. Run `ng build angular-keyboard` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build angular-keyboard`, go to the dist folder `cd dist/angular-keyboard` and run `npm publish`.

## Running unit tests

Run `ng test angular-keyboard` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
