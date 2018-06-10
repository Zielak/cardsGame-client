import test from 'ava'
// import sinon from 'sinon'
import Component from '../../../client/cardsGame/component'

test(`_propsProxy is always present`, t => {
  const comp = new Component({ test: 'test1' })
  t.not(comp._propsProxy, undefined)
})

test(`props will give object with the same values as in _props`, t => {
  const comp = new Component({
    test: 'test1',
    one: 1
  })
  t.deepEqual(comp.props, comp._props)
})

test('gets proper value via props proxy', t => {
  const comp = new Component({ test: 'test1' })
  t.is(comp.props.test, 'test1')
  t.is(comp._props.test, comp.props.test)
})

test('sets new value to existing prop via proxy', t => {
  const comp = new Component({ test: 'test1' })
  comp.props.test = 'aaa'

  t.is(comp.props.test, 'aaa')
})

test('adds new prop via proxy', t => {
  const comp = new Component({ test: 'test1' })
  comp.props.aaa = 'aaa'

  t.is(comp.props.aaa, 'aaa')
  t.is(comp.props.test, 'test1')
})

test('schedules update after props change', t => new Promise(resolve => {
  const comp = new Component({ test: 'test1' })

  comp.componentDidUpdate = props => {
    t.is(props.test2, 2)
    resolve()
  }

  comp.props.test2 = 2
}))

test('does not schedule update if prop got the same value', t => new Promise((resolve, reject) => {
  const comp = new Component({ test: 'test1' })

  comp.componentDidUpdate = reject
  comp.props.test = 'test1'
  setTimeout(() => {
    t.pass()
    resolve()
  }, 5)
}))