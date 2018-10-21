/**
 * Container of cards laid down on a table,
 * side by side in one row. Space is limited so
 * cards will overlap eachother eventually
 */
import { Text, Graphics } from 'pixi.js'
import { ClassicCard } from '../card/classicCard'
import { Component, IProps } from '../component'
import { IContainer, CContainer } from './container'
import { log } from '../log';

const labelText = (children) => `Row of ${children.length} cards`

export class Row extends CContainer<RowProps> implements IContainer {

  bg: Graphics
  label: Text

  setup() {
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
    this.label.x = -this.label.width / 2
    this.label.y = ClassicCard.height / 2

    this.addChild(this.bg)
    this.addChild(this.label)
  }

  componentDidUpdate(props: Set<string>) {
    this.logVerbose(`componentDidUpdate ${this.props.type}`)
    if (props.has('childrenIDs')) {
      this.label.text = labelText(this.props.children)
      this.redrawChildren()
    }
  }

  redrawChildren() {
    this.props.children.forEach(Row.restyleChild)
  }

  static restyleChild(child: Component<any>, idx, array) {
    // TODO: maybe animate it
    const width = 100 // TODO: get it from instance...
    const i = width / array.length

    child.props.x = -width / 2 + i * idx
    child.props.y = 0
  }

}

interface RowProps extends IProps {
  // localTransform: object,
  x: number,
  y: number,
  width: number,
  angle: number,
  zIndex: number,
}
