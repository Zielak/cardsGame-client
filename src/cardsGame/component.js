import { Container } from 'pixi.js'
// import PropTypes from 'prop-types'
import checkPropTypes from 'prop-types/checkPropTypes'

/**
 *
 *
 * @class Component
 * @extends {Container}
 */
class Component extends Container {

  /**
   * Creates an instance of Component.
   * @param {any} props
   * @memberof Component
   */
  constructor(props = {}) {
    super()
    this._props = { ...props }
    this._updateScheduled = false
    this._generatePropsProxy()
  }

  _generatePropsProxy() {
    this._propsProxy = new Proxy(this._props, {
      set: (target, prop, value) => {
        if (target[prop] === value) {
          return true
        }
        target[prop] = value
        checkPropTypes(this.propTypes, target, 'prop', this._componentName)
        this._scheduleUpdate()
        return true
      }
    })
  }

  _scheduleUpdate() {
    if (!this._updateScheduled) {
      this._updateScheduled = true
      // console.log('update scheduled for later')
      setTimeout(() => {
        // console.log('componentDidUpdate!')
        this.componentDidUpdate.call(this, this.props)
        this._updateScheduled = false
      }, 0)
    }
  }

  get props() {
    return this._propsProxy
  }

  set props(newProps) {
    for (const prop in newProps) {
      this.props[prop] = newProps[prop]
    }
  }

  get _componentName() {
    return 'Component'
  }

  get idx() {
    return this.props.idx
  }
  get id() {
    return this.props.id
  }
  get type() {
    return this.props.type
  }

  componentDidUpdate(props) { } // eslint-disable-line no-unused-vars

}

export default Component
