#!/usr/bin/env node
var fs = require("fs");
var browserify = require("browserify");

var esformatterDir = "./node_modules/esformatter";
var cli = fs.readFileSync("./command_line.js", "utf8");

var esversion = require(__dirname + "/node_modules/esformatter/package.json").version;
esversion = "\n//based on esformatter " + esversion;

var b = browserify({
	basedir: esformatterDir
});
b.require("./lib/esformatter.js", {
	expose: "formatter"
});
b.bundle(function (err, src) {
	fs.writeFileSync("esformatter.js", "#!/usr/bin/env node\n" + src + cli + esversion);
});

var settings = fs.readFileSync("./sublime.settings", "utf8");
var defaults = fs.readFileSync(esformatterDir + "/lib/preset/default.json", "utf8");
// I know this is crazy, but I like 4 space indentation more than 2 spaces
defaults = JSON.stringify(JSON.parse(defaults), null, "    ");

var sublime_settings = settings.replace(/([ \t]+)<%= esformatter_defaults %>/, function (match, indentation) {
	return indentation + '"format_options" : ' + defaults.split("\n").map(function (line, index) {
		// Add base indentation, not on the first line
		return index === 0 ? line : (indentation + line);
	}).join("\n");
});

fs.writeFileSync("../EsFormatter.sublime-settings", sublime_settings);
