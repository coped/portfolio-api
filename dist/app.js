"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.app = void 0;
var http_errors_1 = __importDefault(require("http-errors"));
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var morgan_1 = __importDefault(require("morgan"));
var index_1 = require("./routes/index");
var contact_1 = require("./routes/contact");
var constants_1 = require("./utils/constants");
var app = (0, express_1["default"])();
exports.app = app;
app.use((0, morgan_1["default"])("dev"));
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: false }));
app.use((0, cookie_parser_1["default"])());
app.use(express_1["default"].static(path_1["default"].join(__dirname, "public")));
app.use("/", index_1.router);
app.use("/contact", contact_1.router);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1["default"])(404));
});
// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === constants_1.ENV.DEVELOPMENT ? err : {};
    // show a generic error message
    res.status(err.status || 500);
    res.json({ error: err });
});
