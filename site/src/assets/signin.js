(function () {
  'use strict';
  var form = document.getElementById('f');
  if (!form) return;
  var T = JSON.parse(document.getElementById('i18n').textContent);
  var err = document.getElementById('error');
  var locked = document.getElementById('locked');
  var user = document.getElementById('username');
  var pass = document.getElementById('password');
  var btn = document.getElementById('submit');
  var label = btn.querySelector('span');
  var errDefault = err.textContent;

  function say(node, text) {
    err.classList.remove('show');
    locked.classList.remove('show');
    if (node) { if (node === err) err.textContent = text || errDefault; node.classList.add('show'); }
  }

  // clear the #error / #locked fragment left by a no-JS submit
  if (location.hash) history.replaceState(null, '', location.pathname);

  // show / hide password
  var toggle = document.getElementById('toggle');
  toggle.hidden = false;
  toggle.addEventListener('click', function () {
    var showing = pass.type === 'text';
    pass.type = showing ? 'password' : 'text';
    toggle.setAttribute('aria-label', showing ? T.show : T.hide);
    toggle.querySelector('.i-eye').hidden = !showing;
    toggle.querySelector('.i-eye-slash').hidden = showing;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    say(null);
    btn.disabled = true;
    label.textContent = T.busy;
    fetch('/api/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ username: user.value, password: pass.value })
    }).then(function (r) {
      if (r.status === 429) say(locked);
      else say(err);
    }).catch(function () {
      say(err, T.net);
    }).then(function () {
      btn.disabled = false;
      label.textContent = T.submit;
      pass.value = '';
      pass.focus();
    });
  });
})();
