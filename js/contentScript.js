const MUTE_BTN_SELECTOR = "div.mui-style-bizjqu-buttonControlsLeft > div > button";
const AD_DIV_SELECTOR = "div > div.mui-style-5kj990-adTag";

let isAdMuteEnabled = true;

function toggleMuteState(muteButton, muteState) {
  if (muteButton && muteButton.ariaLabel === (muteState ? "Mute" : "Unmute")) {
    muteButton.click();
  }
}

// Initializes the ad mute feature by setting up listeners and intervals
function initAdMuteFeature() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    isAdMuteEnabled = request.adMuteIsEnabled;
  });

  chrome.storage.local.get('adMuteIsEnabled', (data) => {
    isAdMuteEnabled = data.adMuteIsEnabled !== undefined ? data.adMuteIsEnabled : true;
  });

  const checkForAds = () => {
    if (!isAdMuteEnabled) return;
    const muteBtn = document.querySelector(MUTE_BTN_SELECTOR);
    if (!muteBtn) return;

    let isAdRunning = false;

    setInterval(() => {
      const adDiv = document.querySelector(AD_DIV_SELECTOR);
      if (adDiv) {
        if (!isAdRunning) {
          isAdRunning = true;
          toggleMuteState(muteBtn, true);
        }
      } else if (isAdRunning) {
        // Gap b/w each ad is somewhat around 8 seconds, where ad-div may not be found
        setTimeout(() => {
          if (!document.querySelector(AD_DIV_SELECTOR)) {
            isAdRunning = false;
            toggleMuteState(muteBtn, false);
          }
        }, 8000);
      }
    }, 500);
  };

  const adDetectionInterval = setInterval(() => {
    if (document.readyState === 'complete') {
      checkForAds();
      clearInterval(adDetectionInterval);
    }
  }, 2000);
}

// Initialize ad mute feature when the document is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdMuteFeature);
} else {
  initAdMuteFeature();
}
