import * as React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {savePost, savePost as mockSavePost} from '../api'

function Editor({user}) {
  const [isSaving, setIsSaving] = React.useState(false)
  const handleSubmit = e => {
    e.preventDefault()

    const {title, content, tags} = e.target.elements
    const newPost = {
      title: title.value,
      content: content.value,
      tags: tags.value.split(',').map(t => t.trim()),
      authorId: user.id,
    }

    setIsSaving(true)
    savePost(newPost)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title-input">Title</label>
      <input id="title-input" name="title" />

      <label htmlFor="content-input">Content</label>
      <textarea id="content-input" name="content" />

      <label htmlFor="tags-input">Tags</label>
      <input id="tags-input" name="tags" />

      <button type="submit" disabled={isSaving}>
        Submit
      </button>
    </form>
  )
}

jest.mock('../api')

afterEach(() => {
  jest.clearAllMocks()
})

test('renders a form with title, content, tags and a submit button', () => {
  const fakePost = {
    title: 'Test Title',
    content: 'Test Content',
    tags: ['tag1', 'tag2'],
  }
  const fakeUser = {
    id: 'user-1',
  }

  render(<Editor user={fakeUser} />)

  screen.getByLabelText(/title/i).value = fakePost.title
  screen.getByLabelText(/content/i).value = fakePost.content
  screen.getByLabelText(/tags/i).value = fakePost.tags.join(', ')

  const submitButton = screen.getByText(/submit/i)

  fireEvent.click(submitButton)

  expect(submitButton).toBeDisabled()

  expect(mockSavePost).toHaveBeenCalledWith({
    ...fakePost,
    authorId: fakeUser.id,
  })

  expect(mockSavePost).toHaveBeenCalledTimes(1)
})
