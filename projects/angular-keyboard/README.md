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


## Development

Run `ng build angular-keyboard --watch` from the repository root, then run `npm start`. That way you can test the behaviour of your library easily.

## Build and Publish

Update the package version in the `package.json` in this folder. Then run `npm run build-and-publish-keyboard` in the repository root.

## Running unit tests

Run `ng test angular-keyboard` to execute the unit tests via [Karma](https://karma-runner.github.io).
