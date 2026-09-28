/* 가챠 아트 프로토타입 — 화면 파일(.dc.html)을 일반 웹페이지로 그려주는 작은 런타임 */
(function () {
  document.write('<style>x-dc{display:none!important}</style>');
  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (p) { Object.assign(this.state, typeof p === 'function' ? p(this.state) : p); if (this._render) this._render(); };
  DCLogic.prototype.forceUpdate = function () { if (this._render) this._render(); };
  window.DCLogic = DCLogic;

  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var ONE = /^\{\{\s*([^}]+?)\s*\}\}$/;

  function lookup(path, scope) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    if (/^'.*'$|^".*"$/.test(path)) return path.slice(1, -1);
    var parts = path.split('.');
    var v = scope;
    for (var i = 0; i < parts.length; i++) { if (v == null) return undefined; v = v[parts[i]]; }
    return v;
  }
  function interp(str, scope) {
    return str.replace(HOLE, function (_, p) { var v = lookup(p, scope); return v == null ? '' : String(v); });
  }
  function raw(str, scope) { var m = str.match(ONE); return m ? lookup(m[1], scope) : interp(str, scope); }

  var defs = {};           // 컴포넌트 이름 → { tpl, Cls, defaults }
  function parseDef(doc) {
    var xdc = doc.querySelector('x-dc');
    var helmet = xdc.querySelector('helmet');
    var tpl = xdc.cloneNode(true);
    var h = tpl.querySelector('helmet'); if (h) h.remove();
    var sc = doc.querySelector('script[data-dc-script]');
    var defaults = {};
    try { var dp = JSON.parse(sc.getAttribute('data-props') || '{}'); Object.keys(dp).forEach(function (k) { if (k[0] !== '$' && dp[k] && 'default' in dp[k]) defaults[k] = dp[k].default; }); } catch (e) {}
    var Cls = new Function('DCLogic', sc.textContent + '\n;return Component;')(DCLogic);
    return { tpl: tpl, Cls: Cls, defaults: defaults, helmet: helmet };
  }

  function collectImports(node, out) {
    node.querySelectorAll('dc-import').forEach(function (n) { out[n.getAttribute('name')] = true; });
    return out;
  }

  function renderChildren(src, parent, scope) {
    src.childNodes.forEach(function (n) { renderNode(n, parent, scope); });
  }

  function renderNode(n, parent, scope) {
    if (n.nodeType === 3) { parent.appendChild(document.createTextNode(interp(n.nodeValue, scope))); return; }
    if (n.nodeType !== 1) return;
    var tag = n.tagName.toLowerCase();
    if (tag === 'sc-for') {
      var list = raw(n.getAttribute('list') || '', scope) || [];
      var as = n.getAttribute('as') || 'item';
      list.forEach(function (item, i) {
        var s = Object.create(scope); s[as] = item; s.$index = i;
        renderChildren(n, parent, s);
      });
      return;
    }
    if (tag === 'sc-if') { if (raw(n.getAttribute('value') || '', scope)) renderChildren(n, parent, scope); return; }
    if (tag === 'dc-import') {
      var name = n.getAttribute('name'); var d = defs[name]; if (!d) return;
      var props = Object.assign({}, d.defaults);
      Array.prototype.forEach.call(n.attributes, function (a) {
        if (a.name === 'name' || a.name.indexOf('hint-') === 0) return;
        var key = a.name.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); });
        props[key] = raw(a.value, scope);
      });
      var inst = new d.Cls(props);
      renderChildren(d.tpl, parent, inst.renderVals());
      return;
    }
    var el = n.cloneNode(false);
    Array.prototype.slice.call(el.attributes).forEach(function (a) {
      if (a.name.indexOf('hint-') === 0) { el.removeAttribute(a.name); return; }
      if (/^on[a-z]+$/i.test(a.name) && ONE.test(a.value)) {
        var fn = raw(a.value, scope); el.removeAttribute(a.name);
        if (typeof fn === 'function') el.addEventListener(a.name.slice(2).toLowerCase(), fn);
        return;
      }
      if (a.value.indexOf('{{') >= 0) el.setAttribute(a.name, interp(a.value, scope));
    });
    // .dc.html 링크는 그대로 다음 화면 파일로 이동
    parent.appendChild(el);
    renderChildren(n, el, scope);
  }

  function fit(stage, root) {
    var w = root.offsetWidth || 390, h = root.offsetHeight || 844;
    var s = Math.min(window.innerWidth / w, window.innerHeight / h);
    if (window.innerWidth > 600) s = Math.min(s, 1);
    stage.style.transform = 'scale(' + s + ')';
    stage.style.width = w + 'px'; stage.style.height = h + 'px';
    stage.parentNode.style.height = (h * s) + 'px';
    stage.parentNode.style.width = (w * s) + 'px';
  }

  function boot() {
    var main = parseDef(document);
    document.querySelector('x-dc').remove();
    if (main.helmet) Array.prototype.slice.call(main.helmet.children).forEach(function (c) { document.head.appendChild(c); });
    var st = document.createElement('style');
    st.textContent = 'html,body{height:100%}body{margin:0!important;background:#E9E7EE!important;display:flex;align-items:center;justify-content:center;min-height:100%;overflow:hidden}#wrap{overflow:hidden;border-radius:0;box-shadow:0 10px 40px rgba(20,20,20,.15)}#stage{transform-origin:0 0}@media(max-width:600px){#wrap{box-shadow:none}}';
    document.head.appendChild(st);
    var wrap = document.createElement('div'); wrap.id = 'wrap';
    var stage = document.createElement('div'); stage.id = 'stage';
    wrap.appendChild(stage); document.body.appendChild(wrap);

    var names = Object.keys(collectImports(main.tpl, {}));
    Promise.all(names.map(function (nm) {
      return fetch(nm + '.dc.html').then(function (r) { return r.text(); }).then(function (t) {
        var doc = new DOMParser().parseFromString(t, 'text/html');
        var d = parseDef(doc);
        if (d.helmet) Array.prototype.slice.call(d.helmet.querySelectorAll('style')).forEach(function (s) { document.head.appendChild(s); });
        defs[nm] = d;
      });
    })).then(function () {
      var inst = new main.Cls(Object.assign({}, main.defaults));
      inst._render = function () {
        var scrolls = Array.prototype.map.call(stage.querySelectorAll('.scroll'), function (e) { return e.scrollTop; });
        stage.innerHTML = '';
        renderChildren(main.tpl, stage, inst.renderVals());
        stage.querySelectorAll('.scroll').forEach(function (e, i) { if (scrolls[i]) e.scrollTop = scrolls[i]; });
      };
      if (inst.componentWillMount) inst.componentWillMount();
      inst._render();
      if (inst.componentDidMount) inst.componentDidMount();
      var root = stage.firstElementChild;
      fit(stage, root);
      window.addEventListener('resize', function () { fit(stage, stage.firstElementChild); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
