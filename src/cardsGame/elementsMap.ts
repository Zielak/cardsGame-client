import { Component } from './component'

/**
 * @deprecated
 */
export default class ElementsMap {
  _idList = new Map<string, Component<any>>()
  _elements = new Array<Component<any>>()

  add(element: Component<any>) {
    this._idList.set(element.id, element)
    this._elements.push(element)
  }
  remove(id: string) {
    this._idList.delete(id)
    this._elements = this._elements.filter(el => el.id !== id)
  }

  getById(id) {
    return this._idList.get(id)
  }
  getByType(type) {
    return this._elements.filter(element => element.type === type)
  }
  filter(fn) {
    return this._elements.filter(fn)
  }
  map(fn) {
    return this._elements.map(fn)
  }
  forEach(fn) {
    return this._elements.forEach(fn)
  }
}
