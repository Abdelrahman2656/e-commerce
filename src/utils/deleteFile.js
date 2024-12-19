import fs from 'fs'
import path from 'path'
export const deleteFile = (filePath)=>{
    let fullPath = path.resolve(filePath)
    fs.unlinkSync(fullPath)
}