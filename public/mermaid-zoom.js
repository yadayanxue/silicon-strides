/**
 * Mermaid 图表点击放大 + 滚轮缩放
 */
(function () {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    var attempts = 0;
    var check = setInterval(function () {
      attempts++;
      var containers = document.querySelectorAll('.mermaid');
      var allRendered = containers.length > 0;
      containers.forEach(function (c) {
        if (!c.querySelector('svg')) allRendered = false;
      });
      if (allRendered) {
        clearInterval(check);
        setupZoom(containers);
      }
      if (attempts > 50) {
        clearInterval(check);
      }
    }, 200);
  }

  function setupZoom(containers) {
    containers.forEach(function (container) {
      container.style.cursor = 'zoom-in';
      container.addEventListener('click', function () {
        var svg = container.querySelector('svg');
        if (!svg) return;
        openOverlay(svg);
      });
    });
  }

  function openOverlay(svgEl) {
    var clone = svgEl.cloneNode(true);
    clone.removeAttribute('width');
    clone.removeAttribute('height');
    clone.style.maxWidth = 'none';

    document.body.style.overflow = 'hidden';

    var overlay = document.createElement('div');
    overlay.className = 'mermaid-overlay';

    var closeBtn = document.createElement('span');
    closeBtn.className = 'mermaid-close';
    closeBtn.textContent = '\u2715';

    // SVG 直接放 overlay，不做额外包裹
    overlay.appendChild(closeBtn);
    overlay.appendChild(clone);

    // 缩放控件
    var scale = 1;
    var updateScale = function () {
      clone.style.transform = 'scale(' + scale + ')';
    };

    var controls = document.createElement('div');
    controls.className = 'mermaid-zoom-controls';

    var label = document.createElement('span');
    label.className = 'zoom-label';
    var setLabel = function () {
      label.textContent = Math.round(scale * 100) + '%';
    };
    setLabel();

    var zoomIn = document.createElement('button');
    zoomIn.textContent = '+';
    zoomIn.addEventListener('click', function (e) {
      e.stopPropagation();
      scale = Math.min(5, scale + 0.25);
      updateScale();
      setLabel();
    });

    var zoomOut = document.createElement('button');
    zoomOut.textContent = '\u2212';
    zoomOut.addEventListener('click', function (e) {
      e.stopPropagation();
      scale = Math.max(0.25, scale - 0.25);
      updateScale();
      setLabel();
    });

    var resetBtn = document.createElement('button');
    resetBtn.textContent = '\u21BA';
    resetBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      scale = 1;
      updateScale();
      setLabel();
    });

    controls.appendChild(zoomOut);
    controls.appendChild(label);
    controls.appendChild(zoomIn);
    controls.appendChild(resetBtn);
    overlay.appendChild(controls);

    // 滚轮缩放
    clone.addEventListener('wheel', function (e) {
      e.preventDefault();
      e.stopPropagation();
      scale = Math.max(0.25, Math.min(5, scale + (e.deltaY > 0 ? -0.2 : 0.2)));
      updateScale();
      setLabel();
    }, { passive: false });

    function close() {
      overlay.remove();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', escHandler);
    }

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    closeBtn.addEventListener('click', close);

    function escHandler(e) {
      if (e.key === 'Escape') close();
    }
    document.addEventListener('keydown', escHandler);

    document.body.appendChild(overlay);
  }
})();
