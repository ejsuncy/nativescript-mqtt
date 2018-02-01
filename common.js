"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventHandler = (function () {
    function EventHandler() {
        this.handlers = [];
    }
    EventHandler.prototype.on = function (handler) {
        this.handlers.push(handler);
    };
    EventHandler.prototype.off = function (handler) {
        this.handlers = this.handlers.filter(function (h) { return h !== handler; });
    };
    EventHandler.prototype.trigger = function (data) {
        this.handlers.slice(0).forEach(function (h) { return h(data); });
    };
    return EventHandler;
}());
exports.EventHandler = EventHandler;
var Message = (function () {
    function Message(mqttMessage) {
        this.payload = mqttMessage.payloadString || '';
        this.bytes = mqttMessage.payloadBytes || null;
        this.topic = mqttMessage.destinationName || '';
        this.qos = mqttMessage.qos || 0;
        this.retained = mqttMessage.retained || false;
    }
    return Message;
}());
exports.Message = Message;
var guid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};
exports.guid = guid;
//# sourceMappingURL=common.js.map