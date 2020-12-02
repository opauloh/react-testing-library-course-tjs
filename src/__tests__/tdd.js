import * as React from 'react'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {build, fake, sequence} from 'test-data-bot'
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

const postBuilder = build('Post').fields({
  title: fake(f => f.lorem.words()),
  content: fake(f => f.lorem.paragraphs().replace(/\r/g, '')), //replace all new lines with empty string
  tags: fake(f => [f.lorem.words(), f.lorem.words(), f.lorem.words()]),
})

const userBuilder = build('User').fields({
  id: sequence(s => `user-${s}`),
})

function renderEditor() {
  const fakePost = postBuilder()
  // const fakePost = postBuilder({content: 'something special'}) //if some property must be special because affects the behavior of the application
  const fakeUser = userBuilder()

  render(<Editor user={fakeUser} />)

  screen.getByLabelText(/title/i).value = fakePost.title
  screen.getByLabelText(/content/i).value = fakePost.content
  screen.getByLabelText(/tags/i).value = fakePost.tags.join(', ')

  const submitButton = screen.getByText(/submit/i)

  return {
    fakeUser,
    fakePost,
    submitButton,
  }
}

test('renders a form with title, content, tags and a submit button', async () => {
  mockSavePost.mockResolvedValueOnce()

  const preDate = new Date().getTime()

  const {fakePost, fakeUser, submitButton} = renderEditor()

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
  await waitFor(() => expect(mockRedirect).toHaveBeenCalledWith({to: '/'}, {}))
})

test('renders an error message from the server', async () => {
  const testError = 'test error'
  mockSavePost.mockRejectedValueOnce({data: {error: testError}})

  const {submitButton} = renderEditor()

  fireEvent.click(submitButton)

  // eslint-disable-next-line testing-library/prefer-wait-for
  await waitFor(async () => {
    expect(await screen.findByRole('alert')).toHaveTextContent(testError)
    expect(submitButton).toBeEnabled()
  })
})
