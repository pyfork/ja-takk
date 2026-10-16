(function () {
  'use strict';
  var el = document.getElementById('i18n');
  if (!el) return;
  var T = JSON.parse(el.textContent);
  var $ = function (id) { return document.getElementById(id); };

  // persona tabs: swap headline, lead and the two hero buttons
  var tabs = $('tabs');
  if (tabs) {
    tabs.hidden = false;
    var buttons = tabs.querySelectorAll('button');
    var show = function (key) {
      var p = T.personas[key];
      var h1 = $('h1');
      h1.textContent = '';
      h1.appendChild(document.createTextNode(p.h[0]));
      var hl = document.createElement('span');
      hl.className = 'hl';
      hl.textContent = p.h[1];
      h1.appendChild(hl);
      $('lead').textContent = p.lead;
      $('cta1-text').textContent = p.c1;
      $('cta2').textContent = p.c2;
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].setAttribute('aria-pressed', String(buttons[i].dataset.p === key));
      }
    };
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () { show(this.dataset.p); });
    }
  }

  // time-saved calculator
  var units = $('units'), qs = $('qs');
  if (units && qs) {
    document.querySelectorAll('.js-only').forEach(function (n) { n.hidden = false; });
    var calc = function () {
      var u = +units.value, q = +qs.value;
      var hours = Math.round(u * 0.6 + q * 4 * 0.5 + u * 0.15 * 1.5);
      $('hours').textContent = hours;
      $('v1').textContent = u;
      $('v2').textContent = q * 4 + '/' + T.calc.per;
      $('v3').textContent = Math.round(u * 0.9);
      $('lu').textContent = T.calc.lu + ' · ' + u;
      $('lq').textContent = T.calc.lq + ' · ' + q;
    };
    units.addEventListener('input', calc);
    qs.addEventListener('input', calc);
  }
})();
