const multer = require('multer');

module.exports = (multer({
    
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './app/public/images');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now().toString());
        }
    }), // FIM DA CONFIGURAÇÃO DE ARMAZENAMENTO

    fileFilter: (req, file, cb) => {
        const isAccepted = ['image/png', 'image/jpg', 'image/jpeg'].find( formatoAceito => formatoAceito == file.mimetype );
        if(isAccepted){
            return cb(null, true);
        }
        return cb(null, false);
    }
}));