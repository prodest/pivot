import { Class, Instance, isInstanceOf } from 'immutable-class';

export interface AppSettingsValue {
  // Server parameters
  pageMustLoadTimeout?: number;
  druidRequestDecorator?: string;
  serverConfig?: ServerConfig;

  // connection
  druidHost?: string;
  timeout?: number;
  introspectionStrategy?: string;
  sourceListScan?: SourceListScan;
  sourceListRefreshOnLoad?: boolean;
  sourceListRefreshInterval?: number;
  sourceReintrospectOnLoad?: boolean;
  sourceReintrospectInterval?: number;

  // app
  customization?: Customization;
  dataSources?: DataSource[];
  linkViewConfig?: LinkViewConfigJS; // ToDo: make this now JS
}

export interface AppSettingsJS {
  pageMustLoadTimeout?: number;
  druidRequestDecorator?: string;
  serverConfig?: ServerConfigJS;
  
  druidHost?: string;
  timeout?: number;
  introspectionStrategy?: string;
  sourceListScan?: SourceListScan;
  sourceListRefreshOnLoad?: boolean;
  sourceListRefreshInterval?: number;
  sourceReintrospectOnLoad?: boolean;
  sourceReintrospectInterval?: number;

  customization?: CustomizationJS;
  dataSources?: DataSourceJS[];
  linkViewConfig?: LinkViewConfigJS;
}

var check: Class<AppSettingsValue, AppSettingsJS>;
export class AppSettings implements Instance<AppSettingsValue, AppSettingsJS> {
  static DEFAULT_INTROSPECTION_STRATEGY = 'segment-metadata-fallback';

  static isAppSettings(candidate: any): candidate is AppSettings {
    return isInstanceOf(candidate, AppSettings);
  }

  static fromJS(parameters: AppSettingsJS): AppSettings {
    var value: AppSettingsValue = {
      pageMustLoadTimeout: parameters.pageMustLoadTimeout,
      druidRequestDecorator: parameters.druidRequestDecorator,
      serverConfig: parameters.serverConfig,

      druidHost: parameters.druidHost || (parameters as any).brokerHost,
      timeout: parameters.timeout,
      introspectionStrategy: parameters.introspectionStrategy || DEFAULT_INTROSPECTION_STRATEGY,
      sourceListScan: parameters.sourceListScan,
      sourceListRefreshOnLoad: parameters.sourceListRefreshOnLoad,
      sourceListRefreshInterval: parameters.sourceListRefreshInterval,
      sourceReintrospectOnLoad: parameters.sourceReintrospectOnLoad,
      sourceReintrospectInterval: parameters.sourceReintrospectInterval,

      customization: Customization.fromJS(parameters.customization || {}),
      dataSources: parameters.dataSources,
      linkViewConfig: parameters.linkViewConfig
    };
    return new AppSettings(value);
  }

  public verbose: boolean;

  // Server parameters
  public pageMustLoadTimeout: number;
  public druidRequestDecorator: string;
  public serverConfig: ServerConfig;

  // connection
  public druidHost: string;
  public timeout: number;
  public introspectionStrategy: string;
  public sourceListScan: SourceListScan;
  public sourceListRefreshOnLoad: boolean;
  public sourceListRefreshInterval: number;
  public sourceReintrospectOnLoad: boolean;
  public sourceReintrospectInterval: number;

  // app
  public customization: Customization;
  public dataSources: DataSource[];
  public linkViewConfig: LinkViewConfigJS; // ToDo: make this now JS

  constructor(parameters: AppSettingsValue) {
    this.verbose = parameters.verbose;

    this.pageMustLoadTimeout = parameters.pageMustLoadTimeout;
    this.auth = parameters.auth;
    this.druidRequestDecorator = parameters.druidRequestDecorator;
    this.serverConfig = parameters.serverConfig;

    this.druidHost = parameters.druidHost;
    this.timeout = parameters.timeout;
    this.introspectionStrategy = parameters.introspectionStrategy || this.DEFAULT_INTROSPECTION_STRATEGY;
    this.sourceListScan = parameters.sourceListScan;
    this.sourceListRefreshOnLoad = parameters.sourceListRefreshOnLoad;
    this.sourceListRefreshInterval = parameters.sourceListRefreshInterval;
    this.sourceReintrospectOnLoad = parameters.sourceReintrospectOnLoad;
    this.sourceReintrospectInterval = parameters.sourceReintrospectInterval;

    this.customization = parameters.customization;
    this.dataSources = parameters.dataSources;
    this.linkViewConfig = parameters.linkViewConfig;
  }

  public valueOf(): AppSettingsValue {
    return {
      verbose: this.verbose,
     
      pageMustLoadTimeout: this.pageMustLoadTimeout,
      druidRequestDecorator: this.druidRequestDecorator,
      serverConfig: this.serverConfig,

      druidHost: this.druidHost,
      timeout: this.timeout,
      introspectionStrategy: this.introspectionStrategy,
      sourceListScan: this.sourceListScan,
      sourceListRefreshOnLoad: this.sourceListRefreshOnLoad,
      sourceListRefreshInterval: this.sourceListRefreshInterval,
      sourceReintrospectOnLoad: this.sourceReintrospectOnLoad,
      sourceReintrospectInterval: this.sourceReintrospectInterval,

      customization: this.customization,
      dataSources: this.dataSources,
      linkViewConfig: this.linkViewConfig
    };
  }

  public toJS(): AppSettingsJS {
    var js: AppSettingsJS = {};
    js.verbose = this.verbose;
   
    js.pageMustLoadTimeout = this.pageMustLoadTimeout;
    js.druidRequestDecorator = this.druidRequestDecorator;
    js.serverConfig = this.serverConfig;

    js.druidHost = this.druidHost;
    js.timeout = this.timeout;
    js.introspectionStrategy = this.introspectionStrategy;
    js.sourceListScan = this.sourceListScan;
    js.sourceListRefreshOnLoad = this.sourceListRefreshOnLoad;
    js.sourceListRefreshInterval = this.sourceListRefreshInterval;
    js.sourceReintrospectOnLoad = this.sourceReintrospectOnLoad;
    js.sourceReintrospectInterval = this.sourceReintrospectInterval;

    js.customization = this.customization.toJS();
    js.dataSources = this.dataSources.map(dataSource => dataSource.toJS());
    js.linkViewConfig = this.linkViewConfig;
    return js;
  }

  public toJSON(): AppSettingsJS {
    return this.toJS();
  }

  public toString(): string {
    return '[AppSettings]';
  }

  public equals(other: AppSettings): boolean {
    return AppSettings.isAppSettings(other) &&
      this.verbose === other.verbose &&
      this.pageMustLoadTimeout === other.pageMustLoadTimeout &&
      this.druidRequestDecorator === other.druidRequestDecorator &&
      this.serverConfig === other.serverConfig &&
      this.druidHost === other.druidHost &&
      this.timeout === other.timeout &&
      this.introspectionStrategy === other.introspectionStrategy &&
      this.sourceListScan === other.sourceListScan &&
      this.sourceListRefreshOnLoad === other.sourceListRefreshOnLoad &&
      this.sourceListRefreshInterval === other.sourceListRefreshInterval &&
      this.sourceReintrospectOnLoad === other.sourceReintrospectOnLoad &&
      this.sourceReintrospectInterval === other.sourceReintrospectInterval &&
      immutableEqual(this.customization, other.customization) &&
      immutableArraysEqual(this.dataSources, other.dataSources) &&
      Boolean(this.linkViewConfig) === Boolean(other.linkViewConfig);
  }

}
check = AppSettings;
