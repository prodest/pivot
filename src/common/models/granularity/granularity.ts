import { List } from 'immutable';
import { TimeBucketAction, NumberBucketAction, ActionJS, Action, ActionValue, TimeRange, NumberRange } from 'plywood';
import { hasOwnProperty } from '../../../common/utils/general/general';
import { getTickDuration } from '../../../common/utils/time/time';

interface DefaultLookup {
  granularities: Granularity[];
  granularity: Granularity;
}

const defaults: Lookup<DefaultLookup> = {
  time: {
    granularities: ['PT1M', 'PT1H', 'P1D', 'P1W', 'P1M', 'P1Y'].map(granularityFromJS),
    granularity: granularityFromJS('P1D')
  },

  number: {
    granularities: [1, 5, 10, 50, 500, 1000, 5000, 10000].map(granularityFromJS),
    granularity: granularityFromJS(10)
  }
};

export type Granularity = TimeBucketAction | NumberBucketAction;
export type GranularityJS = string | number | ActionJS

export function granularityFromJS(input: GranularityJS): Granularity {
  if (typeof input === 'number') return NumberBucketAction.fromJS({ size: input });
  if (typeof input === 'string') return TimeBucketAction.fromJS({ duration: input });

  if (typeof input === "object") {
    if (!hasOwnProperty(input, 'action')) {
      throw new Error(`could not recognize object as action`);
    }
    return (Action.fromJS(input as GranularityJS) as Granularity);
  }
  throw new Error(`input should be of type number, string, or action`);
}

export function granularityToString(input: Granularity): string {
  if (input instanceof TimeBucketAction) {
    return input.duration.toString();
  } else if (input instanceof NumberBucketAction) {
    return input.size.toString();
  }

  throw new Error(`unrecognized granularity: must be of type TimeBucketAction or NumberBucketAction`);
}

export function granularityEquals(g1: Granularity, g2: Granularity) {
  if (!Boolean(g1) === Boolean(g2)) return false;
  if (g1 === g2 ) return true;
  return (g1 as Action).equals(g2 as Action);
}

export function granularityToJS(input: Granularity): GranularityJS {
  var js = input.toJS();

  if (js.action === 'timeBucket') {
    if (Object.keys(js).length === 2) return js.duration;
  }

  if (js.action === 'numberBucket') {
    if (Object.keys(js).length === 2) return js.size;
  }

  return js;
}

function getBucketSize(input: Granularity): number {
  if (input instanceof TimeBucketAction) return input.duration.getCanonicalLength();
  if (input instanceof NumberBucketAction) return input.size;
  throw new Error(`unrecognized granularity: must be of type TimeBucketAction or NumberBucketAction`);
}

function getStartIndex(array: Granularity[], granularityToFind: Granularity) {
  if (!granularityToFind) return 0;
  return List(array).findIndex(g => getBucketSize(g) > getBucketSize(granularityToFind));
}

function getTickNumber(numberRange: NumberRange): number {
  var len = numberRange.end.valueOf() - numberRange.start.valueOf();
  return Math.floor(len / 10);
}

export function updateBucketSize(existing: Granularity, newInput: Granularity): Granularity {
  if (newInput instanceof TimeBucketAction) {
    return new TimeBucketAction({
      duration: (newInput as TimeBucketAction).duration,
      timezone: (existing as TimeBucketAction).timezone
    });
  } else if (newInput instanceof NumberBucketAction) {
    var value: ActionValue = { size: (newInput as NumberBucketAction).size };
    if ((existing as NumberBucketAction).offset) value.offset = (existing as NumberBucketAction).offset;
    return new NumberBucketAction(value);
  }
  throw new Error(`unrecognized granularity: must be of type TimeBucket or NumberBucket`);
}

export function getDefaultGranularityForKind(kind: string, bucketedBy?: Granularity) {
  if (bucketedBy) return bucketedBy;
  return defaults[kind]['granularity'];
}

export function getGranularities(kind: string, bucketedBy?: Granularity) {
  var start = 0;
  var numberToShow = 5;
  var granArray = defaults[kind]['granularities'];

  if (bucketedBy) {
    start = getStartIndex(granArray, bucketedBy);
    granArray = start === -1 ? [] : granArray.slice(start, start + numberToShow - 1);
    granArray = [bucketedBy].concat(granArray);
    return granArray;
  } else {
    var end = start + numberToShow < granArray.length ? start + numberToShow : granArray.length;
    return granArray.slice(start, end);
  }

}

export function getTickSizeForRange(inputRange: TimeRange | NumberRange): string | number {
  if (inputRange instanceof TimeRange) {
    return getTickDuration(inputRange as TimeRange).toJS();
  } else if (inputRange instanceof NumberRange) {
    return getTickNumber(inputRange as NumberRange);
  }
  throw new Error(`unrecognized range: must be of type TimeRange or NumberRange`);

}
