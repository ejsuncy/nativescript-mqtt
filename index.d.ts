declare function require(string);

declare class MQTT {}

declare interface IEvent<T>{
  on(handler:any) : T;
  off(handler:any) : T;
}

declare class EventHandler<T> {
    on(handler?:T):void;
    off(handler?:T): void;
    trigger(data?: T): void;
}

declare class Message {
  payload: string;
  bytes: ArrayBuffer;
  topic: string;
  qos: number;
  retained: boolean;
}

declare class MQTTClient {
  constructor(clientOptions:any);
  connect(username?:string, password?:string):void;
  onConnectionSuccess(): IEvent<void>;
  onConnectionFailure(): IEvent<string>;
  onConnectionLost(): IEvent<string>;
  onMessageArrived(): IEvent<Message>;
  connected: boolean;
}

declare interface ClientOptions {
  host? : string,
  port? : number,
  useSSL? : boolean,
  path? : string,
  clientId? : string,
  retryOnDisconnect? : boolean
}
