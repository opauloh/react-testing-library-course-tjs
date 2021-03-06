import * as React from 'react'
import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {GreetingLoader} from '../greeting-loader-02-dependency-injection'

test('loads greetings on click', async () => {
  const testGreeting = 'TEST_GREETING'
  const mockLoadGreeting = jest.fn()
  mockLoadGreeting.mockResolvedValueOnce({data: {greeting: testGreeting}})
  render(<GreetingLoader loadGreeting={mockLoadGreeting} />)
  const nameInput = screen.getByLabelText(/name/i)
  const loadButton = screen.getByText(/load/i)
  nameInput.value = 'Mary'

  fireEvent.click(loadButton)

  expect(mockLoadGreeting).toHaveBeenLastCalledWith('Mary')
  expect(mockLoadGreeting).toHaveBeenCalledTimes(1)
  await waitFor(() =>
    expect(screen.getByLabelText(/greeting/i)).toHaveTextContent(testGreeting),
  )
  expect(screen.getByLabelText(/greeting/i)).toHaveTextContent(testGreeting)
})
