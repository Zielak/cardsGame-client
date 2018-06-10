import { Sprite, Text } from 'pixi.js'
import PropTypes from 'prop-types'
import { Component } from '../index'

class Player extends Component {

  constructor(props) {
    super(props)
    this.icon = new Sprite()
    this.label = new Text(this.props.name, {
      align: 'center',
      fill: ['#ffffff', '#00ff99'],
      stroke: '#4a1850',
      strokeThickness: 5,
    })

    this.addChild(this.icon)
    this.addChild(this.label)
  }

  componentDidUpdate(props) {
    this.label.text = props.name
  }

}

Player.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  children: PropTypes.array,

  x: PropTypes.number,
  y: PropTypes.number,
  angle: PropTypes.number,
  zIndex: PropTypes.number,
}

export default Player
