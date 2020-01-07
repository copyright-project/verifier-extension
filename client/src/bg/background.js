const fetchImage = url => {
  return fetch('http://localhost:5678', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify({ url })
  })
    .then(res => res.json())
    .then(res => res[0])
};

const processImage = (url, replyFn) => {
  chrome.storage.local.get(url, (items) => {
    if (items[url]) {
      return replyFn(url, items[url])
    }
    fetchImage(url)
      .then(res => {
        if (res.length > 0) {
          replyFn(url, res)
          chrome.storage.local.set({ [url]: res });
        }
      });
  });
};

const reply = (port, url, data) => {
  port.postMessage(JSON.stringify({
    [url]: data
  }));
};


chrome.runtime.onConnect.addListener((port) => {
  const replyFn = reply.bind(null, port);
  port.onMessage.addListener((images) => {
    images.forEach(url => processImage(url, replyFn))
  });
});
