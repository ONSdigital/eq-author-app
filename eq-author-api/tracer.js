const {
  initTracerFromEnv,
  PrometheusMetricsFactory,
} = require("jaeger-client");
const promClient = require("prom-client");

let tracer;

const createTracer = (logger) => {
  if (!tracer) {
    const config = {
      serviceName: process.env.JAEGER_SERVICE_NAME,
    };

    const namespace = config.serviceName;
    const metrics = new PrometheusMetricsFactory(promClient, namespace);

    const options = {
      tags: {
        "eq_author_api.version": process.env.EQ_AUTHOR_API_VERSION,
      },
      metrics,
      logger,
    };

    tracer = initTracerFromEnv(config, options);
  }

  return tracer;
};

module.exports = {
  tracer: (logger) => ({
    localTracer: createTracer(logger),
    serverTracer: createTracer(logger),
  }),
};
