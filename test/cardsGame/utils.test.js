import test from 'ava'
import {
  getElementById
} from '../../src/cardsGame/utils.js'
import uuid from 'uuid/v4'

test('getElementById', t => {
  const elements = [
    { id: uuid() },
    { id: uuid() },
    { id: uuid() },
    { id: uuid() },
  ]

  t.deepEqual(getElementById(elements, elements[0].id), elements[0], `didn't return correct element`)

  t.deepEqual(getElementById(elements, 'somethingImaginary'), undefined, `didn't return undefined`)
})
