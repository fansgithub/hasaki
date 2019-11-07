const fs = require('fs');
const os = require('os');

exports.update = function(answers){
    //修改 package.json 文件的基本信息
    function updateBasicInfo(data){
        data.name = answers.project;
        data.description = answers.description;
        data.author = answers.author;
    }
    //更新
    update('', (data)=>{
        updateBasicInfo(data);
        data.repository.url = answers.origin;
    });
};

function update(folder, handle){
    let path = require('path').join(folder, 'package.json');
    let data = fs.readFileSync(path, 'utf8');
    data = JSON.parse(data);
    handle(data);
    data = JSON.stringify(data, null, 2);
    fs.writeFileSync(path, data + os.EOL);
}