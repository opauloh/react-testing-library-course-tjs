import * as React from 'react'
import {render} from '@testing-library/react'
import {axe} from 'jest-axe'

function Form() {
  return (
    <form>
      <input placeholder="email" />
    </form>
  )
}

function AccessibleForm() {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input placeholder="email" id="email" />
    </form>
  )
}

test('the form is inaccessible', async () => {
  const {container} = render(<Form />)
  const results = await axe(container)
  // expect(results.violations.length).toBeGreaterThan(0)
  expect(results).not.toHaveNoViolations()
})

test('the form is accessible', async () => {
  const {container} = render(<AccessibleForm />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
