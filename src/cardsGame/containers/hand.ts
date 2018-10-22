/**
 * Container of cards that are visible only to the
 * player who owns them
 */
import { IProps, Component } from '../component'
import { Graphics, Text } from 'pixi.js'
import { CContainer, IContainer } from './container'
import { deg2rad, trim } from '../utils';
import { ClassicCard } from '../card/classicCard';
import { log } from '../log';

const labelText = (children) => `Hand of ${children.length} cards`

export class Hand extends CContainer<HandProps> implements IContainer {

  bg: Graphics
  label: Text

  setup() {
    const PLUS_SIZE = 20
    this.bg = new Graphics()

    this.bg.beginFill(0xff0099, 0.1)
    this.bg.lineStyle(3, 0xff0099, 1)
    this.bg.drawRoundedRect(
      -ClassicCard.width / 2 - PLUS_SIZE * 2,
      -ClassicCard.height / 2 - PLUS_SIZE,
      ClassicCard.width + PLUS_SIZE * 4,
      ClassicCard.height + PLUS_SIZE * 2,
      32
    )
    this.label = new Text(labelText(this.props.children), {
      fill: ['#ffffff', '#ff66CC'],
      stroke: '#4a1850',
      strokeThickness: 4,
    })
    this.label.x = -this.label.width / 2
    this.label.y = ClassicCard.height / 2

    this.addChild(this.bg)
    this.addChild(this.label)
  }

  componentDidUpdate(props: Set<string>) {
    this.log(`componentDidUpdate "${this.props.name}" ${trim(this.props.id)}`, props)
    if (props.has('childrenIDs')) {
      this.redrawChildren()
    }
  }

  redrawChildren() {
    this.log('redrawChildren() - got this.props.children = ', this.props.children.length)
    this.props.children.forEach(Hand.restyleChild)
  }

  static restyleChild(child: Component<any>, idx: number, arr) {
    const max = arr.length
    const width = 100
    const height = 20

    const funcY = (i, a = 0, b = 0, c = 0) => (-a * (i * i)) + (i * b) + c
    const funcX = (i, a = 0, b = 1, c = 0) => a * Math.cos(2 * Math.PI * i / b + c)
    const funcR = (i, a) => i * a - i * a / 2

    const offsetIdx = idx / Math.max(1, max - 1)
    child.props.x = funcX(offsetIdx, 1, 2) * width
    child.props.y = -funcY(offsetIdx, max, max) * height
    // child.rotation = -deg2rad(funcR(idx - max / 2, 10))
    child.rotation = deg2rad(funcX(offsetIdx, 1, 2, 0) * 45)
    // zIndex: idx + 1,

    log.notice(`-- restyleChild[${idx}] of ${arr.length} `, trim('' + child.x), trim('' + child.y))
  }
}

interface HandProps extends IProps {
  // localTransform: object,
  x: number,
  y: number,
  angle: number,
  zIndex: number,
}
