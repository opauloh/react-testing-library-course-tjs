import * as React from 'react'
import {Router} from 'react-router-dom'
import {createMemoryHistory} from 'history'
import {fireEvent, render, screen} from '@testing-library/react'
import {Main} from '../main'

test('main renders about and home and We can navigate between those pages', () => {
  const history = createMemoryHistory({initialEntries: ['/']})
  render(
    <Router history={history}>
      <Main />
    </Router>,
  )

  expect(screen.getByRole('heading')).toHaveTextContent(/home/i)

  fireEvent.click(screen.getByText(/about/i))

  expect(screen.getByRole('heading')).toHaveTextContent(/about/i)
})
