import { CContainer } from '../container'

const newCContainer = (options?: any) => new CContainer({
  childrenIDs: {},
  ...options,
  id: '' + Math.random()
})

test(`has isContainer`, () => {
  const cont = newCContainer()
  expect(cont.isContainer).toBe(true)
})

test(`calls redrawChildren on 'childadded' event`, () => {
  const cont = newCContainer()
  const redrawSpy = jest.spyOn(cont, 'redrawChildren')
  cont.emit('childadded')
  expect(redrawSpy).toBeCalled()
  expect(redrawSpy).toBeCalledTimes(1)
})
