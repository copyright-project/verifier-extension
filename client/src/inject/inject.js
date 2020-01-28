const RIBBON_HTML = `
  <div class="ribbon ribbon-top-left">
    <span>registered</span>
  </div>
`
const port = chrome.runtime.connect({ name: "open-rights" });

const extractNewImages = () => {
  const images = document.querySelectorAll('main img[srcset]');
  const newImages = [...images].filter(node => node.dataset.openRights === undefined);
  newImages.forEach(node => node.dataset.openRights = 'processing');
  port.postMessage(newImages.map(node => node.src));
};

const observeImages = () => {
  return setInterval(extractNewImages, 500);
};

const readyStateCheckInterval = setInterval(() => {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval);
    observeImages();
  }
}, 10);

const toDateTimeString = timestamp => {
  const t = timestamp + '000';
  const t1 = Number(t);
  const t2 = new Date(t1);
  return t2.toLocaleString();
};

const buildTooltip = (data) => {
  const [_, timestamp, copyright] = data.split(',');
  
  return `
    Copyrights: ${copyright},
    Posted at: ${toDateTimeString(timestamp)}
  `;
};

const markAsRegistered = ([url, data]) => {
  const imgNode = document.querySelector(`main img[src="${url}"]`);
  imgNode.dataset.openRights = 'registered';
  const parentNode = imgNode.closest('a');
  parentNode.title = buildTooltip(data);
  parentNode.insertAdjacentHTML('beforeend', RIBBON_HTML);
};

port.onMessage.addListener(payload => {
  const message = JSON.parse(payload);
  Object.entries(message).forEach(markAsRegistered);
});
