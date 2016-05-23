require('./number-range-picker.css');

import * as React from 'react';
import { RangeHandle } from '../range-handle/range-handle';
import { clamp, getXFromEvent } from '../../utils/dom/dom';

export const NUB_SIZE = 16;

export function getAdjustedEnd(end: number) {
  return end - NUB_SIZE;
}

export function getAdjustedStart(start: number) {
  return start + NUB_SIZE;
}

export interface NumberRangePickerProps extends React.Props<any> {
  start?: number;
  end?: number;
  rightBound?: number;
  offSet?: number;
  onRangeStartChange?: (n: number) => void;
  onRangeEndChange?: (rangeEnd: number) => void;
  stepSize?: number;
}

export interface NumberRangePickerState {
}

export class NumberRangePicker extends React.Component<NumberRangePickerProps, NumberRangePickerState> {
  public mounted: boolean;

  constructor() {
    super();
  }

  relativePositionToValue(position: number) {
    const { stepSize } = this.props;
    return position * stepSize;
  }

  absolutePositionToValue(position: number) {
    const { offSet } = this.props;
    return this.relativePositionToValue(position - offSet);
  }

  valueToRelativePosition(value: number) {
    const { stepSize } = this.props;
    return value / stepSize;
  }

  onLeftBarClick(e: MouseEvent) {
    var newStart = getXFromEvent(e);
    this.updateStart(newStart);
  }

  updateStart(newPosition: number) {
    const { onRangeStartChange, end } = this.props;
    var relativeX = this.absolutePositionToValue(newPosition);
    var newX = clamp(relativeX, 0, getAdjustedEnd(end));
    onRangeStartChange(newX);
  }

  onRightBarClick(e: MouseEvent) {
    var newEnd = getXFromEvent(e);
    this.updateEnd(newEnd);
  }

  updateEnd(newPosition: number) {
    const { onRangeEndChange, start, rightBound } = this.props;
    var relativeX = this.absolutePositionToValue(newPosition);
    var newX = clamp(relativeX, getAdjustedStart(start), this.relativePositionToValue(getAdjustedEnd(rightBound)));
    onRangeEndChange(newX);
  }

  render() {
    const { start, end, rightBound } = this.props;
    if (!rightBound) return null;
    var startPosLeft = this.valueToRelativePosition(start);
    var endPosLeft = getAdjustedEnd(this.valueToRelativePosition(end));

    var rangeBarLeft = { left: 0, width: startPosLeft };
    var rangeBarMiddle = { left: startPosLeft, width: this.valueToRelativePosition(end - start) };
    var rangeBarRight = { left: this.valueToRelativePosition(end), width: rightBound - this.valueToRelativePosition(end) };

    return <div className="number-range-picker">
      <div className="range-bar left" style={rangeBarLeft} onClick={this.onLeftBarClick.bind(this)} />
      <RangeHandle
        positionLeft={startPosLeft}
        onChange={this.updateStart.bind(this)}
      />
      <div className="range-bar middle" style={rangeBarMiddle} />
      <RangeHandle
        positionLeft={endPosLeft}
        onChange={this.updateEnd.bind(this)}
      />
      <div className="range-bar right" style={rangeBarRight} onClick={this.onRightBarClick.bind(this)} />
    </div>;
  }
}
