import { Sprite, Text } from 'pixi.js'
import { IProps } from './component'
import { CContainer } from './containers/container'
import { ClassicCard } from './card/classicCard';

export class Player extends CContainer<PlayerProps> {

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
    this.label.x = -this.label.width / 2
    this.label.y = -ClassicCard.height / 2 - this.label.height

    this.addChild(this.icon)
    this.addChild(this.label)
  }

  componentDidUpdate(props: Set<string>) {
    if (props.has('name')) {
      this.label.text = this.props.name
    }
  }

}

interface PlayerProps extends IProps {
  name: string,
  score: number,
  angle: number,
  zIndex: number,
}
