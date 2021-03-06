var Cr = {
  elm: function (a, b, c, d) {
    var e;
    if (
      a.length < 1 ||
      a.indexOf(" ") > -1 ||
      a.indexOf("&") > -1 ||
      a.indexOf("%") > -1
    ) {
      e = document.createTextNode(this.unescapeHtml(a.replace(/^\s+/, "")));
      if (!b && !c && d) {
        d.appendChild(e);
        return e;
      }
    } else e = document.createElement(a);
    if (b) {
      if (b["class"] && !b["className"]) e.className = b["class"];
      if (b["style"]) e.style.cssText = b["style"];
      if (b.loadevent || b.loadevents) {
        var f = b.loadevent || b.loadevents;
        if (typeof f[0] == "string")
          this.registerEventListener(e, f[0], f[1], f[2]);
        else if (f.length)
          for (z in f) this.registerEventListener(e, f[z][0], f[z][1], f[z][2]);
      }
    }
    for (i in b) {
      if (i.substring(0, 5) == "event") {
        if (typeof b[i][0] == "string") this.pendingListenrs.push([e, [b[i]]]);
        else this.pendingListenrs.push([e, b[i]]);
      } else if (i.substring(0, 9) == "loadevent") {
      } else if (i == "checked" || i == "selected") {
        if (b[i]) e.setAttribute(i, i);
      } else e.setAttribute(i, b[i]);
    }
    if (c) {
      for (i = 0, l = c.length; i < l; i++) {
        if (c[i]) e.appendChild(c[i]);
      }
    }
    if (d) {
      this.insertNode(e, d);
    }
    return e;
  },
  txt: function (a) {
    return document.createTextNode(a);
  },
  ent: function (a) {
    return document.createTextNode(this.unescapeHtml(a.replace(/^\s+/, "")));
  },
  paragraphs: function (a) {
    var b = a.split("\n");
    var c = [];
    for (var i = 0, l = b.length; i < l; i++) {
      c.push(Cr.ent(b[i]));
      c.push(Cr.elm("br"));
      c.push(Cr.elm("br"));
    }
    return c;
  },
  appendChildElement: function (a, b) {
    a.appendChild(b);
    this.addListeners();
  },
  insertNode: function (a, b, c) {
    if (!b) b = document.body;
    if (c && c.parentNode == b) {
      b.insertBefore(a, c);
    } else {
      b.appendChild(a);
    }
    this.addListeners();
  },
  addListeners: function () {
    for (i in this.pendingListenrs) {
      for (z in this.pendingListenrs[i][1]) {
        this.registerEventListener(
          this.pendingListenrs[i][0],
          this.pendingListenrs[i][1][z][0],
          this.pendingListenrs[i][1][z][1],
          this.pendingListenrs[i][1][z][2]
            ? this.pendingListenrs[i][1][z][2]
            : false
        );
      }
    }
    this.pendingListenrs = [];
  },
  registerEventListener: function (a, b, c, d) {
    if (typeof a.addEventListener == "function") {
      a.addEventListener(b, c, d);
    } else if (a.attachEvent) {
      if (!a._listeners) a._listeners = [];
      if (!a._listeners[b]) a._listeners[b] = [];
      var e = function () {
        c.apply(a, []);
      };
      a._listeners[b][c] = e;
      a.attachEvent("on" + b, e);
    }
  },
  unescapeHtml: function (a) {
    if (a.length < 1) return a;
    var b = document.createElement("div");
    b.innerHTML = a;
    var c = b.childNodes[0].nodeValue;
    b.removeChild(b.firstChild);
    return c;
  },
  pendingListenrs: []
};
