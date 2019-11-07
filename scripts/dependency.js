const shell = require('shelljs');

exports.install = function(answers){
    shell.exec('npm install');
};