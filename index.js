class PDFViewer extends HTMLElement {
    constructor() {
        super();
        this.scale = 1.5; // Adjust the scale as needed
        this.pdfDoc = null; // To store the PDF document
        this.canvasList = []; // To store the canvas elements
        this.ctxList = []; // To store the canvas contexts
    }

    connectedCallback() {
        const src = this.getAttribute('src');
        if (!src) {
            console.error('No source specified for PDF viewer.');
            return;
        }

        // Create a container element for the PDF
        const container = document.createElement('div');
        container.classList.add('pdf-container');

        // Append the container to the custom element
        this.appendChild(container);

        // Render the PDF
        this.renderPDF(src, container);

        // Create zoom controls
        this.createZoomControls(container);
    }

    renderPDF(url, container) {
        // Fetch the PDF document
        pdfjsLib.getDocument(url).promise.then(pdfDoc => {
            this.pdfDoc = pdfDoc; // Store the PDF document

            // Loop through each page
            for (let i = 1; i <= pdfDoc.numPages; i++) {
                // Render the page
                pdfDoc.getPage(i).then(page => {
                    const viewport = page.getViewport({ scale: this.scale });

                    // Create a div container for each page
                    const pageContainer = document.createElement('div');
                    pageContainer.classList.add('pdf-page-container');

                    // Create a canvas for the page
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    canvas.classList.add('pdf-page');

                    // Append canvas to page container
                    pageContainer.appendChild(canvas);

                    // Append page container to main container
                    container.appendChild(pageContainer);

                    // Store canvas and context
                    this.canvasList.push(canvas);
                    this.ctxList.push(context);

                    // Render page content on canvas
                    page.render({
                        canvasContext: context,
                        viewport: viewport
                    });
                });
            }
        }).catch(error => {
            console.error('Error rendering PDF:', error);
        });
    }



    createZoomControls(container) {
        // Create zoom in button
        const zoomInButton = document.createElement('button');
        zoomInButton.innerHTML = '<svg viewBox="0 0 32 32" height="10" width="10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>zoom-in</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-308.000000, -1139.000000)" fill="#000000"> <path d="M321.46,1163.45 C315.17,1163.45 310.07,1158.44 310.07,1152.25 C310.07,1146.06 315.17,1141.04 321.46,1141.04 C327.75,1141.04 332.85,1146.06 332.85,1152.25 C332.85,1158.44 327.75,1163.45 321.46,1163.45 L321.46,1163.45 Z M339.688,1169.25 L331.429,1161.12 C333.592,1158.77 334.92,1155.67 334.92,1152.25 C334.92,1144.93 328.894,1139 321.46,1139 C314.026,1139 308,1144.93 308,1152.25 C308,1159.56 314.026,1165.49 321.46,1165.49 C324.672,1165.49 327.618,1164.38 329.932,1162.53 L338.225,1170.69 C338.629,1171.09 339.284,1171.09 339.688,1170.69 C340.093,1170.3 340.093,1169.65 339.688,1169.25 L339.688,1169.25 Z M326.519,1151.41 L322.522,1151.41 L322.522,1147.41 C322.522,1146.85 322.075,1146.41 321.523,1146.41 C320.972,1146.41 320.524,1146.85 320.524,1147.41 L320.524,1151.41 L316.529,1151.41 C315.978,1151.41 315.53,1151.59 315.53,1152.14 C315.53,1152.7 315.978,1153.41 316.529,1153.41 L320.524,1153.41 L320.524,1157.41 C320.524,1157.97 320.972,1158.41 321.523,1158.41 C322.075,1158.41 322.522,1157.97 322.522,1157.41 L322.522,1153.41 L326.519,1153.41 C327.07,1153.41 327.518,1152.96 327.518,1152.41 C327.518,1151.86 327.07,1151.41 326.519,1151.41 L326.519,1151.41 Z" id="zoom-in" sketch:type="MSShapeGroup"> </path> </g> </g> </g></svg>';
        zoomInButton.style.display = 'block';
        zoomInButton.style.position = 'absolute';
        zoomInButton.style.top = '10px'; // Adjust top position as needed
        zoomInButton.style.right = '10px'; // Adjust right position as needed

        zoomInButton.addEventListener('click', () => {
            this.scale += 0.1;
            this.updateScale();
        });

        // Create zoom out button with SVG icon
        const zoomOutButton = document.createElement('button');
        zoomOutButton.innerHTML = '<svg viewBox="0 0 32 32" height="10" width="10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>zoom-out</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-360.000000, -1139.000000)" fill="#000000"> <path d="M373.46,1163.45 C367.17,1163.45 362.071,1158.44 362.071,1152.25 C362.071,1146.06 367.17,1141.04 373.46,1141.04 C379.75,1141.04 384.85,1146.06 384.85,1152.25 C384.85,1158.44 379.75,1163.45 373.46,1163.45 L373.46,1163.45 Z M391.688,1169.25 L383.429,1161.12 C385.592,1158.77 386.92,1155.67 386.92,1152.25 C386.92,1144.93 380.894,1139 373.46,1139 C366.026,1139 360,1144.93 360,1152.25 C360,1159.56 366.026,1165.49 373.46,1165.49 C376.672,1165.49 379.618,1164.38 381.932,1162.53 L390.225,1170.69 C390.629,1171.09 391.284,1171.09 391.688,1170.69 C392.093,1170.3 392.093,1169.65 391.688,1169.25 L391.688,1169.25 Z M378.689,1151.41 L368.643,1151.41 C368.102,1151.41 367.663,1151.84 367.663,1152.37 C367.663,1152.9 368.102,1153.33 368.643,1153.33 L378.689,1153.33 C379.23,1153.33 379.669,1152.9 379.669,1152.37 C379.669,1151.84 379.23,1151.41 378.689,1151.41 L378.689,1151.41 Z" id="zoom-out" sketch:type="MSShapeGroup"> </path> </g> </g> </g></svg>';
        zoomOutButton.style.display = 'block';
        zoomOutButton.style.position = 'absolute';
        zoomOutButton.style.top = '30px'; // Adjust top position as needed
        zoomOutButton.style.right = '10px'; // Adjust right position as needed

        zoomOutButton.addEventListener('click', () => {
            this.scale -= 0.1;
            this.updateScale();
        });

        // Create controls container
        const controlsContainer = document.createElement('div');
        controlsContainer.classList.add('pdf-controls');
        controlsContainer.appendChild(zoomInButton);
        controlsContainer.appendChild(zoomOutButton);

        // Append controls to the PDF viewer
        container.appendChild(controlsContainer);
    }

    updateScale() {
        if (!this.pdfDoc) {
            console.error('PDF document not loaded.');
            return;
        }

        for (let i = 0; i < this.pdfDoc.numPages; i++) {
            const new_scale = this.scale;
            const page = i + 1;
            const canvas = this.canvasList[i];
            const ctx = this.ctxList[i];
            const currentScale = ctx.canvas.width / canvas.width;

            // Clear the canvas
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            // Set the new scale
            ctx.scale(new_scale / currentScale, new_scale / currentScale);

            // Render the page
            this.pdfDoc.getPage(page).then(page => {
                const viewport = page.getViewport({
                    scale: new_scale
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
    }
}

// Define the custom element
customElements.define('pdf-viewer', PDFViewer);

