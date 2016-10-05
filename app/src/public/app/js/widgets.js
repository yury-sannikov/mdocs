'use strict';

(function (global) {
  var elements = document.querySelectorAll('.w-mdocs');
  for (var i = 0, len = elements.length; i < len; ++i) {
    createWidget(elements[i]);
  }

  function createWidget(el) {
    var id = el.getAttribute('data-w-id');
    var datawidth = el.getAttribute('data-width');
    var processed = el.getAttribute('data-w-processed');
    if (!id || processed === '1') {
      return;
    }
    el.setAttribute('data-w-processed', '1');

    var wc = datawidth.split('x');
    datawidth = { w: wc[0], h: wc[1], s: datawidth };
    renderEmpty(el, datawidth);

    request(id, function (data) {
      renderOuter(el, { id: id, data: data }, datawidth);
    }, function (data) {
      renderOuterError(el, data, datawidth);
    });
  }

  function request(id, cb, err) {

    window.setTimeout(function () {
      err({
        id: id,
        u: 'https://app.mdocs.co/w/c?' + id
      });
    }, 1000);
  }
  function renderEmpty(el, data) {
    el.style.cssText = 'display: inline-block; width: ' + data.w + 'px; height: ' + data.h + 'px;';
  }

  function renderOuterError(el, data, datawidth) {
    el.style.background = '#ffffff url("app/img/widgets/' + datawidth.s + '/noscript.png") no-repeat right top';
    renderOuter(el, data, datawidth);
  }

  function renderOuter(el, data, datawidth) {
    var cssText = 'display: inline-block; width: ' + datawidth.w + 'px; height: ' + datawidth.h + 'px;';
    el.innerHTML = '<a href=' + data.u + '><div style="' + cssText + '">' + render(data) + '</div></a>';
  }

  function render(data, datawidth) {
    if (!data.r) {
      // Check if response has ratings
      return '';
    }
    return '<span>hello ' + data.id + '</span>';
  }
})(window);