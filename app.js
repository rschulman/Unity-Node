require("coffee-script")

var app = require("./src/app")

app.listen(process.ENV.port);