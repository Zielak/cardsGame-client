/**
 * Container of cards that are visible only to the
 * player who owns them
 */
import PropTypes from 'prop-types'
import Component from '../../component'

class Hand extends Component {

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
}

Hand.restyleChild = (child, idx, length) => {
  const half = length * 0.5
  const x = -half * 1.6 + idx * 1.6
  return {
    x: x,
    y: -x * (x/14),
    angle: -half * 8 + (idx + 0.5) * 8,
    zIndex: idx + 1,
  }
}

Hand.propTypes = {
  id: PropTypes.string,
  children: PropTypes.array,

  localTransform: PropTypes.object,
  x: PropTypes.number,
  y: PropTypes.number,
  angle: PropTypes.number,
  zIndex: PropTypes.number,
}

export default Hand
