chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  var active = document.activeElement;
  var parentForm = active.parentNode || active;
  while (parentForm.nodeName != "FORM") {
    parentForm = parentForm.parentNode;
  }
  if (request.pasteform) {
    delete request.pasteform;
    for (i in request) {
      var vals = request[i];
      var valsIsArray = typeof vals == "object";
      var elms = parentForm.querySelectorAll("[name='" + i + "']"),
        n,
        v;
      for (var frmelm = 0, l = elms.length; frmelm < l; frmelm++) {
        n = elms[frmelm];
        v = valsIsArray ? vals[frmelm] : vals;
        typeof v;
        if (n) {
          if (n.type == "checkbox") {
            n.checked = v;
          } else n.value = v;
        }
      }
    }
    sendResponse({});
  } else if (request.copyform) {
    var resp = {};
    resp = appendFrmElms(resp, parentForm.getElementsByTagName("input"));
    resp = appendFrmElms(resp, parentForm.getElementsByTagName("select"));
    resp = appendFrmElms(resp, parentForm.getElementsByTagName("textarea"));
    sendResponse(resp);
  }
});

function appendFrmElms(resp, formElms) {
  for (var f = 0, l = formElms.length; f < l; f++) {
    var newValue = null;
    if (formElms[f].type == "hidden") {
      //skip
    } else if (formElms[f].type == "checkbox") {
      newValue = formElms[f].checked;
    } else {
      newValue = formElms[f].value;
    }

    if (newValue !== null) {
      if (resp[formElms[f].name]) {
        if (typeof resp[formElms[f].name] != "object") {
          resp[formElms[f].name] = [resp[formElms[f].name]];
        }
        resp[formElms[f].name].push(newValue);
      } else {
        resp[formElms[f].name] = newValue;
      }
    }
  }
  return resp;
}
