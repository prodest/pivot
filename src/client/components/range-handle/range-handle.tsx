require('./range-handle.css');

import * as React from 'react';
import { getXFromEvent } from '../../utils/dom/dom';

export interface RangeHandleProps extends React.Props<any> {
  positionLeft: number;
  onChange: Function;
}

export interface RangeHandleState {
}

export class RangeHandle extends React.Component<RangeHandleProps, RangeHandleState> {
  public mounted: boolean;

  constructor() {
    super();

    this.onGlobalMouseUp = this.onGlobalMouseUp.bind(this);
    this.onGlobalMouseMove = this.onGlobalMouseMove.bind(this);
  }

  onGlobalMouseMove(event: MouseEvent) {
    const { onChange } = this.props;
    let newX = getXFromEvent(event);
    onChange(newX);
  }

  onMouseDown(event: MouseEvent) {
    window.addEventListener('mouseup', this.onGlobalMouseUp);
    window.addEventListener('mousemove', this.onGlobalMouseMove);
    event.preventDefault();
  }

  onGlobalMouseUp(event: MouseEvent) {
    const { onChange } = this.props;
    onChange(getXFromEvent(event));
    window.removeEventListener('mouseup', this.onGlobalMouseUp);
    window.removeEventListener('mousemove', this.onGlobalMouseMove);
  }

  render() {
    const { positionLeft } = this.props;
    var style = { left: positionLeft };
    return <div
      className="range-handle"
      style={style}
      onMouseDown={this.onMouseDown.bind(this)}
    />;
  }
}
