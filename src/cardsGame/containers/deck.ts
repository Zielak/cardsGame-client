/**
 * Container of neatly packed cards in one column.
 */
import { Text, Graphics, DisplayObject } from 'pixi.js'
import { ClassicCard } from '../card/classicCard'
import { Component, IProps } from '../component'
import { IContainer } from './container'

const labelText = (children) => `DECK of ${children.length} cards`

export class Deck extends Component<DeckProps> implements IContainer {

  bg: Graphics
  label: Text

  constructor(props: DeckProps) {
    super(props)
    this.draw()
    // FIXME: don't setTimeout!
    setTimeout(() => this.redraw(), 100)
  }

  draw() {
    this.bg = new Graphics()

    this.bg.beginFill(0x491008, 0.1)
    this.bg.lineStyle(3, 0xff754a, 1)
    this.bg.drawRoundedRect(
      -ClassicCard.width / 2,
      -ClassicCard.height / 2,
      ClassicCard.width,
      ClassicCard.height,
      8
    )
    this.label = new Text(labelText(this.props.children), {
      fill: ['#ffffff', '#00ff99'],
      stroke: '#4a1850',
      strokeThickness: 5,
    })

    this.addChild(this.bg)
    this.addChild(this.label)
  }

  redraw() {
    this.label.text = labelText(this.props.children)
    this.children.forEach(Deck.restyleChild)
  }

  componentDidUpdate() {
    this.redraw()
  }

  static restyleChild(child: Component<any>, idx/*, length*/) {
    child.x = idx * .3
    child.y = -idx * .3
    child.rotation = 0
    // child.zIndex = idx + 5
  }

}

interface DeckProps extends IProps {
  // localTransform: object,
  x: number,
  y: number,
  angle: number,
  zIndex: number,
}
