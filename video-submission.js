document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('videoForm');
  const fileInput = document.getElementById('videoFile');
  const uploadZone = document.getElementById('uploadZone');
  const uploadZoneTitle = document.getElementById('uploadZoneTitle');
  const uploadZoneDesc = document.getElementById('uploadZoneDesc');
  const progressBar = document.getElementById('progressBar');
  const progressPercentage = document.getElementById('progressPercentage');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const statusMessage = document.getElementById('statusMessage');

  let selectedFile = null;

  // -- Submission Method Toggle logic --
  const uploadSection = document.getElementById('uploadSection');
  const urlSection = document.getElementById('urlSection');
  const methodRadios = document.getElementsByName('submissionMethod');
  const videoUrlInput = document.getElementById('videoUrl');

  if (methodRadios.length > 0) {
    methodRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'upload') {
          uploadSection.classList.remove('hidden');
          urlSection.classList.add('hidden');
          videoUrlInput.required = false;
          fileInput.required = true;
        } else {
          uploadSection.classList.add('hidden');
          urlSection.classList.remove('hidden');
          videoUrlInput.required = true;
          fileInput.required = false;
        }
      });
    });
  }

  // -- Event Listeners for File Drag & Drop --
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  });

  function handleFileSelection(file) {
    if (!file.type.startsWith('video/')) {
      showStatus('Please select a valid video file.', 'error');
      return;
    }
    
    // Check file size (e.g. max 500MB)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      showStatus('File is too large. Maximum size is 500MB.', 'error');
      return;
    }

    selectedFile = file;
    uploadZone.classList.add('has-file');
    uploadZoneTitle.textContent = file.name;
    uploadZoneDesc.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    showStatus('', ''); // clear errors
  }

  function showStatus(msg, type) {
    statusMessage.textContent = msg;
    statusMessage.className = 'status-message'; // reset
    if (type) {
      statusMessage.classList.add(type);
    }
  }

  // -- form submit --
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const methodEl = document.querySelector('input[name="submissionMethod"]:checked');
    const method = methodEl ? methodEl.value : 'upload';
    
    const contentType = document.getElementById('contentType').value;
    
    let finalVideoUrl = '';

    if (method === 'upload') {
      if (!selectedFile) {
        showStatus('Please select a video file to upload.', 'error');
        return;
      }
    } else {
      finalVideoUrl = videoUrlInput.value.trim();
      if (!finalVideoUrl) {
        showStatus('Please enter a valid video URL.', 'error');
        return;
      }
    }

    // Disable UI
    submitBtn.disabled = true;
    btnText.textContent = method === 'upload' ? 'Uploading...' : 'Submitting...';
    showStatus('', '');

    try {
      if (method === 'upload') {
        // 1. Upload video to Vercel Blob
        const newBlob = await window.vercelBlob.upload(selectedFile.name, selectedFile, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          multipart: true,
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            progressBar.style.width = percent + '%';
            progressPercentage.textContent = percent + '%';
          }
        });
        finalVideoUrl = newBlob.url;
      }

      btnText.textContent = 'Saving Details...';

      // 2. Submit Form Metadata
      const metadataParams = {
        fullName: document.getElementById('fullName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        contentType: contentType,
        videoUrl: finalVideoUrl
      };

      const res = await fetch('/api/submit-video-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadataParams)
      });

      if (!res.ok) throw new Error('Failed to save metadata');

      showStatus('Submission successful! Thank you.', 'success');
      form.reset();
      
      // Reset State
      selectedFile = null;
      uploadZone.classList.remove('has-file');
      uploadZoneTitle.textContent = 'Click or drag a video file here';
      uploadZoneDesc.textContent = 'Max 500MB (MP4, MOV, WebM)';
      progressBar.style.width = '0%';
      progressPercentage.textContent = '0%';
      btnText.textContent = 'Submit Video';

      // Restore default visibility
      if (uploadSection) uploadSection.classList.remove('hidden');
      if (urlSection) urlSection.classList.add('hidden');

    } catch (error) {
      console.error(error);
      showStatus('An error occurred during submission. ' + error.message, 'error');
      submitBtn.disabled = false;
      btnText.textContent = 'Try Again';
    }
  });

});
