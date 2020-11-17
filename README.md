# react-testing-library-course

_Course material for testing React components using react-testing-library_

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [notes](#notes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

- `react-dom.js` - Render a React component for testing
- `jest-dom.js` - Use jest-dom for improved assertions
- `dom-testing-library.js` - Use dom-testing-library to write more maintainable
  React tests
- `react-testing-library.js` - Use react-testing-library to render and test
  React Components
- `localized.js` - Testing localized content with react-testing-library
- `state.js` - Test React Component state changes with react-testing-library
- `prop-updates.js` - Test prop updates with react-testing-library
- `a11y.js` - Test accessibility of rendered React Components with jest-axe
- `dependency-injection.js` - Mock HTTP Requests with Dependency Injection in
  React Component Tests
- `http-jest-mock.js` - Mock HTTP Requests with jest.mock in React Component
  Tests
- `mock-component.js` - Mock react-transition-group in React Component Tests
  with jest.mock
- `error-boundaries.js` - Test componentDidCatch handler error boundaries with
  react-testing-library
- `tdd-markup.js` - Test drive the development of a React Form with
  react-testing-library
- `tdd-functionality.js` - TDD the functionality of a React Form with
  react-testing-library
- `react-router.js` - Test react-router Provider history object in React
  Component Tests with createMemoryHistory
- `redux.js` - Test a redux connected React Component
- `custom-hook.js` - Test a custom hook
- `portals.js` - Test React portals
- `unmounting.js` - Test Unmounting a React Component with react-testing-library
- `app.js` - Testing the full application.

> Note: the setup for this project uses kcd-scripts. Don't worry about that. You
> can learn about how to configure jest properly in the "Configure Jest for
> Testing JavaScript Applications" module of TestingJavaScript.com

### notes

- @testing-library/jest-dom : The Jest DOM library provides really useful
  extensions to jest’s built-in assertion library that will make it easier for
  us to write our test assertions, also make the error messages more easy to
  understand. You can extend expect to use it:

  ```js
  import {toHaveAttribute} from '@testing-library/jest-dom'

  expect.extend({toHaveAttribute})
  ```

  ... or extend everything:

  ```js
  import * as jestDOM from '@testing-library/jest-dom'

  expect.extend(jestDOM)
  ```

  ... or import like this:

  ```js
  import '@testing-library/jest-dom/extend-expect'
  ```

Also, you can check in the docs for all currently available assertion methods:
(https://github.com/testing-library/jest-dom)[https://github.com/testing-library/jest-dom]

- We can get our elements in a less imperative way, like for example using

```js
const input = screen.getByLabelText(/favorite number/i)
```

- We can use regex to let our tests more flexible, like that:
  `/favorite number/i`, the "i", stands for insensitive case, because in this
  case the user is not impacted by the case of the label texts, and if we decide
  to change it, we don't need to rewrite our tests:

```js
const input = screen.getByLabelText(/favorite number/i)
expect(input).toHaveAttribute('type', 'number')
```

- Debug allows us to inspect how the code looks like, at a specific point, and
  we can use it like that:

```js
const {debug} = render(<FavoriteNumber />)
debug(input)
```

It defaults to the container where all of our queries are bound to, or it will
print out the DOM node that we pass to it, making it much easier to develop our
tests

- testing-library/react provides us the **fireEvent** API, and this allows us to
  fire an event on the element that we want to test:

```js
test('entering an invalid value shows an error message', () => {
  render(<FavoriteNumber />)
  const input = screen.getByLabelText(/favorite number/i)
  fireEvent.change(input, {
    target: {
      value: '10',
    },
  })
  expect(screen.getByRole('alert')).toHaveTextContent(/the number is invalid/i)
})
```

in the above scenario we fired an on change event in the input, with the options
target.value equals to 10
