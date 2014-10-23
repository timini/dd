module.exports = {
  port       : process.env.NODE_PORT || 3000,
  db   : {
    protocol : "postgresql", // or "mysql"
    query    : { pool: true },
    host     : "127.0.0.1",
    database : "drilldown",
    user     : "drilldown",
    password : "drilldown"
  }
};
