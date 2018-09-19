import { Container } from 'pixi.js'

const components = new Map<string, Component<any>>()

export interface IProps {
  id: string,
  order?: number,
  childrenIDs?: { [key: string]: string },
  children?: Component<any>[],
  parentId?: string,
  name?: string,
  type?: string
}

export interface IComponent {
  componentDidUpdate: (props: any) => void
}

export class Component<T extends IProps> extends Container implements IComponent {

  _props: { [key: string]: any & T }
  _updateScheduled: boolean = false
  _propsProxy: { [key: string]: any & T }

  propTypes: { [key: string]: any }

  isContainer: boolean = false

  get interactive() {
    if (!this.parent) {
      return true
    }
    const parentComponent = this.parent as Component<any>
    if (parentComponent.isContainer) {
      // TODO: group that condition into one place
      if (parentComponent.type === 'deck' || parentComponent.type === 'pile')
        return false
    }
    return true
  }

  /**
   * Creates an instance of Component.
   * @param {any} props
   * @memberof Component
   */
  constructor(props: T) {
    super()

    components.set(props.id, this)
    this._props = {
      id: props.id
    }
    if (props) {
      for (let key in props) {
        this._props[key] = props[key]
      }
    }
    this._generatePropsProxy()

    this.on('removed', () => {
      components.delete(this._props.id)
    })
  }

  private _generatePropsProxy() {
    this._propsProxy = new Proxy(this._props, {
      set: (target, prop, value) => {
        if (typeof prop === 'symbol') return false
        if (target[prop] === value) {
          return true
        }
        target[prop] = value
        // checkPropTypes(this.propTypes, target, 'prop', this._componentName)
        this._scheduleUpdate()
        return true
      },
      get: (target: T, prop) => {
        if (typeof prop === 'symbol') return
        if (prop === 'children') {
          return Object.keys(target.childrenIDs)
            .filter(Component.exists)
            .map(Component.get)
        }
        return target[prop]
      }
    })
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
    return this._propsProxy as T
  }

  set props(newProps) {
    for (const prop in newProps) {
      this.props[prop] = newProps[prop]
    }
  }

  get id() {
    return this.props.id
  }
  get type() {
    return this.props.type
  }
  get _componentName() {
    return 'Component'
  }

  static exists(id): boolean {
    return components.has(id)
  }
  static get(id): Component<any> | undefined {
    return components.get(id)
  }

  componentDidUpdate(props) { }

}
