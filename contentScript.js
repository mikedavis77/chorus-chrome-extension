function addChorusButtonToEvent(callCount = 0) {
  // Note that we anchor the regexp at end to make sure there is no '/' after '/eventedit'
  // in URL. This is to avoid clicking on the button when editing an existing event.
  // TODO: We can make this an optional feature - show user a prompt maybe when editing ?
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
        console.log('already have chrous button');
        return;
      }

      const locationEl = document.querySelector('[aria-label="Location"]');
      const hasChorusMeetingUrl = locationEl.value !== '' && locationEl.value.indexOf('go.chorus.ai') > -1;
      const chorusMeetingUrl = hasChorusMeetingUrl ? locationEl.value : null;
      const addButtonHTML = `<div class="j3nyw PxPKzc chorus-btn chorus-button-container">
      <div id="chorus-schedule_button-wrapper">
        <button id="chorus-schedule_button" class="btn-meeting">Make it a Chorus Meeting</button>
      </div>
    </div>`;
      const joinButtonHTML = `<div class="j3nyw PxPKzc chorus-btn">
    <a id="chorus_schedule_meeting_url" class="btn-meeting hideme" target="_blank" href="${chorusMeetingUrl}" style="display: inline;">
      Join Chorus Meeting
    </a>
    <i class="icon-trash" title="Remove Chorus Meeting" aria-label="Remove Chorus Meeting"></i>
  </div>`;

      zoomBtnContainer.insertAdjacentHTML(
        'afterEnd',
        `<div id="chorus-video-sec" class="FrSOzf chorus-video-sec">
    <div aria-hidden="true" class="tzcF6">
      <span class="DPvwYc chorusLogo" aria-hidden="true"></span>
    </div>
    ${hasChorusMeetingUrl ? joinButtonHTML : addButtonHTML}
  </div>`
      );

      const chorusBtn = document.querySelector('#chorus-schedule_button');
      if (chorusBtn !== null) {
        chorusBtn.addEventListener('click', () => {
          chrome.storage.sync.get('chorusId', ({ chorusId }) => {
            const chorusBasedomin = 'https://go.chorus.ai/';
            setCalendarLocation(locationEl, chorusBasedomin + chorusId);
            /* locationEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            locationEl.focus();
            for (const type of ['keydown', 'keypress', 'keyup']) {
              locationEl.dispatchEvent(new KeyboardEvent(type));
            }
            locationEl.parentNode.parentNode.parentNode.parentNode.classList.add('CDELXb');
            const chorusLink = chorusBasedomin + chorusId;
            locationEl.dataset.initialValue = chorusLink;
            locationEl.value = chorusLink;
            locationEl.dispatchEvent(new MouseEvent('input', { bubbles: true })); */
          });
        });
      }

      const chorusRemoveBtn = document.querySelector('.chorus-btn i');
      if (chorusRemoveBtn !== null) {
        chorusRemoveBtn.addEventListener('click', () => {
          setCalendarLocation(locationEl, '');
          /* locationEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          locationEl.focus();
          for (const type of ['keydown', 'keypress', 'keyup']) {
            locationEl.dispatchEvent(new KeyboardEvent(type));
          }
          locationEl.parentNode.parentNode.parentNode.parentNode.classList.remove('CDELXb');
          locationEl.dataset.initialValue = '';
          locationEl.value = '';
          locationEl.dispatchEvent(new MouseEvent('input', { bubbles: true }));
          locationEl.blur(); */
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
}

addChorusButtonToEvent(0);
console.log('contnetSCript loaded');
chrome.runtime.onMessage.addListener(function (request) {
  if (request.execute_addChorusButtonToEvent == true) {
    addChorusButtonToEvent(0);
  }
});
