// Reacts to a button click by marking the selected button and saving
// the selection
/* function handleButtonClick(event) {
  // Remove styling from the previously selected color
  let current = event.target.parentElement.querySelector(`.${selectedClassName}`);
  if (current && current !== event.target) {
    current.classList.remove(selectedClassName);
  }

  // Mark the button as selected
  let color = event.target.dataset.color;
  event.target.classList.add(selectedClassName);
  chrome.storage.sync.set({ color });
} */

// Add a button to the page for each supplied color
function constructOptions() {
  console.log('construct');
  chrome.storage.sync.get('chorusId', ({ chorusId }) => {
    console.log('chorusId', chorusId);
    const input = document.querySelector('#chorusInput');
    input.value = chorusId;
    input.addEventListener('keyup', () => {
      const chorusId = input.value;
      console.log('set id', chorusId);
      chrome.storage.sync.set({ chorusId });
    });
  });
}

// Initialize the page by constructing the color options
constructOptions();
