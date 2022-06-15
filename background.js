chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('chorusId', ({ chorusId }) => {
    chorusId = chorusId !== undefined ? chorusId : '';
    chrome.storage.sync.set({ chorusId });
  });
});

const addListenerForGoogleCalendar = (details) => {
  if (/calendar.google.com.*\/eventedit[^/]*/i.test(details.url)) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        execute_addChorusButtonToEvent: true,
      });
    });
  }
};

chrome.webNavigation.onCompleted.addListener((details) => addListenerForGoogleCalendar(details));
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => addListenerForGoogleCalendar(details));
