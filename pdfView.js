export function loadPDFData(pdfData) {
    let pdfDoc = null,
        scale = 0.5,
        pageNum = 1,
        canvasList = [],
        ctxList = [];

    const renderPage = num => {
        pdfDoc.getPage(num).then(page => {
            const viewport = page.getViewport({
                scale
            });
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.classList.add('pdf-page');
            document.getElementById('pdf-view').appendChild(canvas);
            canvasList.push(canvas);
            ctxList.push(ctx);
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            page.render(renderContext);
        });
    };

    const loadPDF = pdfData => {
        pdfjsLib.getDocument({ data: pdfData }).promise.then(pdfDoc_ => {
            pdfDoc = pdfDoc_;
            for (let i = 1; i <= pdfDoc.numPages; i++) {
                renderPage(i);
            }
        }).catch(err => {
            console.error('Error loading PDF:', err);
        });
    };

    document.getElementById('zoom-out').addEventListener('click', () => {
        if (scale <= 0.5) {
            return;
        }
        scale -= 0.1;
        updateScale();
    });

    document.getElementById('zoom-in').addEventListener('click', () => {
        if (scale >= 3.0) {
            return;
        }
        scale += 0.1;
        updateScale();
    });

    const updateScale = () => {
        for (let i = 0; i < pdfDoc.numPages; i++) {
            const page = i + 1;
            const canvas = canvasList[i];
            const ctx = ctxList[i];
            const currentScale = ctx.canvas.width / canvas.width;

            // Clear the canvas
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            // Set the new scale
            ctx.scale(scale / currentScale, scale / currentScale);

            // Render the page
            pdfDoc.getPage(page).then(page => {
                const viewport = page.getViewport({
                    scale
                });
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                const renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };
                page.render(renderContext);
            });
        }
    };

    loadPDF(pdfData);
}
