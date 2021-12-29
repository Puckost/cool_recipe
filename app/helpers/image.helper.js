const sharp = require("sharp")
const multer = require('multer')

const dotenv = require('dotenv');
dotenv.config( { path : 'config.env'} )
const uploadDir = process.env.UPLOADDIR || 'uploads/'
const resizedDir = process.env.RESIZEDIR || 'uploads/resized/'

// Crop and resize the uploaded image
const cropImage = async (img) => {
    try {
        await sharp(uploadDir + img)
            .resize(450, 300)
            .jpeg({ quality: 90 })
            .toFile(resizedDir + img);
    } catch (error) {
            console.log(error);
    }
}

const whitelist = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
]

// Upload image
const upload = multer({
    storage: multer.diskStorage({
      destination: uploadDir,
      filename: (req, file, cb) => {
        //const name = slugify(file.originalname, { lower: true })
        cb(null, `${new Date().getTime()}-${file.originalname}`)
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!whitelist.includes(file.mimetype)) {
        return cb(new Error('file is not allowed'))
      }

      cb(null, true)
    }
})

module.exports = {
    cropImage,
    upload
};
