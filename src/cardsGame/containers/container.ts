import { IComponent } from '../component'

export interface IContainer extends IComponent {
  draw: () => void
  redraw: () => void
  // restyleChild??
}
