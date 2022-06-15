const addChorusButtonToEvent = (callCount = 0) => {
  if (!/calendar.google.com.*\/eventedit[^/]*/i.test(window.location.toString())) {
    return;
  }

  const zoomBtnContainer = document.querySelector('.zoom-video-sec');
  // DOM loading might be delayed, so retry 10 times with some backoff.
  if (callCount < 10 && zoomBtnContainer === null) {
    window.setTimeout(function () {
      addChorusButtonToEvent(callCount + 1);
    }, 200);
    return;
  }

  if (zoomBtnContainer === null) {
    console.error("No 'Make it a Zoom meeting' button found on the page");
  }

  const chorusBtnContainer = document.querySelector('.chorus-video-sec');
  if (chorusBtnContainer !== null) {
    return;
  }

  // Create chorus icon.
  const icon = document.createElement('span');
  icon.className = 'DPvwYc chorusLogo';
  const iconWrapper = document.createElement('div');
  iconWrapper.className = 'tzcF6';
  iconWrapper.appendChild(icon);

  // Set the chorus button link.
  const chorusBtn = createChorusButton();

  // Create chorus wrapper.
  const chorusBtnWrapper = document.createElement('div');
  chorusBtnWrapper.id = 'chorus-video-sec';
  chorusBtnWrapper.className = 'FrSOzf chorus-video-sec';
  chorusBtnWrapper.appendChild(iconWrapper);
  chorusBtnWrapper.appendChild(chorusBtn);

  zoomBtnContainer.insertAdjacentElement('afterEnd', chorusBtnWrapper);

  // Add event listeners.
  setEventListeners();
};

const setCalendarLocation = (text) => {
  const locationEl = getLocationElement();
  locationEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  locationEl.focus();
  for (const type of ['keydown', 'keypress', 'keyup']) {
    locationEl.dispatchEvent(new KeyboardEvent(type));
  }

  // @todo check for a better way to update this element
  const elToChange = locationEl.parentNode.parentNode.parentNode.parentNode;
  if (text !== '') {
    elToChange.classList.add('CDELXb');
  } else {
    elToChange.classList.remove('CDELXb');
  }

  locationEl.dataset.initialValue = text;
  locationEl.value = text;
  locationEl.dispatchEvent(new MouseEvent('input', { bubbles: true }));
  locationEl.blur();

  const chorusBtnWrapper = document.querySelector('.chorus-btn');

  // Replace chorus button with action - create/ join.
  const chorusBtn = createChorusButton();
  chorusBtnWrapper.replaceWith(chorusBtn);

  // Add event listeners.
  setEventListeners();
};

const getLocationElement = () => document.querySelector('[aria-label="Location"]');

const createAddChorusButton = () => {
  const addBtn = document.createElement('button');
  addBtn.id = 'chorus-schedule_button';
  addBtn.className = 'btn-meeting';
  addBtn.innerHTML = 'Make it a Chorus Meeting';
  const addBtnWrapper = document.createElement('div');
  addBtnWrapper.id = 'chorus-schedule_button-wrapper';
  addBtnWrapper.appendChild(addBtn);
  return addBtnWrapper;
};

const createJoinChorusButton = (chorusMeetingUrl) => {
  const joinBtnWrapper = document.createElement('div');
  joinBtnWrapper.style = 'display:flex';
  const joinLink = document.createElement('a');
  joinLink.id = 'chorus_schedule_meeting_url';
  joinLink.className = 'btn-meeting hideme';
  joinLink.target = '_blank';
  joinLink.href = chorusMeetingUrl;
  joinLink.style = 'display:inline';
  joinLink.innerHTML = 'Join Chorus Meeting';
  const joinLinkRemoveIcon = document.createElement('i');
  joinLinkRemoveIcon.className = 'icon-trash';
  joinLinkRemoveIcon.title = 'Remove Chorus Meeting';
  joinBtnWrapper.appendChild(joinLink);
  joinBtnWrapper.appendChild(joinLinkRemoveIcon);
  return joinBtnWrapper;
};

const createChorusButton = () => {
  const locationEl = getLocationElement();
  const hasChorusMeetingUrl = locationEl.value !== '' && locationEl.value.indexOf('go.chorus.ai') > -1;
  const chorusMeetingUrl = hasChorusMeetingUrl ? locationEl.value : null;

  // Create add chorus button.
  const addBtnWrapper = createAddChorusButton();
  // Create join chorus link.
  const joinBtnWrapper = createJoinChorusButton(chorusMeetingUrl);

  const btnWrapper = document.createElement('div');
  btnWrapper.className = 'j3nyw PxPKzc chorus-btn';
  btnWrapper.appendChild(hasChorusMeetingUrl ? joinBtnWrapper : addBtnWrapper);
  return btnWrapper;
};

const setEventListeners = () => {
  const chorusBtn = document.querySelector('#chorus-schedule_button');
  if (chorusBtn !== null) {
    chorusBtn.addEventListener('click', () => {
      chrome.storage.sync.get('chorusId', ({ chorusId }) => {
        setCalendarLocation(`https://go.chorus.ai/${chorusId}`);
      });
    });
  }

  const chorusRemoveBtn = document.querySelector('.chorus-btn i');
  if (chorusRemoveBtn !== null) {
    chorusRemoveBtn.addEventListener('click', () => {
      setCalendarLocation('');
    });
  }
};

// @todo add button to popup window when adding/ editing event
chrome.runtime.onMessage.addListener(function (request) {
  if (request.execute_addChorusButtonToEvent == true) {
    addChorusButtonToEvent(0);
  }
});
