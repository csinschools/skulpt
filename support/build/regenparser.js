const path = require('path');
const shell = require('shelljs');

var filepath;

if (!shell.test("-e", "gen")) {
    shell.mkdir("gen");
}

shell.cd(path.resolve("src", "pgen", "parser"));
filepath = path.resolve("..", "..", "..", "gen", "parse_tables.js");
shell.exec("C:/Python27/python.exe main.py " + filepath);
shell.cd(path.resolve("..", "ast"));
filepath = path.resolve("..", "..", "..", "gen", "astnodes.js");
shell.exec("C:/Python27/python.exe asdl_js.py Python.asdl " + filepath);
