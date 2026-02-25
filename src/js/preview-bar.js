(function () {
  var cfg = window.__previewBar;
  if (!cfg) return;

  var BAR_H = 54;

  var bar = document.createElement('div');
  bar.id = 'wb-preview-bar';
  bar.innerHTML =
    '<div class="wb-pb-left">' +
      '<a href="/templates/" class="wb-pb-back">&#8592; Templates</a>' +
      '<span class="wb-pb-name">' + cfg.name + '</span>' +
    '</div>' +
    '<div class="wb-pb-right">' +
      cfg.tiers.map(function (t) {
        return '<a href="' + t.url + '" target="_blank" rel="noopener" class="wb-pb-btn wb-pb-btn--' + t.label.toLowerCase() + '">' +
          '<span class="wb-pb-tier">' + t.label + '</span>' +
          '<span class="wb-pb-price">' + t.price + '</span>' +
        '</a>';
      }).join('') +
    '</div>';

  var style = document.createElement('style');
  style.textContent =
    '#wb-preview-bar{position:fixed;top:0;left:0;right:0;height:' + BAR_H + 'px;' +
      'background:#111;border-bottom:1px solid #222;display:flex;align-items:center;' +
      'justify-content:space-between;padding:0 20px;z-index:999999;' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-sizing:border-box;}' +
    '.wb-pb-left{display:flex;align-items:center;gap:16px;}' +
    '.wb-pb-back{color:#888;font-size:13px;text-decoration:none;white-space:nowrap;transition:color .2s;}' +
    '.wb-pb-back:hover{color:#fff;}' +
    '.wb-pb-name{color:#fff;font-size:13px;font-weight:600;white-space:nowrap;}' +
    '.wb-pb-right{display:flex;align-items:center;gap:8px;}' +
    '.wb-pb-btn{display:flex;flex-direction:column;align-items:center;padding:6px 14px;' +
      'border-radius:7px;text-decoration:none;transition:all .2s;border:1px solid #2e2e2e;' +
      'min-width:72px;background:#181818;}' +
    '.wb-pb-btn:hover{border-color:#4F8EF7;background:rgba(79,142,247,.1);}' +
    '.wb-pb-tier{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#888;}' +
    '.wb-pb-price{font-size:14px;font-weight:700;color:#fff;}' +
    '.wb-pb-btn:hover .wb-pb-price{color:#4F8EF7;}' +
    '@media(max-width:600px){' +
      '.wb-pb-name{display:none;}' +
      '.wb-pb-btn{min-width:60px;padding:5px 10px;}' +
    '}';

  document.head.appendChild(style);
  document.body.style.paddingTop = BAR_H + 'px';
  document.body.insertBefore(bar, document.body.firstChild);
})();
