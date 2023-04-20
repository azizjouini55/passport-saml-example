let fs = require('fs');
console.log(fs.readFileSync(__dirname + '/cert/idp_cert.pem', 'utf8')
)