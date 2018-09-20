/**
 * Container of cards that are visible only to the
 * player who owns them
 */
import { IProps, Component } from '../component'
import { Graphics } from 'pixi.js'
import { Container, IContainer } from './container'
import { deg2rad } from '../utils';

export class Hand extends Container<HandProps> implements IContainer {

  bg: Graphics
  label: Text

  componentDidUpdate(props: Set<string>) {
    if (props.has('childrenIDs')) {
      this.redrawChildren()
    }
  }

  redrawChildren() {
    this.props.children.forEach(Hand.restyleChild)
  }

  static restyleChild(child: Component<any>, idx: number, arr) {
    const max = arr.length
    const width = 100
    const height = 20

    const funcY = (i, a = 0, b = 0, c = 0) => (-a * (i * i)) + (i * b) + c
    const funcX = (i, a = 0, b = 1, c = 0) => a * Math.cos(2 * Math.PI * i / b + c)
    const funcR = (i, a) => i * a - i * a / 2

    const offsetIdx = idx / (max - 1)
    child.x = funcX(offsetIdx, 1, 2) * width
    child.y = -funcY(offsetIdx, max, max) * height
    // child.rotation = -deg2rad(funcR(idx - max / 2, 10))
    child.rotation = deg2rad(funcX(offsetIdx, 1, 2, 0) * 45)
    // zIndex: idx + 1,
  }
}

interface HandProps extends IProps {
  // localTransform: object,
  x: number,
  y: number,
  angle: number,
  zIndex: number,
}
