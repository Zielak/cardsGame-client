import { IComponent, Component, IProps } from '../component'

export interface IContainer extends IComponent {
  draw: () => void
  redraw: () => void
  // restyleChild?? - don't type that, it's static
}

export class Container<T extends IProps> extends Component<T> {

  constructor(props: T) {
    super(props)
    this.isContainer = true
  }

}
