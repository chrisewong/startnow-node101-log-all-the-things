const express = require('express');
const fs = require('fs');
const app = express();





app.use((req, res, next) => {
// write your logging code here
    var header = req.headers['user-agent'].replace(',', '') + ',';
    var time = new Date().toISOString() + ',';
    var method = req.method + ',';
    var resource = req.url + ',';
    var version = 'HTTP/' + req.httpVersion + ',';
    var status = res.statusCode + '\n';
    var finish = (header + time + method + resource + version + status);
    

    fs.appendFile('server/log.csv', finish, (err) => {
        if (err) throw err;
        console.log(finish);
    
    next();
})
});


app.get('/', (req, res) => {
// // // // // // write your code to respond "ok" here
   res.send('ok');
});

app.get('/logs', (req, res) => {
// // // // // // write your code to return a json object containing the log data here
 //converting CSV to JSON   
    fs.readFile('server/log.csv', 'utf-8', function(err, data) {
        function csvJSON(csv) {
                var lines = csv.split('\n');
                var result = [];
                var headers = lines[0].split(',');
                for(var i=1; i<lines.length; i++) {
                    var obj = {};
                    var currentline= lines[i].split(',');

                for(var j=0; j<headers.length; j++){
                    obj[headers[j]] = currentline[j];
                }
                result.push(obj);
                }
                return result;
        }
        res.json(csvJSON(data));
        res.end();
    })


     
    

})

module.exports = app;
