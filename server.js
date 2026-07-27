const appInsights = require("applicationinsights");

if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
  appInsights
    .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .start();
}

const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.status(200).send("War Room Lab is running");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "warroom-lab"
  });
});

app.get("/test/error", (req, res) => {
  res.status(500).json({
    status: "failed",
    message: "Intentional test error"
  });
});

app.get("/test/delay", async (req, res) => {
  await new Promise(resolve => setTimeout(resolve, 5000));

  res.status(200).json({
    status: "slow",
    delaySeconds: 5
  });
});

app.get("/test/exception", (req, res) => {
  throw new Error("Intentional workbook lab exception");
});

app.use((err, req, res, next) => {
  if (appInsights.defaultClient) {
    appInsights.defaultClient.trackException({ exception: err });
  }

  res.status(500).json({
    status: "failed",
    message: err.message
  });
});

app.listen(port, () => {
  console.log(`War Room Lab listening on port ${port}`);
});
``
