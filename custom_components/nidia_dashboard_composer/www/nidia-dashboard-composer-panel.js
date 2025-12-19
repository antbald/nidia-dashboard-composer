/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = globalThis, K = j.ShadowRoot && (j.ShadyCSS === void 0 || j.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Z = Symbol(), _e = /* @__PURE__ */ new WeakMap();
let Se = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== Z) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (K && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = _e.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && _e.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ne = (o) => new Se(typeof o == "string" ? o : o + "", void 0, Z), Te = (o, ...e) => {
  const t = o.length === 1 ? o[0] : e.reduce((i, s, n) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + o[n + 1], o[0]);
  return new Se(t, o, Z);
}, Ue = (o, e) => {
  if (K) o.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), s = j.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = t.cssText, o.appendChild(i);
  }
}, ue = K ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return Ne(t);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Me, defineProperty: He, getOwnPropertyDescriptor: Re, getOwnPropertyNames: De, getOwnPropertySymbols: ze, getPrototypeOf: je } = Object, m = globalThis, fe = m.trustedTypes, Be = fe ? fe.emptyScript : "", F = m.reactiveElementPolyfillSupport, N = (o, e) => o, I = { toAttribute(o, e) {
  switch (e) {
    case Boolean:
      o = o ? Be : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, e) {
  let t = o;
  switch (e) {
    case Boolean:
      t = o !== null;
      break;
    case Number:
      t = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(o);
      } catch {
        t = null;
      }
  }
  return t;
} }, Q = (o, e) => !Me(o, e), ve = { attribute: !0, type: String, converter: I, reflect: !1, useDefault: !1, hasChanged: Q };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), m.litPropertyMetadata ?? (m.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let k = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = ve) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(e, i, t);
      s !== void 0 && He(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: s, set: n } = Re(this.prototype, e) ?? { get() {
      return this[t];
    }, set(r) {
      this[t] = r;
    } };
    return { get: s, set(r) {
      const c = s == null ? void 0 : s.call(this);
      n == null || n.call(this, r), this.requestUpdate(e, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ve;
  }
  static _$Ei() {
    if (this.hasOwnProperty(N("elementProperties"))) return;
    const e = je(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(N("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(N("properties"))) {
      const t = this.properties, i = [...De(t), ...ze(t)];
      for (const s of i) this.createProperty(s, t[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [i, s] of t) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const s = this._$Eu(t, i);
      s !== void 0 && this._$Eh.set(s, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const s of i) t.unshift(ue(s));
    } else e !== void 0 && t.push(ue(e));
    return t;
  }
  static _$Eu(e, t) {
    const i = t.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const i of t.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ue(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostConnected) == null ? void 0 : i.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostDisconnected) == null ? void 0 : i.call(t);
    });
  }
  attributeChangedCallback(e, t, i) {
    this._$AK(e, i);
  }
  _$ET(e, t) {
    var n;
    const i = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, i);
    if (s !== void 0 && i.reflect === !0) {
      const r = (((n = i.converter) == null ? void 0 : n.toAttribute) !== void 0 ? i.converter : I).toAttribute(t, i.type);
      this._$Em = e, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var n, r;
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const c = i.getPropertyOptions(s), l = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((n = c.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? c.converter : I;
      this._$Em = s;
      const h = l.fromAttribute(t, c.type);
      this[s] = h ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(e, t, i) {
    var s;
    if (e !== void 0) {
      const n = this.constructor, r = this[e];
      if (i ?? (i = n.getPropertyOptions(e)), !((i.hasChanged ?? Q)(r, t) || i.useDefault && i.reflect && r === ((s = this._$Ej) == null ? void 0 : s.get(e)) && !this.hasAttribute(n._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: s, wrapped: n }, r) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, r ?? t ?? this[e]), n !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, r] of this._$Ep) this[n] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, r] of s) {
        const { wrapped: c } = r, l = this[n];
        c !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, r, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (i = this._$EO) == null || i.forEach((s) => {
        var n;
        return (n = s.hostUpdate) == null ? void 0 : n.call(s);
      }), this.update(t)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var s;
      return (s = i.hostUpdated) == null ? void 0 : s.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
k.elementStyles = [], k.shadowRootOptions = { mode: "open" }, k[N("elementProperties")] = /* @__PURE__ */ new Map(), k[N("finalized")] = /* @__PURE__ */ new Map(), F == null || F({ ReactiveElement: k }), (m.reactiveElementVersions ?? (m.reactiveElementVersions = [])).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = globalThis, L = T.trustedTypes, ye = L ? L.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, Ee = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, ke = "?" + y, Ie = `<${ke}>`, w = document, M = () => w.createComment(""), H = (o) => o === null || typeof o != "object" && typeof o != "function", X = Array.isArray, Le = (o) => X(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", q = `[ 	
\f\r]`, O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, me = /-->/g, be = />/g, $ = RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), $e = /'/g, xe = /"/g, Ce = /^(?:script|style|textarea|title)$/i, Ve = (o) => (e, ...t) => ({ _$litType$: o, strings: e, values: t }), g = Ve(1), C = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), Ae = /* @__PURE__ */ new WeakMap(), x = w.createTreeWalker(w, 129);
function Pe(o, e) {
  if (!X(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ye !== void 0 ? ye.createHTML(e) : e;
}
const We = (o, e) => {
  const t = o.length - 1, i = [];
  let s, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = O;
  for (let c = 0; c < t; c++) {
    const l = o[c];
    let h, p, d = -1, u = 0;
    for (; u < l.length && (r.lastIndex = u, p = r.exec(l), p !== null); ) u = r.lastIndex, r === O ? p[1] === "!--" ? r = me : p[1] !== void 0 ? r = be : p[2] !== void 0 ? (Ce.test(p[2]) && (s = RegExp("</" + p[2], "g")), r = $) : p[3] !== void 0 && (r = $) : r === $ ? p[0] === ">" ? (r = s ?? O, d = -1) : p[1] === void 0 ? d = -2 : (d = r.lastIndex - p[2].length, h = p[1], r = p[3] === void 0 ? $ : p[3] === '"' ? xe : $e) : r === xe || r === $e ? r = $ : r === me || r === be ? r = O : (r = $, s = void 0);
    const f = r === $ && o[c + 1].startsWith("/>") ? " " : "";
    n += r === O ? l + Ie : d >= 0 ? (i.push(h), l.slice(0, d) + Ee + l.slice(d) + y + f) : l + y + (d === -2 ? c : f);
  }
  return [Pe(o, n + (o[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class R {
  constructor({ strings: e, _$litType$: t }, i) {
    let s;
    this.parts = [];
    let n = 0, r = 0;
    const c = e.length - 1, l = this.parts, [h, p] = We(e, t);
    if (this.el = R.createElement(h, i), x.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = x.nextNode()) !== null && l.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(Ee)) {
          const u = p[r++], f = s.getAttribute(d).split(y), b = /([.?@])?(.*)/.exec(u);
          l.push({ type: 1, index: n, name: b[2], strings: f, ctor: b[1] === "." ? qe : b[1] === "?" ? Ge : b[1] === "@" ? Je : V }), s.removeAttribute(d);
        } else d.startsWith(y) && (l.push({ type: 6, index: n }), s.removeAttribute(d));
        if (Ce.test(s.tagName)) {
          const d = s.textContent.split(y), u = d.length - 1;
          if (u > 0) {
            s.textContent = L ? L.emptyScript : "";
            for (let f = 0; f < u; f++) s.append(d[f], M()), x.nextNode(), l.push({ type: 2, index: ++n });
            s.append(d[u], M());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ke) l.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(y, d + 1)) !== -1; ) l.push({ type: 7, index: n }), d += y.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const i = w.createElement("template");
    return i.innerHTML = e, i;
  }
}
function P(o, e, t = o, i) {
  var r, c;
  if (e === C) return e;
  let s = i !== void 0 ? (r = t._$Co) == null ? void 0 : r[i] : t._$Cl;
  const n = H(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== n && ((c = s == null ? void 0 : s._$AO) == null || c.call(s, !1), n === void 0 ? s = void 0 : (s = new n(o), s._$AT(o, t, i)), i !== void 0 ? (t._$Co ?? (t._$Co = []))[i] = s : t._$Cl = s), s !== void 0 && (e = P(o, s._$AS(o, e.values), s, i)), e;
}
class Fe {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: i } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? w).importNode(t, !0);
    x.currentNode = s;
    let n = x.nextNode(), r = 0, c = 0, l = i[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let h;
        l.type === 2 ? h = new D(n, n.nextSibling, this, e) : l.type === 1 ? h = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (h = new Ye(n, this, e)), this._$AV.push(h), l = i[++c];
      }
      r !== (l == null ? void 0 : l.index) && (n = x.nextNode(), r++);
    }
    return x.currentNode = w, s;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class D {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, i, s) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = P(this, e, t), H(e) ? e === _ || e == null || e === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : e !== this._$AH && e !== C && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Le(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== _ && H(this._$AH) ? this._$AA.nextSibling.data = e : this.T(w.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: t, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = R.createElement(Pe(i.h, i.h[0]), this.options)), i);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === s) this._$AH.p(t);
    else {
      const r = new Fe(s, this), c = r.u(this.options);
      r.p(t), this.T(c), this._$AH = r;
    }
  }
  _$AC(e) {
    let t = Ae.get(e.strings);
    return t === void 0 && Ae.set(e.strings, t = new R(e)), t;
  }
  k(e) {
    X(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, s = 0;
    for (const n of e) s === t.length ? t.push(i = new D(this.O(M()), this.O(M()), this, this.options)) : i = t[s], i._$AI(n), s++;
    s < t.length && (this._$AR(i && i._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, t); e !== this._$AB; ) {
      const s = e.nextSibling;
      e.remove(), e = s;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class V {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, s, n) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = _;
  }
  _$AI(e, t = this, i, s) {
    const n = this.strings;
    let r = !1;
    if (n === void 0) e = P(this, e, t, 0), r = !H(e) || e !== this._$AH && e !== C, r && (this._$AH = e);
    else {
      const c = e;
      let l, h;
      for (e = n[0], l = 0; l < n.length - 1; l++) h = P(this, c[i + l], t, l), h === C && (h = this._$AH[l]), r || (r = !H(h) || h !== this._$AH[l]), h === _ ? e = _ : e !== _ && (e += (h ?? "") + n[l + 1]), this._$AH[l] = h;
    }
    r && !s && this.j(e);
  }
  j(e) {
    e === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class qe extends V {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === _ ? void 0 : e;
  }
}
class Ge extends V {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== _);
  }
}
class Je extends V {
  constructor(e, t, i, s, n) {
    super(e, t, i, s, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = P(this, e, t, 0) ?? _) === C) return;
    const i = this._$AH, s = e === _ && i !== _ || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, n = e !== _ && (i === _ || s);
    s && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ye {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    P(this, e);
  }
}
const G = T.litHtmlPolyfillSupport;
G == null || G(R, D), (T.litHtmlVersions ?? (T.litHtmlVersions = [])).push("3.3.1");
const Ke = (o, e, t) => {
  const i = (t == null ? void 0 : t.renderBefore) ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const n = (t == null ? void 0 : t.renderBefore) ?? null;
    i._$litPart$ = s = new D(e.insertBefore(M(), n), n, void 0, t ?? {});
  }
  return s._$AI(o), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A = globalThis;
class U extends k {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ke(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return C;
  }
}
var we;
U._$litElement$ = !0, U.finalized = !0, (we = A.litElementHydrateSupport) == null || we.call(A, { LitElement: U });
const J = A.litElementPolyfillSupport;
J == null || J({ LitElement: U });
(A.litElementVersions ?? (A.litElementVersions = [])).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ze = (o) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(o, e);
  }) : customElements.define(o, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qe = { attribute: !0, type: String, converter: I, reflect: !1, hasChanged: Q }, Xe = (o = Qe, e, t) => {
  const { kind: i, metadata: s } = t;
  let n = globalThis.litPropertyMetadata.get(s);
  if (n === void 0 && globalThis.litPropertyMetadata.set(s, n = /* @__PURE__ */ new Map()), i === "setter" && ((o = Object.create(o)).wrapped = !0), n.set(t.name, o), i === "accessor") {
    const { name: r } = t;
    return { set(c) {
      const l = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(r, l, o);
    }, init(c) {
      return c !== void 0 && this.C(r, void 0, o, c), c;
    } };
  }
  if (i === "setter") {
    const { name: r } = t;
    return function(c) {
      const l = this[r];
      e.call(this, c), this.requestUpdate(r, l, o);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function ee(o) {
  return (e, t) => typeof t == "object" ? Xe(o, e, t) : ((i, s, n) => {
    const r = s.hasOwnProperty(n);
    return s.constructor.createProperty(n, i), r ? Object.getOwnPropertyDescriptor(s, n) : void 0;
  })(o, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function W(o) {
  return ee({ ...o, state: !0, attribute: !1 });
}
const et = "nidia_dashboard_composer/get_config", tt = "nidia_dashboard_composer/save_config", it = "nidia_dashboard_composer/generate";
async function st(o) {
  return o.callWS({ type: et });
}
async function ot(o, e) {
  await o.callWS({ type: tt, config: e });
}
async function rt(o) {
  return o.callWS({ type: it });
}
var nt = Object.defineProperty, at = Object.getOwnPropertyDescriptor, S = (o, e, t, i) => {
  for (var s = i > 1 ? void 0 : i ? at(e, t) : e, n = o.length - 1, r; n >= 0; n--)
    (r = o[n]) && (s = (i ? r(e, t, s) : r(s)) || s);
  return i && s && nt(e, t, s), s;
};
let v = class extends U {
  constructor() {
    super(), this.narrow = !1, this._config = {
      areas: [],
      modules: [],
      theme: "default",
      layout_style: "standard",
      energy_villetta: {
        enabled: !1,
        home_consumption_sensor: null,
        import_power_sensor: null,
        photovoltaic_enabled: !1,
        photovoltaic_production_sensor: null,
        battery_enabled: !1,
        battery_sensor: null,
        export_enabled: !1,
        export_sensor: null,
        ev_enabled: !1,
        ev_sensor: null
      }
    }, this._loading = !1, this._generatedDashboard = null, this._configLoaded = !1, this._saveStatus = "idle";
  }
  updated(o) {
    super.updated(o), !this._configLoaded && this.hass && (this._configLoaded = !0, this._loadConfig());
  }
  async _loadConfig() {
    this._loading = !0;
    try {
      this._config = await st(this.hass), this._config.modules.includes("home") || (this._config.modules = ["home"]);
    } catch (o) {
      console.error("Failed to load config:", o);
    }
    this._loading = !1;
  }
  async _saveConfig() {
    this._saveStatus = "saving";
    try {
      this._config.modules = ["home"], await ot(this.hass, this._config), this._saveStatus = "saved", setTimeout(() => {
        this._saveStatus = "idle";
      }, 2e3);
    } catch (o) {
      console.error("Failed to save config:", o), this._saveStatus = "error", setTimeout(() => {
        this._saveStatus = "idle";
      }, 3e3);
    }
  }
  _onBackgroundChange(o) {
    const t = o.target.value;
    this._config = { ...this._config, background: t || void 0 };
  }
  async _generate() {
    this._loading = !0;
    try {
      this._generatedDashboard = await rt(this.hass);
    } catch (o) {
      console.error("Failed to generate dashboard:", o);
    }
    this._loading = !1;
  }
  _toggleArea(o) {
    const e = this._config.areas.indexOf(o);
    e > -1 ? this._config.areas.splice(e, 1) : this._config.areas.push(o), this._config = { ...this._config };
  }
  _selectAllAreas() {
    this.hass.areas && (this._config.areas = Object.keys(this.hass.areas), this._config = { ...this._config });
  }
  _deselectAllAreas() {
    this._config.areas = [], this._config = { ...this._config };
  }
  _getSensorEntities() {
    var o;
    return (o = this.hass) != null && o.states ? Object.values(this.hass.states).filter((e) => e.entity_id.startsWith("sensor.")).map((e) => ({
      entity_id: e.entity_id,
      friendly_name: e.attributes.friendly_name || e.entity_id
    })).sort((e, t) => e.friendly_name.localeCompare(t.friendly_name)) : [];
  }
  _getAreasByFloor() {
    var i;
    if (!((i = this.hass) != null && i.areas)) return { floors: {}, noFloor: [] };
    const o = Object.values(this.hass.areas), e = {}, t = [];
    return o.forEach((s) => {
      s.floor_id ? (e[s.floor_id] || (e[s.floor_id] = []), e[s.floor_id].push(s)) : t.push(s);
    }), { floors: e, noFloor: t };
  }
  render() {
    var i, s, n, r, c, l, h, p, d, u, f, b, te, ie, se, oe, re;
    const o = (i = this.hass) != null && i.areas ? Object.values(this.hass.areas) : [], { floors: e, noFloor: t } = this._getAreasByFloor();
    return g`
      <div class="container">
        <div class="header">
          <h1>Nidia Dashboard Composer</h1>
          <p>Create your perfect Home Assistant dashboard in seconds.</p>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Select Areas</h2>
            <div>
              <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" @click="${this._selectAllAreas}">All</button>
              <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" @click="${this._deselectAllAreas}">None</button>
            </div>
          </div>

          ${o.length > 0 ? g`
            ${Object.entries(e).map(([a, z]) => g`
              <div style="margin-bottom: 24px;">
                <h3 style="margin: 16px 0 12px 0; font-size: 14px; font-weight: 600; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: 0.5px;">
                  ${a}
                </h3>
                <div class="area-grid">
                  ${z.map((E) => g`
                    <div
                      class="area-card ${this._config.areas.includes(E.area_id) ? "selected" : ""}"
                      @click="${() => this._toggleArea(E.area_id)}"
                    >
                      <span class="area-icon">🏠</span>
                      <div class="area-name">${E.name}</div>
                    </div>
                  `)}
                </div>
              </div>
            `)}

            ${t.length > 0 ? g`
              <div style="margin-bottom: 24px;">
                <h3 style="margin: 16px 0 12px 0; font-size: 14px; font-weight: 600; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: 0.5px;">
                  Other Areas
                </h3>
                <div class="area-grid">
                  ${t.map((a) => g`
                    <div
                      class="area-card ${this._config.areas.includes(a.area_id) ? "selected" : ""}"
                      @click="${() => this._toggleArea(a.area_id)}"
                    >
                      <span class="area-icon">🏠</span>
                      <div class="area-name">${a.name}</div>
                    </div>
                  `)}
                </div>
              </div>
            ` : ""}
          ` : g`
            <p style="text-align: center; color: var(--secondary-text-color);">
              No areas found in Home Assistant. Please configure areas first.
            </p>
          `}
        </div>
<div class="card">
  <div class="card-header">
    <h2 class="card-title">Background Settings</h2>
    <div>
      <select @change="${(a) => this._onBackgroundChange(a)}" .value="${this._config.background || ""}">
        <option value="">None</option>
        <option value="modern">Modern</option>
      </select>
    </div>
  </div>
</div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Energy Image (Villetta)</h2>
          </div>

          <!-- Module Enable Toggle -->
          <div style="margin-bottom: 16px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input
                type="checkbox"
                .checked="${((s = this._config.energy_villetta) == null ? void 0 : s.enabled) || !1}"
                @change="${(a) => {
      var z, E, ne, ae, le, ce, de, he, pe, ge;
      this._config = {
        ...this._config,
        energy_villetta: {
          ...this._config.energy_villetta,
          enabled: a.target.checked,
          home_consumption_sensor: ((z = this._config.energy_villetta) == null ? void 0 : z.home_consumption_sensor) || null,
          import_power_sensor: ((E = this._config.energy_villetta) == null ? void 0 : E.import_power_sensor) || null,
          photovoltaic_enabled: ((ne = this._config.energy_villetta) == null ? void 0 : ne.photovoltaic_enabled) || !1,
          photovoltaic_production_sensor: ((ae = this._config.energy_villetta) == null ? void 0 : ae.photovoltaic_production_sensor) || null,
          battery_enabled: ((le = this._config.energy_villetta) == null ? void 0 : le.battery_enabled) || !1,
          battery_sensor: ((ce = this._config.energy_villetta) == null ? void 0 : ce.battery_sensor) || null,
          export_enabled: ((de = this._config.energy_villetta) == null ? void 0 : de.export_enabled) || !1,
          export_sensor: ((he = this._config.energy_villetta) == null ? void 0 : he.export_sensor) || null,
          ev_enabled: ((pe = this._config.energy_villetta) == null ? void 0 : pe.ev_enabled) || !1,
          ev_sensor: ((ge = this._config.energy_villetta) == null ? void 0 : ge.ev_sensor) || null
        }
      };
    }}"
                style="margin-right: 8px;"
              />
              <span style="font-weight: 500;">Enable Energy Image Module</span>
            </label>
          </div>

          ${(n = this._config.energy_villetta) != null && n.enabled ? g`
            <!-- Home Consumption Sensor -->
            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 4px; font-weight: 500;">
                Home Consumption Sensor <span style="color: red;">*</span>
              </label>
              <select
                .value="${((r = this._config.energy_villetta) == null ? void 0 : r.home_consumption_sensor) || ""}"
                @change="${(a) => {
      this._config = {
        ...this._config,
        energy_villetta: {
          ...this._config.energy_villetta,
          home_consumption_sensor: a.target.value || null
        }
      };
    }}"
                style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--primary-background-color); color: var(--primary-text-color);"
              >
                <option value="">Select entity...</option>
                ${this._getSensorEntities().map((a) => g`
                  <option value="${a.entity_id}">${a.friendly_name || a.entity_id}</option>
                `)}
              </select>
            </div>

            <!-- Import Power Sensor -->
            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 4px; font-weight: 500;">
                Import Power Sensor <span style="color: red;">*</span>
              </label>
              <select
                .value="${((c = this._config.energy_villetta) == null ? void 0 : c.import_power_sensor) || ""}"
                @change="${(a) => {
      this._config = {
        ...this._config,
        energy_villetta: {
          ...this._config.energy_villetta,
          import_power_sensor: a.target.value || null
        }
      };
    }}"
                style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--primary-background-color); color: var(--primary-text-color);"
              >
                <option value="">Select entity...</option>
                ${this._getSensorEntities().map((a) => g`
                  <option value="${a.entity_id}">${a.friendly_name || a.entity_id}</option>
                `)}
              </select>
            </div>

            <!-- Photovoltaic Toggle -->
            <div style="margin-bottom: 16px;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input
                  type="checkbox"
                  .checked="${((l = this._config.energy_villetta) == null ? void 0 : l.photovoltaic_enabled) || !1}"
                  @change="${(a) => {
      this._config = {
        ...this._config,
        energy_villetta: {
          ...this._config.energy_villetta,
          photovoltaic_enabled: a.target.checked
        }
      };
    }}"
                  style="margin-right: 8px;"
                />
                <span style="font-weight: 500;">Photovoltaic System</span>
              </label>
            </div>

            ${(h = this._config.energy_villetta) != null && h.photovoltaic_enabled ? g`
              <!-- PV Production Sensor -->
              <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 4px; font-weight: 500;">
                  Instant Photovoltaic Production Sensor <span style="color: red;">*</span>
                </label>
                <select
                  .value="${((p = this._config.energy_villetta) == null ? void 0 : p.photovoltaic_production_sensor) || ""}"
                  @change="${(a) => {
      this._config = {
        ...this._config,
        energy_villetta: {
          ...this._config.energy_villetta,
          photovoltaic_production_sensor: a.target.value || null
        }
      };
    }}"
                  style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--primary-background-color); color: var(--primary-text-color);"
                >
                  <option value="">Select entity...</option>
                  ${this._getSensorEntities().map((a) => g`
                    <option value="${a.entity_id}">${a.friendly_name || a.entity_id}</option>
                  `)}
                </select>
              </div>
            ` : ""}

            <!-- Battery Toggle -->
            <div style="margin-bottom: 16px;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input
                  type="checkbox"
                  .checked="${((d = this._config.energy_villetta) == null ? void 0 : d.battery_enabled) || !1}"
                  @change="${(a) => {
      this._config = {
        ...this._config,
        energy_villetta: {
          ...this._config.energy_villetta,
          battery_enabled: a.target.checked
        }
      };
    }}"
                  style="margin-right: 8px;"
                />
                <span style="font-weight: 500;">Battery Storage System</span>
              </label>
            </div>

            ${(u = this._config.energy_villetta) != null && u.battery_enabled ? g`
              <!-- Battery Sensor -->
              <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 4px; font-weight: 500;">
                  Battery Power / Status Sensor <span style="color: red;">*</span>
                </label>
                <select
                  .value="${((f = this._config.energy_villetta) == null ? void 0 : f.battery_sensor) || ""}"
                  @change="${(a) => {
      this._config = {
        ...this._config,
        energy_villetta: {
          ...this._config.energy_villetta,
          battery_sensor: a.target.value || null
        }
      };
    }}"
                  style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--primary-background-color); color: var(--primary-text-color);"
                >
                  <option value="">Select entity...</option>
                  ${this._getSensorEntities().map((a) => g`
                    <option value="${a.entity_id}">${a.friendly_name || a.entity_id}</option>
                  `)}
                </select>
              </div>
            ` : ""}

            <!-- Export Energy Toggle -->
            <div style="margin-bottom: 16px;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input
                  type="checkbox"
                  .checked="${((b = this._config.energy_villetta) == null ? void 0 : b.export_enabled) || !1}"
                  @change="${(a) => {
      this._config = {
        ...this._config,
        energy_villetta: {
          ...this._config.energy_villetta,
          export_enabled: a.target.checked
        }
      };
    }}"
                  style="margin-right: 8px;"
                />
                <span style="font-weight: 500;">Export Energy</span>
              </label>
            </div>

            ${(te = this._config.energy_villetta) != null && te.export_enabled ? g`
              <!-- Export Power Sensor -->
              <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 4px; font-weight: 500;">
                  Export power sensor <span style="color: red;">*</span>
                </label>
                <select
                  .value="${((ie = this._config.energy_villetta) == null ? void 0 : ie.export_sensor) || ""}"
                  @change="${(a) => {
      this._config = {
        ...this._config,
        energy_villetta: {
          ...this._config.energy_villetta,
          export_sensor: a.target.value || null
        }
      };
    }}"
                  style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--primary-background-color); color: var(--primary-text-color);"
                >
                  <option value="">Select entity...</option>
                  ${this._getSensorEntities().map((a) => g`
                    <option value="${a.entity_id}">${a.friendly_name || a.entity_id}</option>
                  `)}
                </select>
              </div>
            ` : ""}

            <!-- EV Toggle -->
            <div style="margin-bottom: 16px;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input
                  type="checkbox"
                  .checked="${((se = this._config.energy_villetta) == null ? void 0 : se.ev_enabled) || !1}"
                  @change="${(a) => {
      this._config = {
        ...this._config,
        energy_villetta: {
          ...this._config.energy_villetta,
          ev_enabled: a.target.checked
        }
      };
    }}"
                  style="margin-right: 8px;"
                />
                <span style="font-weight: 500;">EV</span>
              </label>
            </div>

            ${(oe = this._config.energy_villetta) != null && oe.ev_enabled ? g`
              <!-- EV Charging Power Sensor -->
              <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 4px; font-weight: 500;">
                  EV charging power sensor <span style="color: red;">*</span>
                </label>
                <select
                  .value="${((re = this._config.energy_villetta) == null ? void 0 : re.ev_sensor) || ""}"
                  @change="${(a) => {
      this._config = {
        ...this._config,
        energy_villetta: {
          ...this._config.energy_villetta,
          ev_sensor: a.target.value || null
        }
      };
    }}"
                  style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--primary-background-color); color: var(--primary-text-color);"
                >
                  <option value="">Select entity...</option>
                  ${this._getSensorEntities().map((a) => g`
                    <option value="${a.entity_id}">${a.friendly_name || a.entity_id}</option>
                  `)}
                </select>
              </div>
            ` : ""}
          ` : ""}
        </div>

        ${this._generatedDashboard ? g`
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Generated Dashboard</h2>
              <button class="btn-secondary" @click="${() => {
      navigator.clipboard.writeText(JSON.stringify(this._generatedDashboard, null, 2));
    }}">
                Copy JSON
              </button>
            </div>
            <pre class="code-preview">${JSON.stringify(this._generatedDashboard, null, 2)}</pre>
          </div>
        ` : ""}

        <div class="actions">
          <button 
            class="btn-primary" 
            @click="${async () => {
      await this._saveConfig(), await this._generate();
    }}"
            ?disabled="${this._saveStatus === "saving" || this._loading}"
          >
            ${this._saveStatus === "saving" ? "Saving..." : this._loading ? "Generating..." : this._saveStatus === "saved" ? "Saved & Generated!" : "Save & Generate Dashboard"}
          </button>
        </div>
      </div>
    `;
  }
};
v.styles = Te`
    :host {
      display: block;
      height: 100%;
      width: 100%;
      background-color: var(--primary-background-color);
      color: var(--primary-text-color);
      overflow-y: auto;
      font-family: var(--paper-font-body1_-_font-family);
      -webkit-font-smoothing: antialiased;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 32px 16px;
    }

    .header {
      text-align: center;
      margin-bottom: 48px;
    }

    .header h1 {
      font-size: 36px;
      font-weight: 300;
      margin: 0 0 8px 0;
      color: var(--primary-text-color);
    }

    .header p {
      font-size: 16px;
      color: var(--secondary-text-color);
      margin: 0;
    }

    .card {
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: 12px;
      padding: 24px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,0.1));
      margin-bottom: 24px;
      border: 1px solid var(--divider-color, #e0e0e0);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .card-title {
      font-size: 20px;
      font-weight: 500;
      margin: 0;
    }

    .area-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 12px;
    }

    .area-card {
      background: var(--secondary-background-color);
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.2s;
      border: 2px solid transparent;
      text-align: center;
    }

    .area-card:hover {
      background: var(--primary-color);
      color: white;
    }

    .area-card.selected {
      border-color: var(--primary-color);
      background: var(--primary-color);
      color: white;
    }

    .area-icon {
      font-size: 24px;
      margin-bottom: 8px;
      display: block;
    }

    .area-name {
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 32px;
      position: sticky;
      bottom: 32px;
      background: var(--primary-background-color);
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      z-index: 10;
    }

    button {
      padding: 12px 24px;
      border-radius: 8px;
      border: none;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .btn-secondary {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .btn-primary:hover {
      filter: brightness(1.1);
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .code-preview {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 16px;
      border-radius: 8px;
      overflow: auto;
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.5;
      max-height: 600px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .status-saved { background: #e8f5e9; color: #2e7d32; }
    .status-error { background: #ffebee; color: #c62828; }
  `;
S([
  ee({ attribute: !1 })
], v.prototype, "hass", 2);
S([
  ee({ type: Boolean })
], v.prototype, "narrow", 2);
S([
  W()
], v.prototype, "_config", 2);
S([
  W()
], v.prototype, "_loading", 2);
S([
  W()
], v.prototype, "_generatedDashboard", 2);
S([
  W()
], v.prototype, "_saveStatus", 2);
v = S([
  Ze("nidia-dashboard-composer-panel")
], v);
const B = "0.5.1", Oe = "nidia_dashboard_composer_version", Y = localStorage.getItem(Oe);
Y !== B && (console.log(`Nidia Dashboard Composer: Version changed from ${Y} to ${B}, clearing cache...`), localStorage.setItem(Oe, B), "caches" in window && caches.keys().then((o) => {
  o.forEach((e) => {
    (e.includes("nidia") || e.includes("dashboard-composer")) && caches.delete(e);
  });
}), Y !== null && (console.log("Nidia Dashboard Composer: Forcing hard reload..."), window.location.reload()));
customElements.whenDefined("nidia-dashboard-composer-panel").then(() => {
  console.log(`Nidia Dashboard Composer v${B} panel loaded`);
});
