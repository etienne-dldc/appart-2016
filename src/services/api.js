export function fromUser(userId) {
  return fetch('/api/from/' + userId)
  .then(function (response) {
    if (response.ok) {
      return response.json()
    }
    return false
  })
  .catch(function (ex) {
    console.error('parsing failed', ex)
    return false;
  })
  .then(function (response) {
    if (response.success === true) {
      return response.data
    } else {
      throw new Error(response.error ? response.error : 'Oops :/');
    }
  })
}

export function postUser(data) {
  return fetch('/api', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(function (response) {
    if (response.ok) {
      return response.json()
    }
    return false
  })
  .catch(function (ex) {
    console.error('parsing failed', ex)
    return false;
  })
  .then(function (response) {
    if (response.success === true) {
      return response.data
    } else {
      throw new Error(response.error ? response.error : 'Oops :/');
    }
  })
}
