"use strict";
exports.__esModule = true;
exports.router = void 0;
var express_1 = require("express");
var router = (0, express_1.Router)();
exports.router = router;
/**
 * GET index response
 */
router.get("/", function (req, res) {
    res.json({ message: "Hello, world!" });
});
