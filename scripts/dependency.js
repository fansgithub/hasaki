const shell = require('shelljs');

exports.install = function(answers){
    shell.cd('public');
    shell.exec('npm install');
    shell.cd('../server');
    shell.exec('npm install');
    shell.cd(`..`);
};