const routes = require("./routes.json");

module.exports = {
  include: routes,
  crawl: false,
  timeout: 10000
};