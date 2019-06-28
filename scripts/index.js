#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const shell = require('shelljs');
const fs = require('fs');
const promptFunc = require('./prompt.js')

shell.config.silent = true;

program
.version(require('../package.json').version, '-v, --version')
//通过命令创建项目
.command('create <project>')
.description('创建项目')
.option('-p, --port <port>', '项目端口，比如`7510`')
.option('-d, --description <description>', '项目描述')
.option('-a, --author <author>', '项目作者')
.option('-o, --origin <origin>', '项目地址')
.action(function(project, options){
    if(fs.existsSync(`${process.cwd()}/${project}`)){
        inquirer.prompt([{
            type: 'confirm',
            name: 'delete',
            message: `当前目录下存在 ${project} 文件夹，是否删除，并继续执行操作？`
        }]).then(function(result){
            if(result.delete){
                shell.rm('-rf', `${project}`);
                promptFunc(options, project)
            }else{
                return console.error(`${project} 文件夹已经存在，操作无法进行，请删除该文件夹或修改文件名参数后重新执行。`);
            }
        });
    }else{
        promptFunc(options, project)
    }
});
program.parse(process.argv);
//当参数不足时，显示帮助信息
if(process.argv.length < 3){
    program.help();
}