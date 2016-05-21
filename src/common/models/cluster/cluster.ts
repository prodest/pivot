import { Class, Instance, isInstanceOf } from 'immutable-class';

export type SourceListScan = "disable" | "auto";

export interface RequestDecoratorFactoryOptions {
  config: any;
}

export interface DruidRequestDecoratorModule {
  druidRequestDecorator: (log: (line: string) => void, options: RequestDecoratorFactoryOptions) => DruidRequestDecorator;
}

export interface ClusterValue {
  host?: string;
  timeout?: number;
  introspectionStrategy?: string;
  sourceListScan?: SourceListScan;
  sourceListRefreshOnLoad?: boolean;
  sourceListRefreshInterval?: number;
  sourceReintrospectOnLoad?: boolean;
  sourceReintrospectInterval?: number;
  druidRequestDecorator?: string;

  druidRequestDecoratorModule?: DruidRequestDecoratorModule;
}

export interface ClusterJS {
  host?: string;
  timeout?: number;
  introspectionStrategy?: string;
  sourceListScan?: SourceListScan;
  sourceListRefreshOnLoad?: boolean;
  sourceListRefreshInterval?: number;
  sourceReintrospectOnLoad?: boolean;
  sourceReintrospectInterval?: number;
  druidRequestDecorator?: string;
}

var check: Class<ClusterValue, ClusterJS>;
export class Cluster implements Instance<ClusterValue, ClusterJS> {
  static DEFAULT_TIMEOUT = 40000;
  static DEFAULT_INTROSPECTION_STRATEGY = 'segment-metadata-fallback';

  static isCluster(candidate: any): candidate is Cluster {
    return isInstanceOf(candidate, Cluster);
  }

  static fromJS(parameters: ClusterJS): Cluster {
    var {
      host,
      timeout,
      introspectionStrategy,
      sourceListScan,
      sourceListRefreshOnLoad,
      sourceListRefreshInterval,
      sourceReintrospectOnLoad,
      sourceReintrospectInterval,
      druidRequestDecorator
    } = parameters;

    // host might be written as druidHost or brokerHost
    host = host || (parameters as any).druidHost || (parameters as any).brokerHost;

    var value: ClusterValue = {
      host,
      timeout: typeof timeout === 'string' ? parseInt(timeout as any, 10) : timeout,
      introspectionStrategy: introspectionStrategy,
      sourceListScan: sourceListScan,
      sourceListRefreshOnLoad: sourceListRefreshOnLoad,
      sourceListRefreshInterval: sourceListRefreshInterval,
      sourceReintrospectOnLoad: sourceReintrospectOnLoad,
      sourceReintrospectInterval: sourceReintrospectInterval,
      druidRequestDecorator
    };
    return new Cluster(value);
  }


  public host: string;
  public timeout: number;
  public introspectionStrategy: string;
  public sourceListScan: SourceListScan;
  public sourceListRefreshOnLoad: boolean;
  public sourceListRefreshInterval: number;
  public sourceReintrospectOnLoad: boolean;
  public sourceReintrospectInterval: number;
  public druidRequestDecorator: string;

  public druidRequestDecoratorModule: string;

  constructor(parameters: ClusterValue) {
    var host = parameters.host;
    if (typeof host !== 'string') throw new Error('must have host');
    this.host = host;

    this.timeout = parameters.timeout || Cluster.DEFAULT_TIMEOUT;
    this.introspectionStrategy = parameters.introspectionStrategy || Cluster.DEFAULT_INTROSPECTION_STRATEGY;
    this.sourceListScan = parameters.sourceListScan;
    this.sourceListRefreshOnLoad = parameters.sourceListRefreshOnLoad;
    this.sourceListRefreshInterval = parameters.sourceListRefreshInterval;
    this.sourceReintrospectOnLoad = parameters.sourceReintrospectOnLoad;
    this.sourceReintrospectInterval = parameters.sourceReintrospectInterval;
    this.druidRequestDecorator = parameters.druidRequestDecorator;

    this.druidRequestDecoratorModule = parameters.druidRequestDecoratorModule;
  }

  public valueOf(): ClusterValue {
    return {
      host: this.host,
      timeout: this.timeout,
      introspectionStrategy: this.introspectionStrategy,
      sourceListScan: this.sourceListScan,
      sourceListRefreshOnLoad: this.sourceListRefreshOnLoad,
      sourceListRefreshInterval: this.sourceListRefreshInterval,
      sourceReintrospectOnLoad: this.sourceReintrospectOnLoad,
      sourceReintrospectInterval: this.sourceReintrospectInterval,
      druidRequestDecorator: this.druidRequestDecorator,
      druidRequestDecoratorModule: this.druidRequestDecoratorModule
    };
  }

  public toJS(): ClusterJS {
    var js: ClusterJS = {};
    js.host = this.host;
    js.timeout = this.timeout;
    js.introspectionStrategy = this.introspectionStrategy;
    js.sourceListScan = this.sourceListScan;
    js.sourceListRefreshOnLoad = this.sourceListRefreshOnLoad;
    js.sourceListRefreshInterval = this.sourceListRefreshInterval;
    js.sourceReintrospectOnLoad = this.sourceReintrospectOnLoad;
    js.sourceReintrospectInterval = this.sourceReintrospectInterval;
    js.druidRequestDecorator = this.druidRequestDecorator;
    return js;
  }

  public toJSON(): ClusterJS {
    return this.toJS();
  }

  public toString(): string {
    return `[Cluster ${this.host}]`;
  }

  public equals(other: Cluster): boolean {
    return Cluster.isCluster(other) &&
      this.host === other.host &&
      this.introspectionStrategy === other.introspectionStrategy &&
      this.sourceListScan === other.sourceListScan &&
      this.sourceListRefreshOnLoad === other.sourceListRefreshOnLoad &&
      this.sourceListRefreshInterval === other.sourceListRefreshInterval &&
      this.sourceReintrospectOnLoad === other.sourceReintrospectOnLoad &&
      this.sourceReintrospectInterval === other.sourceReintrospectInterval &&
      this.druidRequestDecorator === other.druidRequestDecorator;
  }

  getRequester(verbose = false): Requester.PlywoodRequester<any> {

  }

}
check = Cluster;
