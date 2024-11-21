import pdfIcon from '../assets/images/iconPDF.png'
import imgIcon from '../assets/images/iconIMAGE.svg'
import officeIcon from '../assets/images/iconOFFICE.png'
import fileIcon from '../assets/images/iconFile.png'

const getIcons = (extension: string | undefined) => {
    switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
            return imgIcon
        case 'pdf':
            return pdfIcon
        case 'docx':
        case 'doc':
        case 'xlsx':
        case 'xls':
        case 'pptx':
            return officeIcon
        default:
            return fileIcon
    }
}


export default getIcons