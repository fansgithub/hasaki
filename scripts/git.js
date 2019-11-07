const shell = require('shelljs');

exports.update = function(answers){
    shell.rm('-rf', '.git');
    shell.rm('.gitmodules');
    shell.exec('git init');
    shell.exec('git add .');
    shell.exec('git commit -m "feat: project initialization"');
    // 提交到远程仓库，如果用户提供地址的话
    if(answers.origin){
        shell.exec(`git remote add origin ${answers.origin}`);
        shell.exec('git push -u origin master');
    }
};