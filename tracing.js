// Configure your .env with Honeycomb specific variables. See .env.sample.
require("dotenv").config();
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { Metadata, credentials } = require("@grpc/grpc-js");
const { NodeSDK } = require("@opentelemetry/sdk-node");
// const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require("@opentelemetry/instrumentation-express");
//const {OTLPTraceExporter} = require("@opentelemetry/exporter-trace-otlp-proto");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-grpc");
// const { OTLPTraceExporter } = require("@opentelemetry/exporter-collector-grpc");
const { diag } = require("@opentelemetry/api");
const { DiagConsoleLogger } = require("@opentelemetry/api");
const { DiagLogLevel } = require("@opentelemetry/api");
const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { EventLoopProcessor } = require("./EventLoopProcessor");
const { trace } = require("@grpc/grpc-js/build/src/logging");

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
const traceExporter = new OTLPTraceExporter();
const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  spanProcessor: new EventLoopProcessor(new BatchSpanProcessor(traceExporter)),
});

sdk.start();
