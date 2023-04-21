const { NodeSDK } = require('@opentelemetry/sdk-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const { diag } = require("@opentelemetry/api")
const { DiagConsoleLogger } =  require("@opentelemetry/api")
const { DiagLogLevel } =  require("@opentelemetry/api")


diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
const traceExporter = new ConsoleSpanExporter();
const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk
  .start()
