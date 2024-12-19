import fs from 'fs'
import { DateTime } from 'luxon'
import multer from "multer"
import { nanoid } from 'nanoid'
import path from 'path'
import { AppError } from './appError.js'

export const fileValidation = {
    image: [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/svg+xml",
    ],
    videos: [
      "video/mp4",
      "video/mpeg",
      "video/ogg",
      "video/quicktime",
      "video/webm",
      "video/x-ms-wmv",
      "video/x-msvideo",
    ],
    audios: ["audio/midi", "audio/mpeg", "audio/webm", "audio/ogg", "audio/wav"],
    documents: ["application/javascript", "application/json", "application/pdf"],
  };
export const fileUpload = ({folder , allowType=fileValidation.image})=>{
    //diskStorage
    const storage = multer.diskStorage({
        destination:(req,file, cb)=>{
            let fullPath = path.resolve(`uploads/${folder}`)
            if(!fs.existsSync(fullPath)){
                return fs.mkdirSync(fullPath,{recursive : true})
            }
            cb(null, `uploads/${folder}`)
        },
        filename:(req,file,cb)=>{
            const now = DateTime.now().toFormat('yyyy-MM-dd')
            const unique = nanoid()
            const fileName = `${now}_${unique}_${file.originalname}`
            cb(null,fileName)
        }
    })
    //FileFilter
    const fileFilter = (req,file , cb)=>{
        console.log(file);
        if(allowType.includes(file.mimetype)){
          return   cb(null , true)
        }
        cb( new AppError('invalid file format',400),false)
    }
    return multer({storage,fileFilter})
}