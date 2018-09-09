import { Sprite, Text } from 'pixi.js'
import { Component, IProps } from './component'

export class Player extends Component<PlayerProps> {

  icon: Sprite
  label: Text

  constructor(props: PlayerProps) {
    super(props)
    this.icon = new Sprite()
    this.label = new Text(this.props.name, {
      align: 'center',
      fill: ['#ffffff', '#00ff99'],
      stroke: '#4a1850',
      strokeThickness: 5
    })

    this.addChild(this.icon)
    this.addChild(this.label)
  }

  componentDidUpdate(props) {
    this.label.text = props.name
  }

}

interface PlayerProps extends IProps {
  name: string,
  x: number,
  y: number,
  angle: number,
  zIndex: number,
}

export default Player
