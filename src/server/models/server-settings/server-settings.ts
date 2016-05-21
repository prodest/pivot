import { Class, Instance, isInstanceOf } from 'immutable-class';

export type Iframe = "allow" | "deny";

export interface ServerSettingsValue {
  port?: number;
  serverRoot?: string;
  pageMustLoadTimeout?: number;
  druidRequestDecorator?: string;
  iframe?: Iframe;
}

export interface ServerSettingsJS {
  port?: number;
  serverRoot?: string;
  pageMustLoadTimeout?: number;
  druidRequestDecorator?: string;
  iframe?: Iframe;
}

var check: Class<ServerSettingsValue, ServerSettingsJS>;
export class ServerSettings implements Instance<ServerSettingsValue, ServerSettingsJS> {
  static DEFAULT_PORT = 9090;
  static DEFAULT_SERVER_ROOT = '/pivot';
  static DEFAULT_IFRAME: Iframe = "allow";

  static isServerSettings(candidate: any): candidate is ServerSettings {
    return isInstanceOf(candidate, ServerSettings);
  }

  static fromJS(parameters: ServerSettingsJS): ServerSettings {
    var { port } = parameters;
    var value: ServerSettingsValue = {
      port: typeof port === 'string' ? parseInt(port as any, 10) : port,
      serverRoot: parameters.serverRoot,
      pageMustLoadTimeout: parameters.pageMustLoadTimeout,
      druidRequestDecorator: parameters.druidRequestDecorator,
      iframe: parameters.iframe
    };
    return new ServerSettings(value);
  }

  public port: number;
  public serverRoot: string;
  public pageMustLoadTimeout: number;
  public druidRequestDecorator: string;
  public iframe: Iframe;

  constructor(parameters: ServerSettingsValue) {
    var port = parameters.port || ServerSettings.DEFAULT_PORT;
    if (typeof port !== 'number') throw new Error(`port must be a number`);
    this.port = port;

    this.serverRoot = parameters.serverRoot || ServerSettings.DEFAULT_SERVER_ROOT;
    this.pageMustLoadTimeout = parameters.pageMustLoadTimeout;
    this.druidRequestDecorator = parameters.druidRequestDecorator;
    this.iframe = parameters.iframe || ServerSettings.DEFAULT_IFRAME;
  }

  public valueOf(): ServerSettingsValue {
    return {
      port: this.port,
      serverRoot: this.serverRoot,
      pageMustLoadTimeout: this.pageMustLoadTimeout,
      druidRequestDecorator: this.druidRequestDecorator,
      iframe: this.iframe
    };
  }

  public toJS(): ServerSettingsJS {
    var js: ServerSettingsJS = {};
    if (this.port !== ServerSettings.DEFAULT_PORT) js.port = this.port;
    if (this.serverRoot !== ServerSettings.DEFAULT_SERVER_ROOT) js.serverRoot = this.serverRoot;
    js.pageMustLoadTimeout = this.pageMustLoadTimeout;
    js.druidRequestDecorator = this.druidRequestDecorator;
    js.iframe = this.iframe;
    return js;
  }

  public toJSON(): ServerSettingsJS {
    return this.toJS();
  }

  public toString(): string {
    return `[ServerSettings ${this.port}]`;
  }

  public equals(other: ServerSettings): boolean {
    return ServerSettings.isServerSettings(other) &&
      this.port === other.port &&
      this.serverRoot === other.serverRoot &&
      this.pageMustLoadTimeout === other.pageMustLoadTimeout &&
      this.druidRequestDecorator === other.druidRequestDecorator &&
      this.iframe === other.iframe;
  }

}
check = ServerSettings;
