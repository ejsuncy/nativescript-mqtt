import {IEvent, EventHandler, guid} from './common';
import {Paho} from './mqttws31';
import MQTT = Paho.MQTT;
import Client = MQTT.Client;
import ConnectOptions = MQTT.ConnectOptions;
import ResponseObject = MQTT.ResponseObject;
import SubscribeOptions = MQTT.SubscribeOptions;
import UnsubscribeOptions = MQTT.UnsubscribeOptions;
import Message = MQTT.Message;
import {isNullOrUndefined} from "tns-core-modules/utils/types";
import TraceFunction = Paho.MQTT.TraceFunction;

interface ClientOptions {
    host?: string,
    port?: number,
    useSSL?: boolean,
    path?: string,
    clientId?: string,
    retryOnDisconnect?: boolean
}

class MQTTClient {
    private mqttClient: Client;
    private host: string;
    private port: number;
    private path: string;
    private useSSL: boolean;
    public clientId: string;
    public connected: boolean;
    private retryOnDisconnect: boolean;
    private connectionSuccess = new EventHandler<ResponseObject>();
    private connectionFailure = new EventHandler<ResponseObject>();
    private connectionLost = new EventHandler<string>();
    private messageArrived = new EventHandler<Message>();

    constructor(options: ClientOptions) {
        /* options
          host: string
          port: int - default 80 | useSSL 443
          path: string - default empty
          useSSL: bool - default false
          clientId: string - default UUID
          retryOnDisconnect: bool - default false
        */
        this.connected = false;
        this.host = options.host || 'localhost';
        this.useSSL = options.useSSL || false;
        if (options.port) this.port = options.port;
        else this.port = this.useSSL ? 443 : 80;
        this.path = options.path || '';
        this.clientId = options.clientId || guid();
        this.retryOnDisconnect = options.retryOnDisconnect || false;


        this.mqttClient = new MQTT.Client(this.host, this.port, this.path, this.clientId);

        this.mqttClient.trace = (message) => {
            console.dir("[" + message.severity + "] " + message.message);
        };
    };

    //events for the MQTT Client
    public get onConnectionSuccess(): IEvent<ResponseObject> {
        return this.connectionSuccess;
    }

    public get onConnectionFailure(): IEvent<ResponseObject> {
        return this.connectionFailure;
    }

    public get onConnectionLost(): IEvent<string> {
        return this.connectionLost;
    }

    public get onMessageArrived(): IEvent<Message> {
        return this.messageArrived;
    }

    public connect(username, password) {
        if (this.connected) {
            return;
        }

        let connectOptions: ConnectOptions = {
            userName: username,
            password: password,
            useSSL: this.useSSL,
            onSuccess: (responseObject: ResponseObject) => {
                this.connectionSuccess.trigger(responseObject);
                this.connected = true;
            },
            onFailure: (responseObject: ResponseObject) => {
                this.connectionFailure.trigger(responseObject);
            },
            keepAliveInterval: 120
        };

        this.mqttClient.onConnectionLost = (err) => {
            this.connectionLost.trigger(err.errorMessage);
            this.connected = false;
        };

        this.mqttClient.onMessageArrived = (message: Message) => {
            this.messageArrived.trigger(message);
        };

        this.mqttClient.connect(connectOptions);
    }

    public subscribe(topic: string, subscribeOptions?: SubscribeOptions) {
        this.mqttClient.subscribe(topic, subscribeOptions);
    }

    public unsubscribe(topic: string, unsubscribeOptions?: UnsubscribeOptions) {
        this.mqttClient.unsubscribe(topic, unsubscribeOptions);
    }

    public publish(message: Message) {
        this.mqttClient.send(message);
    }
}

export {
    MQTTClient,
    ClientOptions,
    SubscribeOptions,
    UnsubscribeOptions,
    ResponseObject,
    Message
}
