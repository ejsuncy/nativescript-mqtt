"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var MQTT = require('./mqttws31');
var MQTTClient = (function () {
    function MQTTClient(options) {
        this.connectionSuccess = new common_1.EventHandler();
        this.connectionFailure = new common_1.EventHandler();
        this.connectionLost = new common_1.EventHandler();
        this.messageArrived = new common_1.EventHandler();
        this.connected = false;
        this.host = options.host || 'localhost';
        this.useSSL = options.useSSL || false;
        if (options.port)
            this.port = options.port;
        else
            this.port = this.useSSL ? 443 : 80;
        this.path = options.path || '';
        this.clientId = options.clientId || common_1.guid();
        this.retryOnDisconnect = options.retryOnDisconnect || false;
        this.mqttClient = new MQTT.Client(this.host, this.port, this.path, this.clientId);
        this.mqttClient.useSSL = this.useSSL;
    }
    ;
    Object.defineProperty(MQTTClient.prototype, "onConnectionSuccess", {
        get: function () { return this.connectionSuccess; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MQTTClient.prototype, "onConnectionFailure", {
        get: function () { return this.connectionFailure; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MQTTClient.prototype, "onConnectionLost", {
        get: function () { return this.connectionLost; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MQTTClient.prototype, "onMessageArrived", {
        get: function () { return this.messageArrived; },
        enumerable: true,
        configurable: true
    });
    MQTTClient.prototype.connect = function (username, password) {
        var _this = this;
        if (this.connected) {
            return;
        }
        var connectOptions = {
            userName: username,
            password: password,
            useSSL: this.useSSL,
            onSuccess: function () {
                _this.connectionSuccess.trigger();
                _this.connected = true;
            },
            onFailure: function (err) {
                _this.connectionFailure.trigger(err.errorMessage);
            }
        };
        this.mqttClient.onConnectionLost = function (err) {
            _this.connectionLost.trigger(err.errorMessage);
            _this.connected = false;
        };
        this.mqttClient.onMessageArrived = function (message) {
            _this.messageArrived.trigger(new common_1.Message(message));
        };
        this.mqttClient.connect(connectOptions);
    };
    MQTTClient.prototype.subscribe = function (topic) {
        this.mqttClient.subscribe(topic);
    };
    MQTTClient.prototype.unsubscribe = function (topic) {
        this.mqttClient.unsubscribe(topic);
    };
    MQTTClient.prototype.publish = function (message) {
        var mqttMessage = message.bytes !== null ?
            new MQTT.Message(message.bytes) : new MQTT.Message(message.payload);
        mqttMessage.destinationName = message.topic;
        mqttMessage.retained = message.retained;
        mqttMessage.qos = message.qos;
        this.mqttClient.send(mqttMessage);
    };
    return MQTTClient;
}());
exports.MQTTClient = MQTTClient;
//# sourceMappingURL=index.js.map