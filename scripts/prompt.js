const spinner = require('ora')();
const inquirer = require('inquirer');
const shell = require('shelljs');
let chalk = require('chalk');
const utils = require('./utils.js');
const package = require('./package.js');
const git = require('./git.js');
const dependency = require('./dependency.js')
const templates = require('./templates.js')

module.exports = function(options, project){
    let answers = {
        project,
        description: options.description,
        author: options.author,
        origin: options.origin
    }
    let prompts = [];
    if(templates.length > 1){
        templates.forEach((item)=>{
            item.name =  chalk.green('★ ') + chalk.green(item.name) + ' (desc: ' + chalk.yellow(item.description) + ')'
        })
        prompts.push({
            type: 'list',
            name: 'template',
            message: '请选择要生成的项目模板',
            choices: templates
        });
    }else{
        answers.template = templates[0].value;
    }
    if(options.description === undefined){
        prompts.push({
            type: 'input',
            name: 'description',
            message: '请输入项目描述',
        });
    }
    if(options.author === undefined){
        prompts.push({
            type: 'input',
            name: 'author',
            message: '请输入项目作者',
            default: utils.getDefaultAuthor,
        });
    }
    if(options.origin === undefined){
        const template = 'git@github.com:fansgithub/${project_name}.git';
        prompts.push({
            type: 'input',
            name: 'origin',
            message: `请输入项目的仓库地址（比如 ${template}）`,
            validate: (origin) => {
                return !origin
                    || /git@.*\.git/.test(origin)
                    || `项目地址格式是 ${template}，如果还没有创建，请不要填写。`;
            }
        });
    }
    inquirer.prompt(prompts).then(function(result){
        answers = Object.assign(answers, result);
        // 将端口转成数字，方便以后进行数值计算
        spinner.start('下载代码');
        shell.exec(`git clone ${answers.template} "${answers.project}"`)
        spinner.succeed();
        shell.cd(answers.project);
        // 修改 package.json
        spinner.start('修改 package.json');
        package.update(answers);
        spinner.succeed();
        spinner.start(`提交初始化代码 ${answers.origin}`);
        git.update(answers);
        spinner.succeed();
        return answers;
    }).then(function(answers){
        return inquirer.prompt([{
            type: 'confirm',
            name: 'dependency',
            message: '是否安装依赖？'
        }]).then(function(result){
            answers = Object.assign(answers, result);
            if(answers.dependency){
                spinner.start('正在安装依赖...');
                dependency.install(answers);
                spinner.succeed(chalk.green(`依赖安装完成，快去${answers.project}文件夹下查看readme.md文件启动项目吧！`));
            }else{
                spinner.info(chalk.yellow(`已放弃安装依赖，请依照${answers.project}文件夹下的readme.md文档启动项目！`))
            }
            return answers;
        });
    })
}