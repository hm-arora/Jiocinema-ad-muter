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
  
    const observer = new MutationObserver((mutationsList, observer) => {
      for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const adDiv = document.querySelector(AD_DIV_SELECTOR);
          if (adDiv) {
            toggleMuteState(muteBtn, true);
          } else {
            setTimeout(() => {
              if (!document.querySelector(AD_DIV_SELECTOR)) {
                toggleMuteState(muteBtn, false);
              }
            }, 8000);
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
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
