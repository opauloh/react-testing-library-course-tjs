import * as React from 'react'
import {screen, render, fireEvent} from '@testing-library/react'
import user from '@testing-library/user-event'
import {FavoriteNumber} from '../favorite-number'

test('renders a number input with a label "Favorite Number"', () => {
  render(<FavoriteNumber />)
  // const {debug} = render(<FavoriteNumber />)
  const input = screen.getByLabelText(/favorite number/i)
  expect(input).toHaveAttribute('type', 'number')
  // debug(input)
})

test('entering an invalid value shows an error message [fireEvent]', () => {
  render(<FavoriteNumber />)
  const input = screen.getByLabelText(/favorite number/i)
  fireEvent.change(input, {
    target: {
      value: '10',
    },
  })
  expect(screen.getByRole('alert')).toHaveTextContent(/the number is invalid/i)
})

test('entering an invalid value shows an error message [user-event module]', () => {
  render(<FavoriteNumber />)
  const input = screen.getByLabelText(/favorite number/i)
  user.type(input, '10')
  expect(screen.getByRole('alert')).toHaveTextContent(/the number is invalid/i)
})
