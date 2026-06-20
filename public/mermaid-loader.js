/**
 * Mermaid 图表加载器
 * 从 CDN 加载 mermaid@11，渲染页面中的 .mermaid div
 */
(function () {
  var primaryCDN = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  var fallbackCDN = 'https://unpkg.com/mermaid@11/dist/mermaid.esm.min.mjs';

  function loadMermaid(url) {
    return import(url)
      .then(function (mod) {
        return mod.default || mod;
      })
      .catch(function (err) {
        // 主 CDN 失败时尝试回退 CDN
        if (url === primaryCDN && fallbackCDN) {
          console.warn('Mermaid 主 CDN 加载失败，尝试备用 CDN...');
          return loadMermaid(fallbackCDN);
        }
        throw err;
      });
  }

  function init() {
    var containers = document.querySelectorAll('.mermaid');
    if (containers.length === 0) return; // 页面无 Mermaid 图，不加载 CDN

	    loadMermaid(primaryCDN)
	      .then(function (mermaid) {
	        mermaid.initialize({ startOnLoad: false, theme: 'default' });
	        return mermaid.run({ querySelector: '.mermaid' });
	      })
	      .then(function () {
	        // Mermaid 渲染完成，恢复锚点——此时页面高度已稳定，一次定位到位
	        if (window.__savedHash) {
	          requestAnimationFrame(function () {
	            window.location.hash = window.__savedHash.slice(1);
	          });
	        }
	      })
      .catch(function () {
        console.warn('Mermaid CDN 加载失败，流程图将不显示');
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
