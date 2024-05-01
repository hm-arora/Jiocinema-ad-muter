document.addEventListener('DOMContentLoaded', function () {
  const checkbox = document.getElementById('checkbox');
  chrome.storage.local.get('adMuteIsEnabled', function (data) {
    // Set checkbox to true by default if adMuteIsEnabled is not found or is true
    checkbox.checked = data.adMuteIsEnabled !== undefined ? data.adMuteIsEnabled : true;
  });
  checkbox.addEventListener('change', function () {
    (async () => {
      const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      const response = await chrome.tabs.sendMessage(tab.id, { adMuteIsEnabled: this.checked });
      console.log(response); // Use response within async function
    })();
    chrome.storage.local.set({ 'adMuteIsEnabled': this.checked });
  });
});
