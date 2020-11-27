import * as React from 'react'
import {render, screen} from '@testing-library/react'

function Editor() {
  return (
    <form>
      <label htmlFor="title-input">Title</label>
      <input id="title-input" />

      <label htmlFor="content-input">Content</label>
      <textarea id="content-input" />

      <label htmlFor="tags-input">Tags</label>
      <input id="tags-input" />

      <button type="submit">Submit</button>
    </form>
  )
}

test('renders a form with title, content, tags and a submit button', () => {
  render(<Editor />)
  expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/content/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/tags/i)).toBeInTheDocument()
  expect(screen.getByText(/submit/i)).toBeInTheDocument()
})
