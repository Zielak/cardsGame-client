import { Component, IProps } from '../component'

const newComponent = (options?: any) => new Component({
  childrenIDs: {},
  ...options,
  id: '' + Math.random()
})

test(`_propsProxy is always present`, () => {
  const comp = newComponent()
  expect(comp._propsProxy).toBeDefined()
})

test(`props will give object with the same values as in _props`, () => {
  const comp = newComponent({
    name: 'test1',
    order: 2
  })
  expect(comp.props).toEqual(comp._props)
})

test('gets proper value via props proxy', () => {
  const comp = newComponent({ name: 'test1' })
  expect(comp.props.name).toBe('test1')
  expect(comp._props.name).toBe('test1')
  expect(comp._propsProxy.name).toBe('test1')
})

test('sets new value to existing prop via proxy', () => {
  const comp = newComponent({ name: 'test1' })
  comp.props.name = 'aaa'

  expect(comp.props.name).toBe('aaa')
})

test('adds new prop via proxy', () => {
  const comp = newComponent({ name: 'test1' })
  comp.props.aaa = 'aaa'

  expect(comp.props.aaa).toBe('aaa')
  expect(comp.props.name).toBe('test1')
})

test('schedules update after props change', () => new Promise(resolve => {
  const comp = newComponent({ name: 'test1' })

  comp.componentDidUpdate = props => {
    expect(props.test2).toBe(2)
    resolve()
  }

  comp.props.test2 = 2
}))

test('does not schedule update if prop got the same value', () => new Promise((resolve, reject) => {
  const comp = newComponent({ name: 'test1' })

  comp.componentDidUpdate = reject
  comp.props.name = 'test1'
  setTimeout(() => {
    resolve()
  }, 5)
}))
