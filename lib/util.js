const Homey = require('homey');
const http = require('http.min');


exports.sendGetCommand = function (endpoint, address) {
  return new Promise(function (resolve, reject) {
    http.get('http://'+ address + endpoint)
      .then(checkStatus)
      .then(res => JSON.parse(res))
      .then(json => {
        return resolve(json);
      })
      .catch(err => {
        return reject(err);
      });
  })
}

exports.sendPostCommand = function (endpoint, address, data) {
  return new Promise(function (resolve, reject) {
    http.post('http://'+ address + endpoint, data)
      .then(checkStatus)
      .then(res => JSON.parse(res))
      .then(json => {
        return resolve(json);
      })
      .catch(err => {
        return reject(err);
      });
  })
}

exports.sendGetCommandAuth = function (endpoint, address, user, pass) {
  if (user!='')
  {
    let auth = "Basic " + Buffer.from(user + ":" + pass).toString("base64");
    let opt = {
      uri : "http://"+address+endpoint,
      headers : {
          "Authorization" : auth
      }
    };
    return new Promise(function (resolve, reject) {
      http.get(opt)
        .then(checkStatus)
        .then(res => JSON.parse(res))
        .then(json => {
          return resolve(json);
        })
        .catch(err => {
          return reject(err);
        });
    })
  }
  else
  {
    return new Promise(function (resolve, reject) {
    http.get('http://'+ address + endpoint)
      .then(checkStatus)
      .then(res => JSON.parse(res))
      .then(json => {
        return resolve(json);
      })
      .catch(err => {
        return reject(err);
      });
    })
  }
}


function checkStatus(res) {
  if (res.response.statusCode==200) {
    return res.data;
  } else {
    throw new Error(res.response.statusCode);
  }
}