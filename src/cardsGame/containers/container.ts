import { IComponent, Component, IProps } from '../component'
import { trim } from '../utils'

export interface IContainer extends IComponent {
  redrawChildren: () => void
  // restyleChild?? - don't type that, it's static
}

export class CContainer<T extends IProps> extends Component<T> {

  constructor(props: T) {
    super(props)
    this.isContainer = true
    this.on('childadded', child => {
      this.log('childadded event came', trim(child.id))
      this.redrawChildren()
    })
  }

  redrawChildren() {
    this.logWarn(`redrawChildren NOT implemented on ${this.props.type}`)
  }

}
