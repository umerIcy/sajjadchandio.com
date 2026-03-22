/**
 * Shared serialization for #erForm (endoscopy, colonoscopy, sigmoidoscopy reports).
 * Saves every field with an id + radio groups + uploaded image data URLs.
 */
(function (global) {
  "use strict";

  function getForm() {
    return document.getElementById("erForm");
  }

  /**
   * @param {Array<{name:string,data:string}>} uploadedImages
   * @returns {{ __ehr: number, fields: Object, radios: Object, images: Array }}
   */
  function serializeErForm(uploadedImages) {
    var form = getForm();
    var fields = {};
    var radios = {};

    if (!form) {
      return { __ehr: 1, fields: fields, radios: radios, images: cloneImages(uploadedImages) };
    }

    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      var id = el.id;
      var type = (el.type || "").toLowerCase();

      if (type === "radio") {
        if (el.name && el.checked) radios[el.name] = el.value;
        return;
      }
      if (type === "checkbox") {
        if (id) fields[id] = el.checked;
        return;
      }
      if (type === "file" || type === "button" || type === "submit" || type === "reset") return;
      if (id) fields[id] = el.value;
    });

    return {
      __ehr: 1,
      fields: fields,
      radios: radios,
      images: cloneImages(uploadedImages)
    };
  }

  function cloneImages(arr) {
    if (!arr || !arr.length) return [];
    return arr.map(function (img) {
      return { name: img.name || "image", data: img.data || "" };
    });
  }

  /**
   * @param {object} values - payload from DB or serializeErForm
   * @param {{ uploadedImagesRef?: Array }} options - mutates uploadedImagesRef in place
   */
  function applyErForm(values, options) {
    options = options || {};
    var ref = options.uploadedImagesRef;
    var form = getForm();
    values = values || {};

    var fields = values.fields;
    var radios = values.radios || {};

    if (!fields) {
      fields = {};
      Object.keys(values).forEach(function (k) {
        if (k === "images" || k === "radios" || k === "__ehr" || k === "fields") return;
        fields[k] = values[k];
      });
    }

    if (ref && Array.isArray(values.images)) {
      ref.length = 0;
      values.images.forEach(function (im) {
        ref.push({ name: im.name || "image", data: im.data || "" });
      });
    }

    if (!form) return;

    Object.keys(fields).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var type = (el.type || "").toLowerCase();
      if (type === "checkbox") {
        el.checked = !!fields[id];
      } else if (type !== "radio") {
        el.value = fields[id] != null ? String(fields[id]) : "";
      }
    });

    Object.keys(radios).forEach(function (name) {
      var val = radios[name];
      form.querySelectorAll('input[type="radio"][name="' + cssEscapeName(name) + '"]').forEach(function (r) {
        r.checked = r.value === String(val);
      });
    });
  }

  /** Escape for use inside [name="..."] */
  function cssEscapeName(name) {
    return String(name).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  }

  global.EHR = {
    serializeErForm: serializeErForm,
    applyErForm: applyErForm
  };
})(window);
