const viewChorusEl = document.querySelector('#viewChorusId');
const editChorusEl = document.querySelector('#editChorusId');

const chorusUrl = document.querySelector('#chorusURL');
const chorusUrlInput = document.querySelector('#chorusInput');
let myChorusId = '';

chrome.storage.sync.get('chorusId', ({ chorusId }) => {
  console.log('chorusId', chorusId);
  if (chorusId !== '') {
    console.log('show the current link');
    viewChorusEl.classList.remove('hideme');
    editChorusEl.classList.add('hideme');
    setChorusIdDisplayValue(chorusId);
  } else {
    console.log('no current link');
    viewChorusEl.classList.add('hideme');
    editChorusEl.classList.remove('hideme');
  }
});

document.querySelector('#editChorusBtn').addEventListener('click', () => {
  viewChorusEl.classList.add('hideme');
  editChorusEl.classList.remove('hideme');
  chorusUrlInput.value = myChorusId;
});

document.querySelector('#saveChorusBtn').addEventListener('click', () => {
  const chorusId = chorusUrlInput.value;
  console.log('set id', chorusId);
  chrome.storage.sync.set({ chorusId });
  setChorusIdDisplayValue(chorusId);

  viewChorusEl.classList.remove('hideme');
  editChorusEl.classList.add('hideme');
});

document.querySelector('#cancelChorusBtn').addEventListener('click', () => {
  viewChorusEl.classList.remove('hideme');
  editChorusEl.classList.add('hideme');
});

function setChorusIdDisplayValue(chorusId) {
  myChorusId = chorusId;
  chorusUrl.innerHTML = chorusId;
}
