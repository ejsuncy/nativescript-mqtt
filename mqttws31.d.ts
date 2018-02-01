export declare namespace Paho {
    export namespace MQTT {
        export class Message {
            constructor(payload: string | ArrayBuffer);
            readonly payloadString: string;
            readonly payloadBytes: Array<any>;
            destinationName: string;
            qos: number;
            retained: boolean;
            duplicate: boolean;
        }

        interface CallbackFunction {
            (responseObject : ResponseObject) : void;
        }

        interface TraceMessage {
            severity: string;
            message: string;
        }

        interface TraceFunction {
            (traceMessage : TraceMessage) : void;
        }

        export class ConnectOptions {
            timeout ?: number; // default 30 seconds
            userName ?: string;
            password ?: string;
            willMessage ?: Message;
            keepAliveInterval ?: number; // default 60 seconds
            cleanSession ?: boolean;
            useSSL ?: boolean;
            invocationContext ?: Object;
            onSuccess: CallbackFunction;
            onFailure: CallbackFunction;
        }

        export class UnsubscribeOptions {
            invocationContext ?: Object;
            onSuccess ?: CallbackFunction;
            onFailure ?: CallbackFunction;
            timeout ?: number; // in seconds
        }

        export class SubscribeOptions extends UnsubscribeOptions {
            qos ?: number;
        }

        export class Client {
            constructor(host: string, clientId: string);
            constructor(host: string, port: number, clientId: string);
            constructor(host: string, port: number, path: string, clientId: string);
            connect(connectOptions: ConnectOptions): void;
            subscribe(filter: string, subscribeOptions: SubscribeOptions): void;
            unsubscribe(filter: string, unsubscribeOptions: UnsubscribeOptions): void;
            send(message: Message);
            disconnect(): void;
            getTraceLog(): Array<Object>;
            startTrace(): void;
            stopTrace(): void;
            isConnected(): boolean;

            onConnectionLost(responseObject: ResponseObject): void;
            onMessageDelivered(message: Message): void;
            onMessageArrived(message: Message): void;
            trace : TraceFunction
        }

        export class ResponseObject {
            invocationContext?: any;
            errorCode: number;
            errorMessage?: string;
        }
    }
}
