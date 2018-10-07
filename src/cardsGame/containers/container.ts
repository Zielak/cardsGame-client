import { IComponent, Component, IProps } from '../component'

export interface IContainer extends IComponent {
  redrawChildren: () => void
  // restyleChild?? - don't type that, it's static
}

export class CContainer<T extends IProps> extends Component<T> {

  constructor(props: T) {
    super(props)
    this.isContainer = true
    this.on('childadded', () => {
      this.redrawChildren()
    })
  }

  redrawChildren() {
    this.logWarn(`redrawChildren NOT implemented on ${this.props.type}`)
  }

}
