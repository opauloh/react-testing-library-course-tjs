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
  `/favorite number/i`, the "I", stands for insensitive case, because in this
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

- @testing-library/user-event, this module from testing-library, allows us to
  simulate better the user behavior when developing tests, instead of manually
  fire each event, we can fire all the events related to user behavior at once
  (i.e. onChange, onKeyDown, onKeyUp, onKeypress, etc...), so it represents
  better what users typically do:

```js
test('entering an invalid value shows an error message [user-event module]', () => {
  render(<FavoriteNumber />)
  const input = screen.getByLabelText(/favorite number/i)
  user.type(input, '10')
  expect(screen.getByRole('alert')).toHaveTextContent(/the number is invalid/i)
})
```

- **rerender**, the rerender method is extracted from render, and it can be
  useful to simulate, or debug code after the component is re-rendered with
  other props

```js
const {debug, rerender} = render(<FavoriteNumber />)
const input = screen.getByLabelText(/favorite number/i)
user.type(input, '10')
debug()
expect(screen.getByRole('alert')).toHaveTextContent(/the number is invalid/i)
rerender(<FavoriteNumber max={10} />)
debug()
```

- **jest-axe**, we can use this library to test assertions against accessibility
  (a11y), using the method toHaveNoViolations(), that can be extended by
  importing `import 'jest-axe/extend-expect'` or
  `import {axe, toHaveNoviolations} from 'jest-axe'`

```js



function AccessibleForm() {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input placeholder="email" id="email" />
    </form>
  )
}


test('the form is accessible', async () => {
  const {container} = render(<AccessibleForm />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()

```

- Mocking: whenever our components deals with HTTP requests, we can use
  jest.mock() api, to mock those requests, he takes all the functions that are
  exported from that module, and replace them with mock functions. Then when we
  import a method from the api module that was mocked, its give us back a mocked
  version of that method.

```js
import {loadGreeting} from '../api'

jest.mock('../api') // now all methods from api are mocked, i.e. loadGreeting
```

Also is a good practice to rename those methods, to be more clear that they are
mocked:

```js
import {loadGreeting as mockLoadGreeting} from '../api'

test('loads greetings on click', () => {
  mockLoadGreeting.mockResolvedValueOnce({data: {greeting: 'TEST_GREETING'}})
  const {getByLabelText, getByText} = render(<GreetingLoader />)
  const nameInput = getByLabelText(/name/i)
  const loadButton = getByText(/load/i)
  nameInput.value = 'Mary'
  fireEvent.click(loadButton)
})
```

- wait : this method from react testing library is an async utility and we use
  it whenever we have to wait for some action to be complete, also then we have
  to transform our functions into async await. Note: it has been replaced with
  waitFor in new versions of 'react-testing-library':

```js
import {render, fireEvent, wait} from '@testing-library/react'

test('loads greetings on click', async () => {
  mockLoadGreeting.mockResolvedValueOnce({data: {greeting: 'TEST_GREETING'}})
  const {getByLabelText, getByText} = render(<GreetingLoader />)
  const nameInput = getByLabelText(/name/i)
  const loadButton = getByText(/load/i)
  nameInput.value = 'Mary'
  fireEvent.click(loadButton)
  expect(mockLoadGreeting).toHaveBeenCalledWith('Mary')
  expect(mockLoadGreeting).toHaveBeenCalledTimes(1)
  wait(() =>
    expect(getByLabelText(/greeting/i)).toHaveTextContent('TEXT_GREETING'),
  )
})
```

- In certain environments, i.e. when we have our components in Storybook, we
  can't use jest.mock(), so we can mock our functions in another way for
  testing, by using jest.fn():

```js
import * as React from 'react'
import {render} from '@testing-library/react'
import {GreetingLoader} from '../greeting-loader-02-dependency-injection'

test('loads greetings on click', async () => {
  const mockLoadGreeting = jest.fn()
  mockLoadGreeting.mockResolvedValueOnce({data: {greeting: 'hi'}})
  render(<GreetingLoader loadGreeting={mockLoadGreeting} />)
})
```

Then in the component we add the api as dependency injection:

```js
import React from 'react'
import * as api from './api'

function GreetingLoader({loadGreeting = api.loadGreeting}) {

```

and by using `({loadGreeting = api.loadGreeting})` we still have the default
values

- **Mocking Components**: with jest.mock we can mock other components from or
  not other libraries, like that:

```js
jest.mock('react-transition-group', () => {
  return {
    CSSTransition: props => (props.in ? props.children : null),
  }
})
```

and this is useful when we want to avoid some specific implementation that are
not relevant for our test, like remove a setTimeOut from the wrapper component

- ErrorBoundary: It is possible to debug an ErrorBoundary component, and there
  are a few techniques to do that:

Create a component that can throw an error:

```js
function Bomb({shouldThrow}) {
  if (shouldThrow) throw new Error('💣')

  return null
}
```

Create the test component and rerender the ErrorBoundary with the Error, and
check for errors using expect.any(Error)

```js
test('calls reportError and renders that where was a problem', () => {
  const {rerender} = render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>,
  )

  rerender(
    <ErrorBoundary>
      <Bomb shouldThrow />
    </ErrorBoundary>,
  )

  const error = expect.any(Error)
})
```

- It's also possible to check if some API has been called with the right
  properties, using jest.mock, like in this case our ErrorBoundary component was
  looking like that:

```js
import React from 'react'
import {reportError} from './api'

class ErrorBoundary extends React.Component {
  state = {hasError: false}
  componentDidCatch(error, info) {
    this.setState({hasError: true})
    reportError(error, info)
  }
  ///...
}

export {ErrorBoundary}
```

and in our test we mocked reportError from api and checked if the api was called
with the right parameters

```js
jest.mock('../api')

test('calls reportError and renders that where was a problem', () => {
  mockReportError.mockResolvedValueOnce({success: true})

  //....

  const error = expect.any(Error)
  const info = {componentStack: expect.stringContaining('Bomb')}
  expect(mockReportError).toHaveBeenCalledWith(error, info)
  expect(mockReportError).toHaveBeenCalledTimes(1)
})
```

- Also whenever we use jest.mock(), it is a good practice to call afterEach and
  clearAllMocks, so we guarantee that other tests in this file are not receiving
  the mock we configured in this test. (they are not leaking out to other
  tests):

```js
afterEach(() => {
  jest.clearAllMocks()
})
```

- We can use jest.spyOn(), to override some implementations like console.error
  (to avoid an large error due to stack trace when it is expected), and to setup
  this for all tests we can use the beforeAll method:

```js
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})
```

- When overriding methods, it's important to restore they to their original
  state by calling mockRestore() in the afterAll method:

```js
afterAll(() => {
  console.error.mockRestore()
  console.error('error restored')
})
```

- **inline Snapshots**: behave identically to external snapshots ( . snap
  files), except the snapshot values are written automatically back into the
  source code. This means you can get the benefits of automatically generated
  snapshots without having to switch to an external file to make sure the
  correct value was written.
