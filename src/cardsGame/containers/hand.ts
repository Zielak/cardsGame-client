/**
 * Container of cards that are visible only to the
 * player who owns them
 */
import { Component, IProps } from '../component'
import { Graphics } from 'pixi.js'

export class Hand extends Component<HandProps>{

  bg: Graphics
  label: Text

  render() {
    // return (
    //   <div className="Hand" style={this.parseStyle()}>

    //   </div>
    // )
  }

  parseStyle() {
    return {
      left: this.props.x + '%',
      top: this.props.y + '%',
      '--angle': this.props.angle + 'deg',
    }
  }

  static restyleChild = (child, idx, length) => {
    const half = length * 0.5
    const x = -half * 1.6 + idx * 1.6
    return {
      x: x,
      y: -x * (x / 14),
      angle: -half * 8 + (idx + 0.5) * 8,
      zIndex: idx + 1,
    }
  }
}

interface HandProps extends IProps {
  // localTransform: object,
  x: number,
  y: number,
  angle: number,
  zIndex: number,
}
