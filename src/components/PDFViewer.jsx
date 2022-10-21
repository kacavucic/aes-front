import React, {useEffect, useState} from 'react';
import {Document, Page} from 'react-pdf/dist/esm/entry.webpack';

function PDFViewer(doc) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({numPages}) {
        setNumPages(numPages);
    }

    return (
        <div>
            <Document
                file={doc}
                onLoadSuccess={onDocumentLoadSuccess}>
                <Page
                    // width={636}
                    pageNumber={pageNumber}/>
            </Document>
            <p>
                Page {pageNumber} of {numPages}
            </p>
        </div>
    );
}

export default PDFViewer;

