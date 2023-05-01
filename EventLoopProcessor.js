"use strict";

const performance = require("perf_hooks").performance;
const eventLoopStats = require("event-loop-stats");

exports.__esModule = true;
exports.EventLoopProcessor = void 0;
var lag = 0;
var events;
function measureLag() {
  var start = performance.now();
  setTimeout(function () {
    lag = performance.now() - start;
    measureLag(); // Recurse
  });
}

// Requires npm install --save event-loop-stats
function measureEvents() {
  events = eventLoopStats.sense();
}

var EventLoopProcessor = /** @class */ (function () {
  function EventLoopProcessor(nextProcessor) {
    measureLag();
    this._nextProcessor = nextProcessor;
  }
  EventLoopProcessor.prototype.onStart = function (span, parentContext) {
    // Save Event Loop Metrics
    span.setAttribute("node.event_loop_lag", lag);
    measureEvents();
    span.setAttribute("node.event_loop_max", events.max);
    span.setAttribute("node.event_loop_min", events.min);
    span.setAttribute("node.event_loop_sum", events.sum);
    span.setAttribute("node.event_loop_num", events.num);

    if (this._nextProcessor) {
      this._nextProcessor.onStart(span, parentContext);
    }
  };
  EventLoopProcessor.prototype.onEnd = function (span) {
    if (this._nextProcessor) {
      this._nextProcessor.onEnd(span);
    }
  };
  EventLoopProcessor.prototype.shutdown = function () {
    return this._nextProcessor ? this._nextProcessor.shutdown() : Promise.resolve();
  };
  EventLoopProcessor.prototype.forceFlush = function () {
    return this._nextProcessor ? this._nextProcessor.forceFlush() : Promise.resolve();
  };
  return EventLoopProcessor;
})();
exports.EventLoopProcessor = EventLoopProcessor;
