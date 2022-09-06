
const MongoStore = require("connect-mongo");
const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0.7ddl8ks.mongodb.net/session-user?retryWrites=true&w=majority`,
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
  }),
  cookie: { maxAge: 10000 * 60 },
  secret: "pass",
  resave: false,
  saveUninitialized: false,
};
module.exports = sessionConfig;
