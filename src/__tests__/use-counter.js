import * as React from 'react'
import {render, act} from '@testing-library/react'
import {renderHook, act as actHook} from '@testing-library/react-hooks'
import {useCounter} from '../use-counter'

function setup({initialProps} = {}) {
  const result = {}
  function TestComponent(props) {
    result.current = useCounter(props)
    return null
  }
  render(<TestComponent {...initialProps} />)

  return result
}

test('exposes the count and increment/decrement functions', () => {
  const result = setup()
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(1)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

test('allows customization of the initial count', () => {
  const result = setup({initialProps: {initialCount: 3}})
  expect(result.current.count).toBe(3)
})

test('allows customization of the step', () => {
  const result = setup({initialProps: {step: 2}})
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(2)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

test('exposes the count and increment/decrement functions [renderHook]', () => {
  const {result} = renderHook(useCounter)
  expect(result.current.count).toBe(0)
  actHook(() => result.current.increment())
  expect(result.current.count).toBe(1)
  actHook(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

test('allows customization of the step [renderHook]', () => {
  const {result} = renderHook(useCounter, {initialProps: {step: 2}})
  expect(result.current.count).toBe(0)
  actHook(() => result.current.increment())
  expect(result.current.count).toBe(2)
  actHook(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

test('the step can be changed [renderHook]', () => {
  const {result, rerender} = renderHook(useCounter, {initialProps: {step: 3}})
  expect(result.current.count).toBe(0)
  actHook(() => result.current.increment())
  expect(result.current.count).toBe(3)
  rerender({step: 2})
  actHook(() => result.current.decrement())
  expect(result.current.count).toBe(1)
})
