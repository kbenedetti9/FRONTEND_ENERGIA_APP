import { savePDF } from '@progress/kendo-react-pdf';

class PDFService {
    createPdf = (html) => {
        savePDF(html, {
            paperSize: 'letter',
            fileName: 'Reporte.pdf',
            margin: { top: '2cm', left: '1.5cm', right: '1.5cm', bottom: '2cm' },
            scale: 0.7,
        })
    }
}

const Pdf = new PDFService();
export default Pdf;