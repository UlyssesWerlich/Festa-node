const fs = require('fs'),
    sharp = require('sharp');
    
exports.compressImage = (file, size) => {
    const newPath = file.path.split('.')[0] + '.jpg';
    return sharp(file.path, { failOnError: false })
        .resize(size)
        .toFormat('jpg')
        .jpeg({
            quality: 95
        })
        .toBuffer()
        .then(data => {
            fs.access(file.path, (err) => {
                if (!err) {
                    fs.unlink(file.path, err => {
                        if(err) console.log(err)
                    })
                }
            });
            
            fs.writeFile(newPath, data, err => {
                if(err){
                    throw err;
                }
            });
            return newPath;
        })   
}