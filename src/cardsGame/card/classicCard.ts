import { Graphics, Text, TextStyle } from 'pixi.js'
import { Component, IProps, IComponent } from '../component'
import { cm2px } from '../utils'

export class ClassicCard extends Component<ClassicCardProps> implements IComponent {

  paper: Graphics
  back: Graphics
  rank: Text
  suit: Text

  get _componentName() {
    return 'ClassicCard'
  }

  setup() {
    this.paper = new Graphics()
      .beginFill(0xFFFFFF, 1)
      .lineStyle(1, 0xb7b7b7)
      .drawRoundedRect(
        -ClassicCard.width / 2,
        -ClassicCard.height / 2,
        ClassicCard.width,
        ClassicCard.height,
        8
      )

    // Back side graphics padding from paper's edge
    const BACK_PAD = 14
    const BACK_COLOR = 0xb0342f

    this.back = new Graphics()
      .beginFill(BACK_COLOR, 1)
      .drawRect(
        -ClassicCard.width / 2 + BACK_PAD,
        -ClassicCard.height / 2 + BACK_PAD,
        ClassicCard.width - BACK_PAD * 2,
        ClassicCard.height - BACK_PAD * 2
      )
      .endFill()
      .lineStyle(1, BACK_COLOR)
      .drawRect(
        -ClassicCard.width / 2 + BACK_PAD - 2,
        -ClassicCard.height / 2 + BACK_PAD - 2,
        ClassicCard.width - BACK_PAD * 2 + 4,
        ClassicCard.height - BACK_PAD * 2 + 4,
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

    this.addChild(this.paper)
    this.addChild(this.rank)
    this.addChild(this.suit)
    this.addChild(this.back)
  }

  componentDidUpdate(props: Set<string>) {
    if (props.has('rank')) {
      this.rank.text = this.getRankText(this.props.rank)
      this.rank.style = this.getRankStyle(this.props.rank)
    }

    if (props.has('suit')) {
      this.suit.text = this.getSuitText(this.props.suit)
      this.suit.style = this.getSuitStyle(this.props.suit)
    }

    if (props.has('faceUp')) {
      this.rank.visible = this.suit.visible = this.props.faceUp
      this.back.visible = !this.props.faceUp
    }
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

  faceUp: boolean,
  rotated: number,
  marked: boolean,
}
