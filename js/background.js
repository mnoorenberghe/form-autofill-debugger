/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function copyToClipboard(str, mimetype) {
  document.oncopy = function(event) {
    event.clipboardData.setData(mimetype, str);
    event.preventDefault();
  };
  document.execCommand("Copy", false, null);
}


chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.executeScript({
    file: 'js/content_script.js',
  },function callback(result) {
    let output = "";
    let pageResult = JSON.parse(result[0]); // Selected tab's result
    console.log(pageResult);
    for (let field of pageResult.fields) {
      let columns = [];
      columns.push(pageResult.url);
      let heuristicInfo = [];

      for (let propName of Object.keys(field.properties)) {
        let propVal = field.properties[propName];
        columns.push(JSON.stringify(propVal));
      }

      for (let attrName of Object.keys(field.attributes)) {
        let attrVal = field.attributes[attrName];
        if (attrName == "title" && attrVal && attrVal.includes("overall type: ")) {
          for (let line of attrVal.split("\n")) {
            heuristicInfo.push(line.replace(/^[^:]*: /, ""));
          }
          columns.push(JSON.stringify(attrVal.replace(/overall type: [^]*/, "")));
          continue;
        }
        columns.push(JSON.stringify(attrVal));
      }

      output += columns.join("|") + "|" + heuristicInfo.join("|") + "\n";
    }
    console.log(output);
    copyToClipboard(output, "text/plain");
    alert("Data has been copied to your clipboard");
  });
});
