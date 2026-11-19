"use strict";
(function () {
  var ids = ["load", "limit", "ratio", "len"];
  function build() {
    var q = [];
    var len = document.getElementById("len").value, load = document.getElementById("load").value;
    var limit = document.getElementById("limit").value, ratio = document.getElementById("ratio").value;
    if (len) q.push("debug=1");
    if (load) q.push("load=" + load);
    if (ratio) q.push("ratio=" + ratio);
    q.push("limit=" + limit);
    var url = "/study/?" + q.join("&");
    document.getElementById("go").setAttribute("href", url);
    document.getElementById("url").textContent = location.origin + url;
  }
  ids.forEach(function (id) { document.getElementById(id).addEventListener("change", build); });
  build();
})();
