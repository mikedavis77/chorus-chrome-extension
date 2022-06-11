function addChorusButtonToEvent(callCount = 0) {
  console.log('addChorusButtonToEvent', callCount);
  if (/calendar.google.com.*\/eventedit[^/]*/i.test(window.location.toString())) {
    console.log('found event page');
    const zoomBtnContainer = document.querySelector('.zoom-video-sec');
    // DOM loading might be delayed, so retry 5 times with some backoff.
    if (callCount < 5 && zoomBtnContainer === null) {
      window.setTimeout(function () {
        addChorusButtonToEvent(callCount + 1);
      }, 500);
      return;
    }

    if (zoomBtnContainer !== null) {
      const chorusBtnContainer = document.querySelector('.chorus-video-sec');
      if (chorusBtnContainer !== null) {
        // console.log('already have chrous button');
        return;
      }

      const locationEl = document.querySelector('[aria-label="Location"]');
      const hasChorusMeetingUrl = locationEl.value !== '' && locationEl.value.indexOf('go.chorus.ai') > -1;
      const chorusMeetingUrl = hasChorusMeetingUrl ? locationEl.value : null;

      // Create add chorus button. - repeated
      const addBtn = document.createElement('button');
      addBtn.id = 'chorus-schedule_button';
      addBtn.className = 'btn-meeting';
      addBtn.innerHTML = 'Make it a Chorus Meeting';
      const addBtnWrapper = document.createElement('div');
      addBtnWrapper.id = 'chorus-schedule_button-wrapper';
      addBtnWrapper.appendChild(addBtn);

      // Create join chorus link. - repeated
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

      // Replace chorus link with relevent button.
      const icon = document.createElement('span');
      icon.className = 'DPvwYc chorusLogo';
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'tzcF6';
      iconWrapper.appendChild(icon);

      // btn wrapper - repeated
      const btnWrapper = document.createElement('div');
      btnWrapper.className = 'j3nyw PxPKzc chorus-btn';
      btnWrapper.appendChild(hasChorusMeetingUrl ? joinBtnWrapper : addBtnWrapper);

      const mainWrapper = document.createElement('div');
      mainWrapper.id = 'chorus-video-sec';
      mainWrapper.className = 'FrSOzf chorus-video-sec';
      mainWrapper.appendChild(iconWrapper);
      mainWrapper.appendChild(btnWrapper);

      zoomBtnContainer.insertAdjacentElement('afterEnd', mainWrapper);

      // event listeners repeated
      const chorusBtn = document.querySelector('#chorus-schedule_button');
      if (chorusBtn !== null) {
        chorusBtn.addEventListener('click', () => {
          chrome.storage.sync.get('chorusId', ({ chorusId }) => {
            const chorusBasedomin = 'https://go.chorus.ai/';
            setCalendarLocation(locationEl, `${chorusBasedomin}${chorusId}`);
          });
        });
      }

      const chorusRemoveBtn = document.querySelector('.chorus-btn i');
      if (chorusRemoveBtn !== null) {
        chorusRemoveBtn.addEventListener('click', () => {
          setCalendarLocation(locationEl, '');
        });
      }
    } else {
      console.log("No 'Make it a Zoom meeting' button found on the page");
    }
  } else {
    console.log('no event match');
  }
}

function setCalendarLocation(locationEl, text) {
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

  const chorusBtnContainer = document.querySelector('.chorus-btn');
  const hasChorusMeetingUrl = locationEl.value !== '' && locationEl.value.indexOf('go.chorus.ai') > -1;
  const chorusMeetingUrl = hasChorusMeetingUrl ? locationEl.value : null;

  // Create add chorus button.
  const addBtn = document.createElement('button');
  addBtn.id = 'chorus-schedule_button';
  addBtn.className = 'btn-meeting';
  addBtn.innerHTML = 'Make it a Chorus Meeting';
  const addBtnWrapper = document.createElement('div');
  addBtnWrapper.id = 'chorus-schedule_button-wrapper';
  addBtnWrapper.appendChild(addBtn);

  // Create join chorus link.
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

  // Replace chorus link with relevent button.
  const btnWrapper = document.createElement('div');
  btnWrapper.className = 'j3nyw PxPKzc chorus-btn';
  btnWrapper.appendChild(hasChorusMeetingUrl ? joinBtnWrapper : addBtnWrapper);
  chorusBtnContainer.replaceWith(btnWrapper);

  // add button event listeners.
  const chorusBtn = document.querySelector('#chorus-schedule_button');
  if (chorusBtn !== null) {
    chorusBtn.addEventListener('click', () => {
      chrome.storage.sync.get('chorusId', ({ chorusId }) => {
        const chorusBasedomin = 'https://go.chorus.ai/';
        setCalendarLocation(locationEl, `${chorusBasedomin}${chorusId}`);
      });
    });
  }

  const chorusRemoveBtn = document.querySelector('.chorus-btn i');
  if (chorusRemoveBtn !== null) {
    chorusRemoveBtn.addEventListener('click', () => {
      setCalendarLocation(locationEl, '');
    });
  }
}

// @todo add button to popup window when adding/ editing event
//addChorusButtonToEvent(0);
// console.log('contnetScript loaded');
chrome.runtime.onMessage.addListener(function (request) {
  // console.log('onmessage listener', request);
  if (request.execute_addChorusButtonToEvent == true) {
    addChorusButtonToEvent(0);
  }
});
