// Initialize button with user's preferred color
//let addChorusLink = document.getElementById('addChorusLink');
const chorusUrl = document.querySelector('#chorusURL');

chrome.storage.sync.get('chorusId', ({ chorusId }) => {
  chorusUrl.innerHTML = chorusId;
});

document.querySelector('#go-to-options').addEventListener('click', function () {
  window.open(chrome.runtime.getURL('options.html'));
});
