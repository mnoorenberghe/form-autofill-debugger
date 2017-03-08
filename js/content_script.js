/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function contentScript() {
  let FIELD_PROPERTY_NAMES = [
    "localName",
  ];
  let FIELD_ATTRIBUTE_NAMES = [
    "autocomplete",
    "id",
    "maxlength",
    "minlength",
    "name",
    "pattern",
    "title",
    "type",
  ];

  let result = {
    url: window.location.href,
    fields: [],
  };

  for (let el of document.querySelectorAll("input, select, textarea, button")) {
    let fieldInfo = {
      attributes: {},
      properties: {},
    };

    for (let attrName of FIELD_ATTRIBUTE_NAMES) {
      let attrVal = el.getAttribute(attrName);
      fieldInfo.attributes[attrName] = attrVal;
    }

    for (let propName of FIELD_PROPERTY_NAMES) {
      let propVal = el[propName];
      fieldInfo.properties[propName] = typeof(propVal) === "undefined" ? null : propVal;
    }

    result.fields.push(fieldInfo);
  }
  return result;
}

var result = contentScript();

console.log(result);
// return value:
JSON.stringify(result);
