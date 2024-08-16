const dropArea = document.getElementById('drop-area');
const fileElem = document.getElementById('fileElem');
const progressArea = document.getElementById('progress-area');
const uploadStatus = document.getElementById('upload-status');
const pdfViewer = document.getElementById('pdf-viewer');
const pdfCanvas = document.getElementById('pdf-canvas');
let pdfDoc = null;
let scale = 1.0;

dropArea.addEventListener('click', () => fileElem.click());

function handleFiles(files) {
    const file = files[0];
    if (file && file.type === 'application/pdf') {
        uploadFile(file);
    } else {
        uploadStatus.textContent = "Please upload a valid PDF file.";
    }
}

function uploadFile(file) {
    const url = '/upload'; // Backend API endpoint for handling file upload
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.upload.onprogress = (e) => {
        const percent = (e.loaded / e.total) * 100;
        progressArea.innerHTML = `<div class="progress-bar" style="width: ${percent}%;"></div>`;
    };

    xhr.onload = () => {
        if (xhr.status === 200) {
            displayPDF(file);
            uploadStatus.textContent = "Upload successful!";
        } else {
            uploadStatus.textContent = "Upload failed. Please try again.";
        }
    };

    xhr.send(formData);
}

function displayPDF(file) {
    pdfViewer.style.display = 'block';
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function(e) {
        const pdfData = new Uint8Array(e.target.result);
        pdfjsLib.getDocument(pdfData).promise.then((pdf) => {
            pdfDoc = pdf;
            renderPage(1);
        });
    };
}

function renderPage(pageNumber) {
    pdfDoc.getPage(pageNumber).then((page) => {
        const viewport = page.getViewport({ scale });
        pdfCanvas.height = viewport.height;
        pdfCanvas.width = viewport.width;

        const renderContext = {
            canvasContext: pdfCanvas.getContext('2d'),
            viewport: viewport
        };
        page.render(renderContext);
    });
}

function zoomIn() {
    scale += 0.2;
    renderPage(1);
}

function zoomOut() {
    if (scale > 0.2) {
        scale -= 0.2;
        renderPage(1);
    }
}

function toggleMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

