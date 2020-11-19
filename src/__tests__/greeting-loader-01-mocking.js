import * as React from 'react'
// eslint-disable-next-line testing-library/prefer-wait-for
import {render, screen, fireEvent, wait} from '@testing-library/react'
// import {act} from 'react-dom/test-utils's
import {loadGreeting as mockLoadGreeting} from '../api'
import {GreetingLoader} from '../greeting-loader-01-mocking'

jest.mock('../api')

test('loads greetings on click', async () => {
  const testGreeting = 'TEST_GREETING'
  mockLoadGreeting.mockResolvedValueOnce({data: {greeting: testGreeting}})
  render(<GreetingLoader />)
  const nameInput = screen.getByLabelText(/name/i)
  const loadButton = screen.getByText(/load/i)
  nameInput.value = 'Mary'
  // act(() => {
  fireEvent.click(loadButton)
  // })

  expect(mockLoadGreeting).toHaveBeenLastCalledWith('Mary')
  expect(mockLoadGreeting).toHaveBeenCalledTimes(1)
  // eslint-disable-next-line testing-library/prefer-wait-for
  await wait(() =>
    expect(screen.getByLabelText(/greeting/i)).toHaveTextContent(testGreeting),
  )
  // await waitFor(() => screen.findByLabelText(/greeting/i))

  expect(screen.getByLabelText(/greeting/i)).toHaveTextContent(testGreeting)
})
