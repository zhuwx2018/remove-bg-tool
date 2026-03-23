const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const apiKeyInput = document.getElementById('apiKey');
const saveKeyBtn = document.getElementById('saveKey');
const keyStatus = document.getElementById('keyStatus');
const previewSection = document.getElementById('previewSection');
const originalImage = document.getElementById('originalImage');
const resultImage = document.getElementById('resultImage');
const loading = document.getElementById('loading');
const progressText = document.getElementById('progressText');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

// 初始化：检查保存的 API Key
function init() {
    const savedKey = localStorage.getItem('removeBgApiKey');
    if (savedKey) {
        apiKeyInput.value = savedKey;
        keyStatus.textContent = '已保存';
    }
}

// 保存 API Key
saveKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
        localStorage.setItem('removeBgApiKey', key);
        keyStatus.textContent = '已保存';
        keyStatus.classList.remove('error');
    } else {
        keyStatus.textContent = '请输入 API Key';
        keyStatus.classList.add('error');
    }
});

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
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        handleFile(fileInput.files[0]);
    }
});

// 处理文件
async function handleFile(file) {
    // 验证文件
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert('文件大小不能超过 10MB');
        return;
    }

    // 检查 API Key
    const apiKey = localStorage.getItem('removeBgApiKey');
    if (!apiKey) {
        alert('请先输入并保存 remove.bg API Key');
        apiKeyInput.focus();
        return;
    }

    // 显示原图
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);

    // 开始处理
    await processImage(file, apiKey);
}

// 处理图片
async function processImage(file, apiKey) {
    loading.style.display = 'block';
    previewSection.style.display = 'none';
    progressText.textContent = '正在上传图片...';

    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');
    formData.append('format', 'png');

    try {
        progressText.textContent = '正在去除背景...';
        
        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': apiKey
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
        
        // 保存结果 URL 用于下载
        resultImage.dataset.downloadUrl = url;
        
    } catch (error) {
        loading.style.display = 'none';
        alert('处理失败: ' + error.message);
    }
}

// 下载图片
downloadBtn.addEventListener('click', () => {
    const url = resultImage.dataset.downloadUrl;
    if (url) {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'removed-bg-' + Date.now() + '.png';
        a.click();
    }
});

// 重新上传
resetBtn.addEventListener('click', () => {
    previewSection.style.display = 'none';
    fileInput.value = '';
    resultImage.src = '';
    resultImage.dataset.downloadUrl = '';
});

// 初始化
init();
