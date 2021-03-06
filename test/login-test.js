/*jshint quotmark: false */

"use strict";

var rio = require("../lib/rio"),
    vows = require("vows"),
    assert = require("assert");

var isEnablePlaybackMode = process.env.CI === "true";

vows.describe("Login tests").addBatch({
    "login ok test": {
        topic: function () {
            rio.enablePlaybackMode(isEnablePlaybackMode, {
                fileName: "test/dump/login-ok-test.bin"
            });

            rio.evaluate("2+2", {
                callback: this.callback
            });
        },

        "eval with login ok": function (err, topic) {
            if (!err) {
                assert(4, topic);
            }
        }
    },

    "login ko test": {
        topic: function () {
            rio.enablePlaybackMode(isEnablePlaybackMode, {
                fileName: "test/dump/login-ko-test.bin"
            });

            rio.evaluate("2+2", {
                user: "wrong user",
                password: "wrong password",
                callback: this.callback
            });
        },

        "eval with login ko": function (err, topic) {
            if (!err) {
                assert(4, topic);
            } else {
                if (err.code) {
                    assert.equal("ECONNRESET", err.code);
                } else {
                    if ("Response with error code 65" !== err && // Rserve
                        "Response with error code 0" !== err && // Local
                        "Eval failed with error code 0" !== err) { // Travis
                        assert.ifError(err);
                    }
                }
            }
        }
    }

}).export(module);
