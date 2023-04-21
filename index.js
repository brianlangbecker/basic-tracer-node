'use strict';
// Import tracing before any other package is imported.
require("./tracing.js");

const opentelemetry = require('@opentelemetry/api');
const tracer = opentelemetry.trace.getTracer('example-basic-tracer-node');

const firstSpan = tracer.startSpan("start");
  firstSpan.setAttribute("number", 1);
  const result = // and they set the result
  firstSpan.end();

for (let i = 0; i < 10000; i += 1) {
  tracer.startActiveSpan('main', (span) => {
    for (let k = 0; k < 100; k += 1) {
      doWork();
    }

    // Be sure to end the span!
    span.end();
  
  })
};

traceExporter.shutdown();

function doWork() {
  // simulate some random work.
  for (let j = 0; j <= Math.floor(Math.random() * 40000000); j += 1) {
    // empty
    //console.log("DoWork")
  }
}
