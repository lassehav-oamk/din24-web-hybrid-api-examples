const fs = require('fs').promises

// Access logger exercise
module.exports = async function accessLogger(req, res, next) {
    const dateTime = new Date();
    const timeStr = dateTime.toISOString();
    const method = req.method;
    const path = req.path;
    const userAgent = req.get('User-Agent');

    const outputStr = timeStr + ", " + method + " " + path + ", " + userAgent + '\n';
    
    console.log(outputStr);
    try {
        await fs.appendFile('accessLog.txt', outputStr);
    } catch(e) {
        console.log('File write error')
        console.log(e);
    }

    next();
}