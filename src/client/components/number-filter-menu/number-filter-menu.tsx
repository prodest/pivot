require('./number-filter-menu.css');

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Set, NumberRange, LiteralExpression } from 'plywood';

import { FilterClause, Clicker, Essence, Filter, Dimension } from '../../../common/models/index';
import { Fn } from '../../../common/utils/general/general';
import { STRINGS } from '../../config/constants';
import { enterKey } from '../../utils/dom/dom';

import { Button } from '../button/button';
import { NumberRangePicker } from '../number-range-picker/number-range-picker';

export const STEP_SIZE = 5;
export const DEFAULT_NUMBER_RANGE = NumberRange.fromJS({start: 0, end: 100});

export interface NumberFilterMenuProps extends React.Props<any> {
  clicker: Clicker;
  essence: Essence;
  dimension: Dimension;
  onClose: Fn;
}

export interface NumberFilterMenuState {
  leftOffset?: number;
  rightBound?: number;
  start?: number;
  startInput?: string;
  end?: number;
  endInput?: string;
}

export class NumberFilterMenu extends React.Component<NumberFilterMenuProps, NumberFilterMenuState> {
  public mounted: boolean;

  constructor() {
    super();
    this.state = {
      leftOffset: null,
      rightBound: null,
      start: null,
      startInput: null,
      end: null,
      endInput: null
    };

    this.globalKeyDownListener = this.globalKeyDownListener.bind(this);
  }

  constructFilter(): Filter {
    var { essence, dimension } = this.props;
    var { start, end } = this.state;
    var { filter } = essence;
    if (start !== null && end !== null && start < end) {
      var newSet = Set.fromJS({ setType: "NUMBER_RANGE", elements: [NumberRange.fromJS({ start, end })] });
      var clause = new FilterClause({
        expression: dimension.expression,
        selection: new LiteralExpression({ type: "SET/NUMBER_RANGE", value: newSet })
      });
      return filter.setClause(clause);
    } else {
      return null;
    }
  }

  componentWillMount() {
    var { essence, dimension } = this.props;
    var { filter } = essence;
    var valueSet = filter.getLiteralSet(dimension.expression);
    // todo: this is a range picker for a set of ranges.. what range are we picking? here just assuming first
    var range = valueSet ? valueSet.elements[0] : DEFAULT_NUMBER_RANGE;
    this.setState({
      start: range.start,
      startInput: String(range.start),
      end: range.end,
      endInput: String(range.end)
    });
  }

  componentDidMount() {
    this.mounted = true;
    var node = ReactDOM.findDOMNode(this.refs['number-filter-menu']);
    var rect =  node.getBoundingClientRect();
    this.setState({ leftOffset: rect.left, rightBound: rect.width });
    window.addEventListener('keydown', this.globalKeyDownListener);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.globalKeyDownListener);
  }

  globalKeyDownListener(e: KeyboardEvent) {
    if (enterKey(e)) {
      this.onOkClick();
    }
  }

  onOkClick() {
    if (!this.actionEnabled()) return;
    var { clicker, onClose } = this.props;
    clicker.changeFilter(this.constructFilter());
    onClose();
  }

  onCancelClick() {
    var { onClose } = this.props;
    onClose();
  }

  onRangeInputChangeStart(e: KeyboardEvent) {
    const { end } = this.state;
    var startInput = (e.target as HTMLInputElement).value;
    this.setState({ startInput, start: null });
    var start = parseFloat(startInput);

    if (!isNaN(start) && start < end) {
      this.onRangeStartChange(start);
    }
  }

  onRangeInputEndStart(e: KeyboardEvent) {
    const { start, rightBound } = this.state;
    var endInput = (e.target as HTMLInputElement).value;
    this.setState({ endInput, end: null });
    var end = parseFloat(endInput);

    if (!isNaN(end) && end > start && end < rightBound * STEP_SIZE) {
      this.onRangeEndChange(end);
    }
  }

  onRangeStartChange(newStart: number) {
    this.setState({ startInput: String(newStart), start: newStart });
  }

  onRangeEndChange(newEnd: number) {
    this.setState({ endInput: String(newEnd), end: newEnd });
  }

  actionEnabled() {
    var { essence } = this.props;
    return !essence.filter.equals(this.constructFilter()) && Boolean(this.constructFilter());
  }

  render() {
    const { rightBound, start, startInput, end, endInput, leftOffset } = this.state;
    return <div className="number-filter-menu" ref="number-filter-menu">
      <div className="side-by-side">
        <div className="group">
          <label className="input-top-label">Min</label>
          <input value={startInput} onChange={this.onRangeInputChangeStart.bind(this)} />
        </div>
        <div className="group">
          <label className="input-top-label">Max</label>
          <input value={endInput} onChange={this.onRangeInputEndStart.bind(this)} />
        </div>
      </div>
      <NumberRangePicker
        onRangeEndChange={this.onRangeEndChange.bind(this)}
        onRangeStartChange={this.onRangeStartChange.bind(this)}
        offSet={leftOffset}
        stepSize={STEP_SIZE}
        rightBound={rightBound}
        start={start}
        end={end}
      />
      <div className="button-bar">
        <Button type="primary" title={STRINGS.ok} onClick={this.onOkClick.bind(this)} disabled={!this.actionEnabled()} />
        <Button type="secondary" title={STRINGS.cancel} onClick={this.onCancelClick.bind(this)} />
      </div>
    </div>;
  }
}
