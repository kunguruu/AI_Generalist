const app = require("./app");
const { env } = require("./config/env");

app.listen(env.port, () => {
  console.log(`Safari AI backend listening on http://localhost:${env.port}`);
});
