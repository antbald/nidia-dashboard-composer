/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, V = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, q = Symbol(), K = /* @__PURE__ */ new WeakMap();
let at = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (V && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = K.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && K.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const pt = (r) => new at(typeof r == "string" ? r : r + "", void 0, q), ut = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[n + 1], r[0]);
  return new at(e, r, q);
}, _t = (r, t) => {
  if (V) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = H.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, Z = V ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return pt(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: gt, defineProperty: $t, getOwnPropertyDescriptor: ft, getOwnPropertyNames: bt, getOwnPropertySymbols: mt, getPrototypeOf: yt } = Object, f = globalThis, Q = f.trustedTypes, vt = Q ? Q.emptyScript : "", I = f.reactiveElementPolyfillSupport, P = (r, t) => r, R = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? vt : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, F = (r, t) => !gt(r, t), X = { attribute: !0, type: String, converter: R, reflect: !1, useDefault: !1, hasChanged: F };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), f.litPropertyMetadata ?? (f.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let x = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = X) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && $t(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: n } = ft(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: i, set(o) {
      const h = i == null ? void 0 : i.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, h, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? X;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const t = yt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const e = this.properties, s = [...bt(e), ...mt(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(Z(i));
    } else t !== void 0 && e.push(Z(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return _t(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var n;
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const o = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : R).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, o;
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const h = s.getPropertyOptions(i), a = typeof h.converter == "function" ? { fromAttribute: h.converter } : ((n = h.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? h.converter : R;
      this._$Em = i;
      const l = a.fromAttribute(e, h.type);
      this[i] = l ?? ((o = this._$Ej) == null ? void 0 : o.get(i)) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, s) {
    var i;
    if (t !== void 0) {
      const n = this.constructor, o = this[t];
      if (s ?? (s = n.getPropertyOptions(t)), !((s.hasChanged ?? F)(o, e) || s.useDefault && s.reflect && o === ((i = this._$Ej) == null ? void 0 : i.get(t)) && !this.hasAttribute(n._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: n }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, o] of i) {
        const { wrapped: h } = o, a = this[n];
        h !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, o, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((i) => {
        var n;
        return (n = i.hostUpdate) == null ? void 0 : n.call(i);
      }), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
x.elementStyles = [], x.shadowRootOptions = { mode: "open" }, x[P("elementProperties")] = /* @__PURE__ */ new Map(), x[P("finalized")] = /* @__PURE__ */ new Map(), I == null || I({ ReactiveElement: x }), (f.reactiveElementVersions ?? (f.reactiveElementVersions = [])).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = globalThis, z = T.trustedTypes, tt = z ? z.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, ht = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, ct = "?" + $, At = `<${ct}>`, A = document, O = () => A.createComment(""), U = (r) => r === null || typeof r != "object" && typeof r != "function", J = Array.isArray, St = (r) => J(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", L = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, et = /-->/g, st = />/g, b = RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), it = /'/g, rt = /"/g, lt = /^(?:script|style|textarea|title)$/i, xt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), m = xt(1), E = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), ot = /* @__PURE__ */ new WeakMap(), y = A.createTreeWalker(A, 129);
function dt(r, t) {
  if (!J(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return tt !== void 0 ? tt.createHTML(t) : t;
}
const Et = (r, t) => {
  const e = r.length - 1, s = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = C;
  for (let h = 0; h < e; h++) {
    const a = r[h];
    let l, p, c = -1, u = 0;
    for (; u < a.length && (o.lastIndex = u, p = o.exec(a), p !== null); ) u = o.lastIndex, o === C ? p[1] === "!--" ? o = et : p[1] !== void 0 ? o = st : p[2] !== void 0 ? (lt.test(p[2]) && (i = RegExp("</" + p[2], "g")), o = b) : p[3] !== void 0 && (o = b) : o === b ? p[0] === ">" ? (o = i ?? C, c = -1) : p[1] === void 0 ? c = -2 : (c = o.lastIndex - p[2].length, l = p[1], o = p[3] === void 0 ? b : p[3] === '"' ? rt : it) : o === rt || o === it ? o = b : o === et || o === st ? o = C : (o = b, i = void 0);
    const g = o === b && r[h + 1].startsWith("/>") ? " " : "";
    n += o === C ? a + At : c >= 0 ? (s.push(l), a.slice(0, c) + ht + a.slice(c) + $ + g) : a + $ + (c === -2 ? h : g);
  }
  return [dt(r, n + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class N {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let n = 0, o = 0;
    const h = t.length - 1, a = this.parts, [l, p] = Et(t, e);
    if (this.el = N.createElement(l, s), y.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = y.nextNode()) !== null && a.length < h; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(ht)) {
          const u = p[o++], g = i.getAttribute(c).split($), D = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: n, name: D[2], strings: g, ctor: D[1] === "." ? Ct : D[1] === "?" ? Pt : D[1] === "@" ? Tt : j }), i.removeAttribute(c);
        } else c.startsWith($) && (a.push({ type: 6, index: n }), i.removeAttribute(c));
        if (lt.test(i.tagName)) {
          const c = i.textContent.split($), u = c.length - 1;
          if (u > 0) {
            i.textContent = z ? z.emptyScript : "";
            for (let g = 0; g < u; g++) i.append(c[g], O()), y.nextNode(), a.push({ type: 2, index: ++n });
            i.append(c[u], O());
          }
        }
      } else if (i.nodeType === 8) if (i.data === ct) a.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = i.data.indexOf($, c + 1)) !== -1; ) a.push({ type: 7, index: n }), c += $.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = A.createElement("template");
    return s.innerHTML = t, s;
  }
}
function w(r, t, e = r, s) {
  var o, h;
  if (t === E) return t;
  let i = s !== void 0 ? (o = e._$Co) == null ? void 0 : o[s] : e._$Cl;
  const n = U(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((h = i == null ? void 0 : i._$AO) == null || h.call(i, !1), n === void 0 ? i = void 0 : (i = new n(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = w(r, i._$AS(r, t.values), i, s)), t;
}
class wt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? A).importNode(e, !0);
    y.currentNode = i;
    let n = y.nextNode(), o = 0, h = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let l;
        a.type === 2 ? l = new M(n, n.nextSibling, this, t) : a.type === 1 ? l = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (l = new kt(n, this, t)), this._$AV.push(l), a = s[++h];
      }
      o !== (a == null ? void 0 : a.index) && (n = y.nextNode(), o++);
    }
    return y.currentNode = A, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class M {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = w(this, t, e), U(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== E && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : St(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = N.createElement(dt(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(e);
    else {
      const o = new wt(i, this), h = o.u(this.options);
      o.p(e), this.T(h), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = ot.get(t.strings);
    return e === void 0 && ot.set(t.strings, e = new N(t)), e;
  }
  k(t) {
    J(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const n of t) i === e.length ? e.push(s = new M(this.O(O()), this.O(O()), this, this.options)) : s = e[i], s._$AI(n), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = t.nextSibling;
      t.remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class j {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, n) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = d;
  }
  _$AI(t, e = this, s, i) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = w(this, t, e, 0), o = !U(t) || t !== this._$AH && t !== E, o && (this._$AH = t);
    else {
      const h = t;
      let a, l;
      for (t = n[0], a = 0; a < n.length - 1; a++) l = w(this, h[s + a], e, a), l === E && (l = this._$AH[a]), o || (o = !U(l) || l !== this._$AH[a]), l === d ? t = d : t !== d && (t += (l ?? "") + n[a + 1]), this._$AH[a] = l;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ct extends j {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Pt extends j {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Tt extends j {
  constructor(t, e, s, i, n) {
    super(t, e, s, i, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = w(this, t, e, 0) ?? d) === E) return;
    const s = this._$AH, i = t === d && s !== d || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== d && (s === d || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class kt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    w(this, t);
  }
}
const W = T.litHtmlPolyfillSupport;
W == null || W(N, M), (T.litHtmlVersions ?? (T.litHtmlVersions = [])).push("3.3.1");
const Ot = (r, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = i = new M(t.insertBefore(O(), n), n, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const v = globalThis;
class k extends x {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ot(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return E;
  }
}
var nt;
k._$litElement$ = !0, k.finalized = !0, (nt = v.litElementHydrateSupport) == null || nt.call(v, { LitElement: k });
const G = v.litElementPolyfillSupport;
G == null || G({ LitElement: k });
(v.litElementVersions ?? (v.litElementVersions = [])).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ut = (r) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(r, t);
  }) : customElements.define(r, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Nt = { attribute: !0, type: String, converter: R, reflect: !1, hasChanged: F }, Mt = (r = Nt, t, e) => {
  const { kind: s, metadata: i } = e;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), n.set(e.name, r), s === "accessor") {
    const { name: o } = e;
    return { set(h) {
      const a = t.get.call(this);
      t.set.call(this, h), this.requestUpdate(o, a, r);
    }, init(h) {
      return h !== void 0 && this.C(o, void 0, r, h), h;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(h) {
      const a = this[o];
      t.call(this, h), this.requestUpdate(o, a, r);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function Y(r) {
  return (t, e) => typeof e == "object" ? Mt(r, t, e) : ((s, i, n) => {
    const o = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(r, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function B(r) {
  return Y({ ...r, state: !0, attribute: !1 });
}
const Dt = "nidia_dashboard_composer/get_config", Ht = "nidia_dashboard_composer/save_config", Rt = "nidia_dashboard_composer/generate", zt = "nidia_dashboard_composer/test_run";
async function jt(r) {
  return r.callWS({ type: Dt });
}
async function Bt(r, t) {
  await r.callWS({ type: Ht, config: t });
}
async function It(r) {
  return r.callWS({ type: Rt });
}
async function Lt(r, t) {
  return r.callWS({ type: zt, scenario: t });
}
var Wt = Object.defineProperty, Gt = Object.getOwnPropertyDescriptor, S = (r, t, e, s) => {
  for (var i = s > 1 ? void 0 : s ? Gt(t, e) : t, n = r.length - 1, o; n >= 0; n--)
    (o = r[n]) && (i = (s ? o(t, e, i) : o(i)) || i);
  return s && i && Wt(t, e, i), i;
};
let _ = class extends k {
  constructor() {
    super(), this.narrow = !1, this._config = {
      areas: [],
      modules: [],
      theme: "default",
      layout_style: "standard"
    }, this._currentStep = 0, this._loading = !1, this._generatedDashboard = null, console.log("NidiaDashboardComposerPanel: Constructor called");
  }
  async connectedCallback() {
    super.connectedCallback(), console.log("NidiaDashboardComposerPanel: connectedCallback called"), await this._loadConfig();
  }
  async _loadConfig() {
    this._loading = !0;
    try {
      this._config = await jt(this.hass);
    } catch (r) {
      console.error("Failed to load config:", r);
    }
    this._loading = !1;
  }
  async _saveConfig() {
    this._loading = !0;
    try {
      await Bt(this.hass, this._config);
    } catch (r) {
      console.error("Failed to save config:", r);
    }
    this._loading = !1;
  }
  async _generate() {
    this._loading = !0;
    try {
      this._generatedDashboard = await It(this.hass);
    } catch (r) {
      console.error("Failed to generate dashboard:", r);
    }
    this._loading = !1;
  }
  _toggleModule(r) {
    const t = this._config.modules.indexOf(r);
    t > -1 ? this._config.modules.splice(t, 1) : this._config.modules.push(r), this._config = { ...this._config };
  }
  render() {
    return console.log("NidiaDashboardComposerPanel: render called"), m`
      <div class="header">
        <h1>🎨 Nidia Dashboard Composer</h1>
      </div>

      <div class="tabs">
        <button class="tab ${this._currentStep === 0 ? "active" : ""}" @click="${() => this._currentStep = 0}">
          Configure
        </button>
        <button class="tab ${this._currentStep === 1 ? "active" : ""}" @click="${() => this._currentStep = 1}">
          Generate
        </button>
        <button class="tab ${this._currentStep === 2 ? "active" : ""}" @click="${() => this._currentStep = 2}">
          Test
        </button>
      </div>

      <div class="content">
        ${this._currentStep === 0 ? this._renderConfigStep() : ""}
        ${this._currentStep === 1 ? this._renderGenerateStep() : ""}
        ${this._currentStep === 2 ? this._renderTestStep() : ""}
      </div>
    `;
  }
  _renderConfigStep() {
    return m`
      <div class="section">
        <h2>Select Modules</h2>
        <div class="checkbox-list">
          ${["light", "climate", "media", "energy"].map((t) => m`
            <label class="checkbox-item">
              <input
                type="checkbox"
                .checked="${this._config.modules.includes(t)}"
                @change="${() => this._toggleModule(t)}"
              />
              <span>${t.charAt(0).toUpperCase() + t.slice(1)}</span>
            </label>
          `)}
        </div>
      </div>

      <div class="button-group">
        <button class="button-primary" @click="${this._saveConfig}">
          Save Configuration
        </button>
      </div>
    `;
  }
  _renderGenerateStep() {
    return m`
      <div class="section">
        <h2>Generate Dashboard</h2>
        <p>Click the button below to generate a dashboard based on your configuration.</p>
        
        <div class="button-group">
          <button class="button-primary" @click="${this._generate}" ?disabled="${this._loading}">
            ${this._loading ? "Generating..." : "Generate Dashboard"}
          </button>
        </div>

        ${this._generatedDashboard ? m`
          <div style="margin-top: 24px;">
            <h2>Generated Dashboard</h2>
            <pre class="code-block">${JSON.stringify(this._generatedDashboard, null, 2)}</pre>
          </div>
        ` : ""}
      </div>
    `;
  }
  _renderTestStep() {
    return m`
      <div class="section">
        <h2>Developer Testing</h2>
        <p>Test the generator with predefined scenarios.</p>
        
        <div class="button-group">
          <button class="button-primary" @click="${() => this._runTest("small_home")}">
            Test: Small Home
          </button>
          <button class="button-primary" @click="${() => this._runTest("energy_home")}">
            Test: Energy Home
          </button>
        </div>

        ${this._generatedDashboard ? m`
          <div style="margin-top: 24px;">
            <h2>Test Result</h2>
            <pre class="code-block">${JSON.stringify(this._generatedDashboard, null, 2)}</pre>
          </div>
        ` : ""}
      </div>
    `;
  }
  async _runTest(r) {
    this._loading = !0;
    try {
      this._generatedDashboard = await Lt(this.hass, r);
    } catch (t) {
      console.error("Failed to run test:", t);
    }
    this._loading = !1;
  }
};
_.styles = ut`
    :host {
      display: block;
      padding: 16px;
      background: var(--primary-background-color, #fff);
      min-height: 100vh;
      border: 5px solid red; /* DEBUG BORDER */
      color: var(--primary-text-color, #000);
    }

    .header {
      margin-bottom: 24px;
    }

    .header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 400;
      color: var(--primary-text-color);
    }

    .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      border-bottom: 2px solid var(--divider-color);
    }

    .tab {
      padding: 12px 24px;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      font-size: 14px;
      font-weight: 500;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all 0.2s;
    }

    .tab:hover {
      color: var(--primary-text-color);
    }

    .tab.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }

    .content {
      background: var(--card-background-color);
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .section {
      margin-bottom: 24px;
    }

    .section h2 {
      font-size: 20px;
      font-weight: 500;
      margin: 0 0 16px 0;
      color: var(--primary-text-color);
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: var(--primary-text-color);
      font-weight: 500;
    }

    .checkbox-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .checkbox-item:hover {
      background: var(--secondary-background-color);
    }

    .checkbox-item input[type="checkbox"] {
      width: 20px;
      height: 20px;
    }

    .button-group {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    button {
      padding: 12px 24px;
      border-radius: 4px;
      border: none;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .button-primary {
      background: var(--primary-color);
      color: white;
    }

    .button-primary:hover {
      opacity: 0.9;
    }

    .button-secondary {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .button-secondary:hover {
      background: var(--divider-color);
    }

    .code-block {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 16px;
      border-radius: 4px;
      overflow: auto;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      max-height: 500px;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: var(--secondary-text-color);
    }
  `;
S([
  Y({ attribute: !1 })
], _.prototype, "hass", 2);
S([
  Y({ type: Boolean })
], _.prototype, "narrow", 2);
S([
  B()
], _.prototype, "_config", 2);
S([
  B()
], _.prototype, "_currentStep", 2);
S([
  B()
], _.prototype, "_loading", 2);
S([
  B()
], _.prototype, "_generatedDashboard", 2);
_ = S([
  Ut("nidia-dashboard-composer-panel")
], _);
console.log("Nidia Dashboard Composer: Module script executing...");
customElements.whenDefined("nidia-dashboard-composer-panel").then(() => {
  console.log("Nidia Dashboard Composer panel loaded");
});
