/**
 * Container of neatly packed cards in one column.
 */
import { Text, Graphics } from 'pixi.js'
import { ClassicCard } from '../card/classicCard'
import { Component, IProps } from '../component'
import { IContainer, CContainer } from './container'
import { keysList, trim, cm2px, limit } from '../utils'
import { log } from '../log';

const labelText = (children) => `DECK of ${children.length} cards`

export class Deck extends CContainer<DeckProps> implements IContainer {

  bg: Graphics
  label: Text

  setup() {
    const PLUS_SIZE = 10
    this.bg = new Graphics()

    this.bg.beginFill(0x491008, 0.1)
    this.bg.lineStyle(3, 0xff754a, 1)
    this.bg.drawRoundedRect(
      -ClassicCard.width / 2 - PLUS_SIZE,
      -ClassicCard.height / 2 - PLUS_SIZE,
      ClassicCard.width + PLUS_SIZE * 2,
      ClassicCard.height + PLUS_SIZE * 2,
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
    this.log(`componentDidUpdate ${this.props.type}, children: [${keysList(this.props.childrenIDs).map(el => trim(el))}]`)
    if (props.has('childrenIDs')) {
      this.label.text = labelText(this.props.children)
      this.redrawChildren()
    }
  }

  redrawChildren() {
    // this.log('-------redrawChildren--------, top: ')
    this.props.children.forEach(Deck.restyleChild)
  }

  static restyleChild(child: Component<any>, idx, children) {
    // log.notice(`[me:${trim(child.props.parentId)}]card.order = ${child.props.order}, its index: ${idx}`)
    // TODO: maybe animate it
    const MAX_HEIGHT = cm2px(3)
    const MIN_SPACE = cm2px(0.25)
    const SPACE = limit(MAX_HEIGHT / children.length, 0, MIN_SPACE)
    const OFFSET_ALL = SPACE * children.length
    child.props.x = OFFSET_ALL - idx * SPACE
    child.props.y = -OFFSET_ALL + idx * SPACE
    child.rotation = 0
  }

}

interface DeckProps extends IProps {
  // localTransform: object,
  x: number,
  y: number,
  angle: number,
  zIndex: number,
}
