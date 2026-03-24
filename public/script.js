const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewSection = document.getElementById('previewSection');
const originalImage = document.getElementById('originalImage');
const resultImage = document.getElementById('resultImage');
const loading = document.getElementById('loading');
const progressText = document.getElementById('progressText');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

// API Key 已配置在后端
const API_KEY = 'yLWVD4C1RuDLkwPinHNUiV37';

// 点击上传
dropZone.addEventListener('click', () => fileInput.click());

// 拖拽上传
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        handleFile(fileInput.files[0]);
    }
});

async function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert('文件大小不能超过 10MB');
        return;
    }

    // 显示原图
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);

    await processImage(file);
}

async function processImage(file) {
    loading.style.display = 'block';
    previewSection.style.display = 'none';
    progressText.textContent = '正在上传图片...';

    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');
    formData.append('format', 'png');

    try {
        progressText.textContent = '正在去除背景...';
        
        const response = await fetch('/api/remove-bg', {
            method: 'POST',
            headers: {
                'X-Api-Key': API_KEY
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.errors?.[0]?.title || '处理失败');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        resultImage.src = url;
        loading.style.display = 'none';
        previewSection.style.display = 'block';
        
        resultImage.dataset.downloadUrl = url;
        
    } catch (error) {
        loading.style.display = 'none';
        alert('处理失败: ' + error.message);
    }
}

downloadBtn.addEventListener('click', () => {
    const url = resultImage.dataset.downloadUrl;
    if (url) {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'removed-bg-' + Date.now() + '.png';
        a.click();
    }
});

resetBtn.addEventListener('click', () => {
    previewSection.style.display = 'none';
    fileInput.value = '';
    resultImage.src = '';
    resultImage.dataset.downloadUrl = '';
});
