import { Class, Instance, isInstanceOf, immutableArraysEqual, immutableEqual } from 'immutable-class';
import { Cluster, ClusterJS } from '../cluster/cluster';
import { Customization, CustomizationJS } from '../customization/customization';
import { DataSource, DataSourceJS } from  '../data-source/data-source';
import { LinkViewConfig, LinkViewConfigJS } from '../link-view-config/link-view-config';

export interface AppSettingsValue {
  clusters?: Cluster[];
  customization?: Customization;
  dataSources?: DataSource[];
  linkViewConfig?: LinkViewConfig;
}

export interface AppSettingsJS {
  clusters?: ClusterJS[];
  customization?: CustomizationJS;
  dataSources?: DataSourceJS[];
  linkViewConfig?: LinkViewConfigJS;
}

var check: Class<AppSettingsValue, AppSettingsJS>;
export class AppSettings implements Instance<AppSettingsValue, AppSettingsJS> {
  static isAppSettings(candidate: any): candidate is AppSettings {
    return isInstanceOf(candidate, AppSettings);
  }

  static fromJS(parameters: AppSettingsJS): AppSettings {
    var value: AppSettingsValue = {
      clusters: (parameters.clusters || [parameters as any]).map(cluster => Cluster.fromJS(cluster)),
      customization: Customization.fromJS(parameters.customization || {}),
      dataSources: (parameters.dataSources || []).map(dataSource => DataSource.fromJS(dataSource)),
      linkViewConfig: parameters.linkViewConfig ? LinkViewConfig.fromJS(parameters.linkViewConfig) : null
    };
    return new AppSettings(value);
  }

  public clusters: Cluster[];
  public customization: Customization;
  public dataSources: DataSource[];
  public linkViewConfig: LinkViewConfig;

  constructor(parameters: AppSettingsValue) {
    this.clusters = parameters.clusters;
    this.customization = parameters.customization;
    this.dataSources = parameters.dataSources;
    this.linkViewConfig = parameters.linkViewConfig;
  }

  public valueOf(): AppSettingsValue {
    return {
      clusters: this.clusters,
      customization: this.customization,
      dataSources: this.dataSources,
      linkViewConfig: this.linkViewConfig
    };
  }

  public toJS(): AppSettingsJS {
    var js: AppSettingsJS = {};
    js.clusters = this.clusters.map(cluster => cluster.toJS());
    js.customization = this.customization.toJS();
    js.dataSources = this.dataSources.map(dataSource => dataSource.toJS());
    if (this.linkViewConfig) js.linkViewConfig = this.linkViewConfig.toJS();
    return js;
  }

  public toJSON(): AppSettingsJS {
    return this.toJS();
  }

  public toString(): string {
    return `[AppSettings dataSources=${this.dataSources.length}]`;
  }

  public equals(other: AppSettings): boolean {
    return AppSettings.isAppSettings(other) &&
      immutableArraysEqual(this.clusters, other.clusters) &&
      immutableEqual(this.customization, other.customization) &&
      immutableArraysEqual(this.dataSources, other.dataSources) &&
      Boolean(this.linkViewConfig) === Boolean(other.linkViewConfig);
  }

}
check = AppSettings;
