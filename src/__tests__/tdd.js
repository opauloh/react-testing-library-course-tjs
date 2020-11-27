import * as React from 'react'
// eslint-disable-next-line testing-library/prefer-wait-for
import {fireEvent, render, screen, wait} from '@testing-library/react'
import {Redirect as mockRedirect} from 'react-router'
import {savePost as mockSavePost} from '../api'
import Editor from '../Editor'

jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null),
  }
})
jest.mock('../api')

afterEach(() => {
  jest.clearAllMocks()
})

test('renders a form with title, content, tags and a submit button', async () => {
  const fakePost = {
    title: 'Test Title',
    content: 'Test Content',
    tags: ['tag1', 'tag2'],
  }
  const fakeUser = {
    id: 'user-1',
  }

  const preDate = new Date().getTime()

  render(<Editor user={fakeUser} />)

  screen.getByLabelText(/title/i).value = fakePost.title
  screen.getByLabelText(/content/i).value = fakePost.content
  screen.getByLabelText(/tags/i).value = fakePost.tags.join(', ')

  const submitButton = screen.getByText(/submit/i)

  fireEvent.click(submitButton)

  expect(submitButton).toBeDisabled()

  expect(mockSavePost).toHaveBeenCalledWith({
    ...fakePost,
    date: expect.any(String),
    authorId: fakeUser.id,
  })

  expect(mockSavePost).toHaveBeenCalledTimes(1)

  const postDate = new Date().getTime()

  const date = new Date(mockSavePost.mock.calls[0][0].date).getTime()

  expect(date).toBeGreaterThanOrEqual(preDate)
  expect(date).toBeLessThanOrEqual(postDate)
  // eslint-disable-next-line testing-library/prefer-wait-for
  await wait(() => expect(mockRedirect).toHaveBeenCalledWith({to: '/'}, {}))
})
