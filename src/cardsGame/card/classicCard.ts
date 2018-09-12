import { Graphics, Text, TextStyle } from 'pixi.js'
import { Component, IProps } from '../component'
import { cm2px } from '../utils'

export class ClassicCard extends Component<ClassicCardProps> {

  bg: Graphics
  rank: Text
  suit: Text

  constructor(props: ClassicCardProps) {
    super(props)
    this.draw()
  }

  get _componentName() {
    return 'ClassicCard'
  }

  draw() {
    this.bg = new Graphics()

    this.bg.beginFill(0xFFFFFF, 1)
    this.bg.drawRoundedRect(
      -ClassicCard.width / 2,
      -ClassicCard.height / 2,
      ClassicCard.width,
      ClassicCard.height,
      8
    )
    this.rank = new Text(
      this.getRankText(this.props.rank),
      this.getRankStyle(this.props.rank)
    )
    this.rank.x = -ClassicCard.width / 2 + 5
    this.rank.y = -ClassicCard.height / 2 + 5

    this.suit = new Text(
      this.getSuitText(this.props.suit),
      this.getSuitStyle(this.props.suit)
    )
    this.suit.x = -ClassicCard.width / 2 + 5
    this.suit.y = -ClassicCard.height / 2 + 5 + this.rank.height

    this.addChild(this.bg)
    this.addChild(this.rank)
    this.addChild(this.suit)
  }

  redraw() {
    this.rank.text = this.getRankText(this.props.rank)
    this.rank.style = this.getRankStyle(this.props.rank)

    this.suit.text = this.getSuitText(this.props.suit)
    this.suit.style = this.getSuitStyle(this.props.suit)

    this.rank.visible = this.suit.visible = this.props.state.faceUp
  }

  getRankText(rank: string): string {
    return rank
  }

  getSuitText(suit: string): string {
    switch (suit) {
      case 'D': return '♦'
      case 'C': return '♣'
      case 'H': return '♥'
      case 'S': return '♠'
    }
    return ''
  }

  getRankStyle(_) {
    return new TextStyle({
      fill: '#000000',
    })
  }

  getSuitStyle(suit) {
    switch (suit) {
      case 'D': return new TextStyle(
        { fill: ['#66ccff', '#0066ff'] }
      )
      case 'C': return new TextStyle(
        { fill: ['#66ff66', '#00ff00'] }
      )
      case 'H': return new TextStyle(
        { fill: ['#ff6666', '#ff0000'] }
      )
      case 'S': return new TextStyle(
        { fill: ['#666666', '#000000'] }
      )
    }
    return new TextStyle({ fill: '#000000' })
  }

  static width = cm2px(6.35)
  static height = cm2px(8.89)

}

interface ClassicCardProps extends IProps {
  // localTransform: object,
  x: number,
  y: number,
  angle: number,
  zIndex: number,

  name: string,
  suit: string,
  rank: string,

  state: {
    faceUp: boolean,
    rotated: number,
    marked: boolean,
  },

  interactionHandler: () => void,
}
