import React from 'react';
import { Document, Page } from "react-pdf";

function PdfViewer({ name, url }) {
    // url = 'https://pdfobject.com/pdf/sample.pdf'

    return (
        <a href={url} target='_blank' rel="noreferrer noopener" className='flex py-2 px-4 rounded-lg text-white bg-color-turq hover:bg-color-blue justify-between'>
                <p>{name}</p>
                <p>Click to view</p>
        </a>
    );
}

export default PdfViewer;
