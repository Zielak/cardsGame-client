import { Container, DisplayObject } from 'pixi.js'

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
  setup: () => void
  componentDidUpdate: (props: Set<string>) => void
}

export class Component<T extends IProps> extends Container implements IComponent {

  _props: { [key: string]: any & T }
  _propsProxy: { [key: string]: any & T }
  _updateScheduled: boolean = false
  _updatedProps = new Set<string>()

  isContainer: boolean = false

  /**
   * Creates an instance of Component.
   */
  constructor(props: T) {
    super()

    components.set(props.id, this)
    this._props = {
      id: props.id
    }

    // Generate "public" proxy for the props
    this._propsProxy = new Proxy(this._props, {

      set: (target, prop: string, value) => {
        // if (typeof prop === 'symbol') {
        //   return false
        // }
        if (target[prop] === value) {
          return true
        }
        target[prop] = value

        this._scheduleUpdate(prop)
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

    // Pass all props to our proxy, so it has a chance to schedule updates
    if (props) {
      for (let key in props) {
        // this._props[key] = props[key]
        this._propsProxy[key] = props[key]
      }
    }

    this.setup()
    // setTimeout(() => {
    //   this.componentDidUpdate()
    // }, 0)

    this.on('removed', () => {
      components.delete(this._props.id)
    })
  }

  /**
   * Override it.
   * Called on construction, create all graphical elements in here.
   */
  setup() { }

  /**
   * Override it.
   * Called every time any prop gets updated with new value.
   * Update your graphical elements accordingly.
   */
  componentDidUpdate(props: Set<string>) { }

  _preComponentDidUpdate(props: Set<string>) {

    if (props.has('parentId')) {
      // This element needs to switch parents in graphical interface
      let parent = Component.get(this.props.parentId)
      if (!parent) {
        parent = Component.get('table')
      }
      if (parent !== this.parent) {
        parent.addChild(this)
      }
    }

    this.componentDidUpdate(props)
  }

  private _scheduleUpdate(updatedProp: string) {
    if (!this._updateScheduled) {
      this._updateScheduled = true
      // console.log('update scheduled')
      setTimeout(() => {
        // console.log(` - componentDidUpdate, with ${this._updatedProps.size} props`)
        this._preComponentDidUpdate.call(this, this._updatedProps)
        this._updateScheduled = false
        this._updatedProps.clear()
      }, 0)
    }
    this._updatedProps.add(updatedProp)
  }

  /**
   * Overrides PIXI's property to set its `interactive` dynamically
   * depending on type of parent container (if any)
   */
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

}
