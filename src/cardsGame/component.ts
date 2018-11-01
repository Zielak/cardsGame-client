import { Container } from 'pixi.js'
import { CContainer } from './containers/container'
import { log, LogLevels } from './log'
import { clone, procColorFromString } from './utils'

const components = new Map<string, Component<any>>()

const updateQueue = new Set<Component<any>>()

export interface IProps {
  id: string,
  order?: number,
  childrenIDs?: { [key: string]: string },
  children?: Component<any>[],
  parentId?: string,
  name?: string,
  type?: string,
  x?: number,
  y?: number
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
        // Check if the value is the same
        if (target[prop] === value) {
          return true
        }
        // Set it
        target[prop] = value

        this._scheduleUpdate(prop)
        return true
      },

      get: (target: T, prop) => {
        if (typeof prop === 'symbol') return
        if (prop === 'children') {
          const a = Object.keys(target.childrenIDs)
            .filter(Component.exists)
            .map(Component.get)
          this.log(`I got `, this._props.childrenIDs, ` childrenIDs but ${a.length} children (?)`, a)
          return a
        }
        return target[prop]
      }

    })

    // NOPE: Pass all props to our proxy, so it has a chance to schedule updates
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
    this.on('added', (newParent: CContainer<any>) => {
      if (!newParent.props) return
      this.logVerbose('emit childadded on', newParent.props.type, this)
      newParent.emit('childadded')
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
  componentDidUpdate(props: Set<string>) {
    this.logWarn(`componentDidUpdate NOT implemented: ${this.props.type}`)
  }

  logError(...args) {
    log.error(`%c[${this.props.type}]`, this._colorMod(this.props.type, LogLevels.error), ...args)
  }
  logWarn(...args) {
    log.warn(`%c[${this.props.type}]`, this._colorMod(this.props.type, LogLevels.warn), ...args)
  }
  logInfo(...args) {
    log.info(`%c[${this.props.type}]`, this._colorMod(this.props.type, LogLevels.info), ...args)
  }
  log(...args) {
    log.notice(`%c[${this.props.type}]`, this._colorMod(this.props.type, LogLevels.notice), ...args)
  }
  logVerbose(...args) {
    log.verbose(`%c[${this.props.type}]`, this._colorMod(this.props.type, LogLevels.verbose), ...args)
  }

  private _colorMod(str: string, type: LogLevels = LogLevels.notice) {
    const background = procColorFromString(str, {
      minS: 50
    })
    const foreground = background.luminosity() > 0.5 ? 'black' : 'white'
    const foregroundNegative = background.luminosity() > 0.5 ? 'white' : 'black'
    let leftBorder
    switch (type) {
      case LogLevels.error: leftBorder = 'border-left: 10px solid red'; break
      case LogLevels.warn: leftBorder = 'border-left: 8px solid yellow'; break
      case LogLevels.info: leftBorder = 'border-left: 2px solid blue'; break
      default: leftBorder = ''
    }
    return `background: ${background}; color: ${foreground};
      border: 2px solid ${background}; text-shadow: 1px 1px 1px ${foregroundNegative};
      ${leftBorder}`
  }

  /**
   *
   * @param props
   */
  _preComponentDidUpdate(props: Set<string>) {
    const parentComponent = this.parent as Component<any>

    // Parent got updated
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

    // X and Y positions
    if (!parentComponent || parentComponent && !parentComponent.isContainer) {
      if (props.has('x')) {
        this.x = this.props.x
      }
      if (props.has('y')) {
        this.y = this.props.y
      }
    }


    this.logVerbose(`_preComponentDidUpdate ${this.props.type} with: [${Array.from(props.values()).join(', ')}]`)
    this.componentDidUpdate(props)
  }

  private _scheduleUpdate(updatedProp: string) {
    if (!this._updateScheduled) {
      this._updateScheduled = true
      this.logVerbose('update scheduled')
      updateQueue.add(this)
      setTimeout(() => {
        this._preComponentDidUpdate.call(this, this._updatedProps)
        this._updateScheduled = false
        this._updatedProps.clear()
        updateQueue.clear()
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
