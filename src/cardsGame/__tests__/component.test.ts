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

test('update comes right after construction', () =>
  new Promise(resolve => {
    const comp = newComponent({
      name: 'test1'
    })

    comp.componentDidUpdate = (props: Set<string>) => {
      expect(typeof props).toBe('object')
      expect(props instanceof Set).toBeTruthy()

      expect(props.has('type')).toBeFalsy()
      expect(props.has('name')).toBeTruthy()
      expect(props.size).toBe(2)
      resolve()
    }
  })
)

test('schedules update "long" after construction', () =>
  new Promise((resolve) => {
    const comp = newComponent({
      name: 'test1'
    })

    // Run assertions after initial update
    comp.componentDidUpdate = (props) => {
      comp.componentDidUpdate = resolve
      setTimeout(() => {
        comp.props.name = 'test2'
      }, 10)
    }
  })
)

test(`doesn't schedule update for same value`, () =>
  new Promise((resolve, reject) => {
    const comp = newComponent({
      name: 'test1',
      type: 'changeMe'
    })

    // Run assertions after initial update
    comp.componentDidUpdate = (props) => {
      comp.componentDidUpdate = reject
      comp.props.name = 'test1'
      comp.props.type = 'changing'
      setTimeout(() => {
        resolve()
      }, 0)
    }
  })
)

