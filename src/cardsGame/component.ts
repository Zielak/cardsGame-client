import { Container } from 'pixi.js'

export interface IProps {
  id: string,
  idx: number,
  childrenIDs?: { [key: string]: string },
  children?: Component<any>[],
  type: string
}

export interface IComponent {
  componentDidUpdate: (props: any) => void
}

export class Component<T extends IProps> extends Container implements IComponent {

  _props: T
  _updateScheduled: boolean = false
  _propsProxy

  propTypes: { [key: string]: any }

  /**
   * Creates an instance of Component.
   * @param {any} props
   * @memberof Component
   */
  constructor(props: T) {
    super()
    // TODO: maybe clone and loose reference. But it's T...
    this._props = props
    this._generatePropsProxy()
  }

  private _generatePropsProxy() {
    this._propsProxy = new Proxy<T>(this._props, {
      set: (target, prop, value) => {
        if (target[prop] === value) {
          return true
        }
        target[prop] = value
        // checkPropTypes(this.propTypes, target, 'prop', this._componentName)
        this._scheduleUpdate()
        return true
      },
      get: (target, property) => {
        if (property === 'children') {
          // TODO: to reflect server behaviour
          // this should return an array of Components, not just IDs
          return target.childrenIDs ? Object.keys(target.childrenIDs) : undefined
        }

      }
    })

    this._propsProxy
  }

  _scheduleUpdate() {
    if (!this._updateScheduled) {
      this._updateScheduled = true
      console.log('update scheduled for later')
      setTimeout(() => {
        console.log('componentDidUpdate!')
        this.componentDidUpdate.call(this, this.props)
        this._updateScheduled = false
      }, 0)
    }
  }

  get props(): T {
    return this._propsProxy
  }

  set props(newProps) {
    for (const prop in newProps) {
      this.props[prop] = newProps[prop]
    }
  }

  get id() {
    return this.props.id
  }
  get idx() {
    return this.props.idx
  }
  get type() {
    return this.props.type
  }
  get _componentName() {
    return 'Component'
  }

  componentDidUpdate(props) { }

}
