import React, {useRef, useState} from "react";
import {Document, Page} from "react-pdf/dist/esm/entry.webpack";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import LoadingSpinner from "./LoadingSpinner";


function PDFPreview({file}) {
    const canvasRef = useRef(null);
    const [thumb, setThumb] = useState(null);
    // if (thumb) return <img src={thumb} alt="pdf preview" className="rounded overflow-hidden"
    //                        style={{borderWidth: 1 + "px", borderStyle: "solid", borderColor: "#dee2e6"}}/>;

    return (
        <>
            <div className="pdf-preview">
                <Document file={file} loading={LoadingSpinner}>
                    <Page
                        onRenderSuccess={() => {
                            canvasRef?.current?.toBlob((blob) => setThumb(URL.createObjectURL(blob)));
                        }}
                        loading={LoadingSpinner}
                        width={200}
                        canvasRef={canvasRef}
                        className="rounded overflow-hidden shadow-lg "
                        renderTextLayer={false}
                        pageNumber={1}
                    />
                </Document>
            </div>

        </>
    );
}

export default PDFPreview;