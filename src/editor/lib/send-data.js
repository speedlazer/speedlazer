// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
export const DataSendError = function(message, xhr) {
  this.name = "DataSendError";
  this.message = message || "Default Message";
  this.xhr = xhr;
  this.stack = new Error().stack;
};
DataSendError.prototype = Object.create(Error.prototype);
DataSendError.prototype.constructor = DataSendError;

export const sendData = (url, data, options = {}) =>
  new Promise((resolve, reject) => {
    const contentType = options.contentType || "application/json";
    const xhr = new XMLHttpRequest();
    const method = options.method || "POST";

    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        if (this.responseText && this.responseText.length > 2) {
          resolve(JSON.parse(this.responseText));
        } else {
          resolve();
        }
      } else {
        reject(new DataSendError(this.responseText, this));
      }
    };
    xhr.onerror = function() {
      reject(new DataSendError(this.responseText, this));
    };
    xhr.send(data ? JSON.stringify(data) : undefined);
  });
