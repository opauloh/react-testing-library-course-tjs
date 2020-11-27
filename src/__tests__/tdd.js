import * as React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'

function Editor() {
  const [isSaving, setIsSaving] = React.useState(false)
  const handleSubmit = e => {
    e.preventDefault()
    setIsSaving(true)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title-input">Title</label>
      <input id="title-input" />

      <label htmlFor="content-input">Content</label>
      <textarea id="content-input" />

      <label htmlFor="tags-input">Tags</label>
      <input id="tags-input" />

      <button type="submit" disabled={isSaving}>
        Submit
      </button>
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

test('button is disabled after click submit', () => {
  render(<Editor />)
  const submitButton = screen.getByText(/submit/i)

  fireEvent.click(submitButton)

  expect(submitButton).toBeDisabled()
})
