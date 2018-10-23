import { Container } from 'pixi.js'
import { CContainer } from './containers/container'
import { log } from './log'

const components = new Map<string, Component<any>>()
let updateScheduled = false
let updaterId: NodeJS.Timeout
const updateQueue = new Set<Component<any>>()
const updateTimeout = () => {
  // Schedule only one updater
  if (updaterId) {
    log.verbose('[component] - clearing last timeout')
    clearTimeout(updaterId)
  }
  setTimeout(() => {
    log.verbose(`updateQueue contains: ${updateQueue.size} things`)
    // TODO: Should probably be sorted by level of nesting
    // TODO: Deepest objects (cards) should be updated before containers
    // TODO: So containers have a chance to run their "restyleChild" stuff
    updateQueue.forEach(comp => {
      comp._preComponentDidUpdate.call(comp, comp._updatedProps)
      comp._updatedProps.clear()
    })
    updateScheduled = false
    updateQueue.clear()
  }, 1000)
}

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
            // .filter(Component.exists)
            .map(Component.get)
          // this.log(`I got `, this._props.childrenIDs, ` childrenIDs but ${a.length} children (?)`, a)
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
      newParent.emit('childadded', this)
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
    log.error(`[${this.props.type}] `, ...args)
  }
  logWarn(...args) {
    log.warn(`[${this.props.type}] `, ...args)
  }
  logInfo(...args) {
    log.info(`[${this.props.type}] `, ...args)
  }
  log(...args) {
    log.notice(`[${this.props.type}] `, ...args)
  }
  logVerbose(...args) {
    log.verbose(`[${this.props.type}] `, ...args)
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
      this.logVerbose('   - Im gonna update my own x/y, fuck that ')
      if (props.has('x')) {
        this.x = this.props.x
      }
      if (props.has('y')) {
        this.y = this.props.y
      }
    } else {
      props.delete('x')
      props.delete('y')
    }

    this.logVerbose(`_preComponentDidUpdate ${this.props.type} with: [${Array.from(props.values()).join(', ')}]`)
    this.componentDidUpdate(props)
  }

  private _scheduleUpdate(updatedProp: string) {
    if (!updateScheduled) {
      this.logVerbose(' - scheduling update')
      updateScheduled = true
      updateTimeout()
    }
    updateQueue.add(this)
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
