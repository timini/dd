module.exports = {
  port: process.env.NODE_PORT || 3000,
  db: {
    protocol: "postgresql",
    query: { pool: true },
    host: "127.0.0.1",
    database: "drilldown",
    user: process.env.DRILLDOWN_PSQL_USER || "drilldown",
    password: process.env.DRILLDOWN_PSQL_PASSWORD || "drilldown"
  }
};
