const fileUpload = require('express-fileupload');

const fileUploadMiddleware = fileUpload ({
    limits : {fileSize : 50 * 1024  * 1024}, //50MB
    abortOnLimit: true,
    responseOnLimit : 'File to big,  cannot exceed 50 MB',
});


module.exports= {
    fileUploadMiddleware,

}
