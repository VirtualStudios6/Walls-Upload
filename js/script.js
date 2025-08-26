document.addEventListener('DOMContentLoaded', function() {
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const selectBtn = document.getElementById('selectBtn');
    const message = document.getElementById('message');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, e => { e.preventDefault(); e.stopPropagation(); });
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add('dragover'));
    });
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove('dragover'));
    });

    selectBtn.addEventListener('click', () => fileInput.click());
    dropArea.addEventListener('drop', e => handleFiles(e.dataTransfer.files));
    fileInput.addEventListener('change', e => handleFiles(e.target.files));

    function handleFiles(files) {
        if (!files.length) return;
        const file = files[0];

        if (!file.type.match('image.*')) { showMessage('Por favor, sube solo imágenes', 'error'); return; }
        if (file.size > 10 * 1024 * 1024) { showMessage('La imagen no debe superar 10MB', 'error'); return; }

        const formData = new FormData();
        formData.append('wallpaper', file);

        showMessage('Subiendo imagen...', 'warning');

        fetch('uploads/upload.php', {  // apunta a tu PHP dentro de la carpeta uploads
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => showMessage(data, 'success'))
        .catch(() => showMessage('Error al subir la imagen. Intenta de nuevo.', 'error'));
    }

    function showMessage(text, type) {
        message.textContent = text;
        message.className = 'message';
        if (type) message.classList.add(type);
        message.style.display = 'block';
        setTimeout(() => message.style.display = 'none', 4000);
    }
});
