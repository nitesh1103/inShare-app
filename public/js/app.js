const fileInput = document.querySelector('#fileInput');
const browseBtn = document.querySelector('#browseBtn');
const fileDropZone = document.querySelector('.file-drop-zone');
const progressContEl = document.querySelector('.progress-container');
const progressBgEl = document.querySelector('.progress-background');
const percentCountEl = document.querySelector('.percentCount');
const progressBar = document.querySelector('.progress-bar');
const resultContainer = document.querySelector('.result-container');
const resultInput = document.querySelector('#resultInput');
const copyIcon = document.querySelector('.copy-box');
const emailForm = document.querySelector('#email-form');
const successAlertEl = document.querySelector('.success-alert');
let toastTimer = null;

const uploadUrl = '/api/files';
const emailUrl = '/api/files/send';

function browseFile() {
  fileInput.click();
};

function uploadFile(file) {
  // console.log(file);
  const formData = new FormData();
  formData.append('myFile', file);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    //console.log(xhr.readyState);
    if( xhr.readyState === XMLHttpRequest.DONE ) {
      //console.log(JSON.parse(xhr.response));
      showFileLink(JSON.parse(xhr.response));
    };
  };

  xhr.upload.onprogress = updateProgress;
  xhr.upload.onerror = () => {
    showSuccessAlert(`Error in upload: ${xhr.statusText}`);
  };

  xhr.open('POST', uploadUrl);
  xhr.send(formData);
};

function updateProgress(e) {
  const percentage = Math.round((e.loaded / e.total) * 100);
  // console.log(percentage);
  progressContEl.style.display = 'block';
  progressBgEl.style.width = `${percentage}%`;
  percentCountEl.innerText = `${percentage}%`;
  progressBar.style.width = `${percentage}%`;
};

function showFileLink({ file }) {
  //console.log(file);
  progressContEl.style.display = 'none';
  resultContainer.style.display = 'block';
  resultInput.value = file;
  emailForm[2].removeAttribute('disabled');
};

function copyFileUrl() {
  resultInput.select();
  document.execCommand('copy');
  showSuccessAlert('Copied to Clipboard');
};

function showSuccessAlert(successMsg) {
  successAlertEl.innerText = successMsg;
  successAlertEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => successAlertEl.classList.remove('show'), 2000);
};

fileInput.addEventListener('change', () => {
  const FILE = fileInput.files[0];
  //console.log(FILE);
  uploadFile(FILE);
});

fileDropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  if( !fileDropZone.classList.contains('dragged') ) {
    fileDropZone.classList.add('dragged');
  };
});

fileDropZone.addEventListener('dragleave', () => {
  if( fileDropZone.classList.contains('dragged') ) {
    fileDropZone.classList.remove('dragged');
  };
});

fileDropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  if( fileDropZone.classList.contains('dragged') ) {
    fileDropZone.classList.remove('dragged');
  };
  const files = e.dataTransfer.files;
  //console.log(files);
  if( files.length > 0 ) {
    fileInput.files = files;
    //console.log(fileInput.files[0]);
    uploadFile(fileInput.files[0]);
  };
});

browseBtn.addEventListener('click', browseFile);
copyIcon.addEventListener('click', copyFileUrl);

emailForm.addEventListener('submit', (e) => {
  e.preventDefault();
  //console.log('submited');
  const fileUrl = resultInput.value;
  // console.log(fileUrl);
  const uuid = fileUrl.split('/')[4];
  // console.log(uuid);

  const formObject = {
    uuid: uuid,
    emailFrom: emailForm.elements['emailFrom'].value,
    emailTo: emailForm.elements['emailTo'].value
  };
  // console.log(formObject);
  emailForm[0].value = '';
  emailForm[1].value = '';
  emailForm[2].setAttribute('disabled', 'true');

  // Sending POST req using fetch.
  fetch(emailUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formObject)
  })
  .then((res) => res.json())
  .then((data) => {
    // console.log(data);
    if( data.success ) {
      resultContainer.style.display = 'none';
      showSuccessAlert('Email Sent');
    };
  })
  .catch((err) => console.log(err));
});



