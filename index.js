class MyPDFViewer extends HTMLElement {
    constructor() {
        super();

        // Default values
        this.url = this.getAttribute('url') || '';
        this.height = parseInt(this.getAttribute('height')) || 600;
        this.width = parseInt(this.getAttribute('width')) || 800;

        // Shadow DOM
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .pdf-page {
                    display: block;
                    margin: 0 auto;
                }
            </style>
        `;
    }

    connectedCallback() {
        this.renderPDF();
    }

    renderPDF() {
        let pdfDoc = null;
        let scale = 1;

        function renderPage(pageNumber, canvas) {
            pdfDoc.getPage(pageNumber).then(function(page) {
                const viewport = page.getViewport({ scale });
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.render(renderContext);
            });
        }

        function loadPDF(pdfData) {
            pdfjsLib.getDocument({ data: pdfData }).promise.then(function(doc) {
                pdfDoc = doc;
                for (let i = 1; i <= pdfDoc.numPages; i++) {
                    const canvas = document.createElement('canvas');
                    canvas.classList.add('pdf-page');
                    canvas.style.height = this.height + 'px';
                    canvas.style.width = this.width + 'px';
                    this.shadowRoot.appendChild(canvas);
                    renderPage(i, canvas);
                }
            }.bind(this)).catch(function(err) {
                console.error('Error loading PDF:', err);
            });
        }

        loadPDF.call(this, this.url);
    }
}

customElements.define('my-pdf-viewer', MyPDFViewer);
