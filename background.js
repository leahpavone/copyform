function ctxMenuOnClick(info, tab) {
  if (info.menuItemId == "copy_form") {
    chrome.tabs.sendMessage(tab.id, { copyform: true }, function (response) {
      if (response) {
        chrome.storage.local.set(
          { clipboard: JSON.stringify(response) },
          function () {
            console.log("Copied form successfully");
            chrome.contextMenus.update("paste_form", { enabled: true });
            chrome.contextMenus.update("clear_form_clipboard", {
              enabled: true
            });
          }
        );
      } else {
        console.log(
          "Sorry, you have to refresh the page before it will work when first installed."
        );
        alert(
          "Sorry, you have to refresh the page before it will work when first installed."
        );
      }
    });
  } else if (info.menuItemId == "paste_form") {
    chrome.storage.local.get("clipboard", function (obj) {
      var lastFormData = JSON.parse(obj.clipboard);
      lastFormData.pasteform = true;
      chrome.tabs.sendMessage(tab.id, lastFormData, function (response) {
        console.log("Pasted form successfully");
      });
    });
  } else if (info.menuItemId == "clear_form_clipboard") {
    chrome.storage.local.set({ clipboard: "{}" }, function () {
      chrome.contextMenus.update("paste_form", { enabled: false });
      chrome.contextMenus.update("clear_form_clipboard", { enabled: false });
    });
  }
}

chrome.contextMenus.onClicked.addListener(ctxMenuOnClick);

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: "Copy Form",
    id: "copy_form",
    contexts: ["editable"]
  });
  chrome.contextMenus.create({
    title: "Paste Form",
    id: "paste_form",
    contexts: ["editable"],
    enabled: false
  });
  chrome.contextMenus.create({
    title: "Clear Form Clipboard",
    id: "clear_form_clipboard",
    contexts: ["editable"],
    enabled: false
  });
});
