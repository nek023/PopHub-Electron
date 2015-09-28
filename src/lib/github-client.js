import fetch from 'isomorphic-fetch';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

export default class GitHubClient {
  get(url) {
    let headers = {
      'Accept': 'application/json'
    };

    if (this.accessToken) {
      headers['Authorization'] = `token ${this.accessToken}`;
    }

    return fetch(url, {
      method: 'get',
      headers: headers
    })
      .then(checkStatus)
      .then(parseJSON);
  }

  post(url, params = {}) {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    if (this.accessToken) {
      headers['Authorization'] = `token ${this.accessToken}`;
    }

    return fetch(url, {
      method: 'post',
      headers: headers,
      body: JSON.stringify(params)
    })
      .then(checkStatus)
      .then(parseJSON);
  }

}
