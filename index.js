const exp = require("express");
const app = exp();
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
const clientSessions = require("client-sessions");

require('dotenv').config()

app.use(exp.json());

app.use(exp.static("img"));
app.use(exp.static("./plan_icons/"));
app.use(bodyParser.urlencoded({extended: true}));

app.use(clientSessions({
    cookieName: "session", 
    secret: process.env.SESSION_SECRET, 
    duration: process.env.SESSION_DUR_MIN * 60 * 1000, 
    activeDuration: process.env.SESSION_ACTIVE_DUR_MIN * 1000 * 60 
  }));

app.engine(".hbs", handlebars.engine({ extname : '.hbs'}));
app.set('view engine', '.hbs');

app.use("/", require('./routers/mainRouter'))
app.use("/auth", require('./routers/authRouter'))
app.use("/plans", require('./routers/plansRouter'))

const port = process.env.PORT || 8080;

 app.listen(port);

