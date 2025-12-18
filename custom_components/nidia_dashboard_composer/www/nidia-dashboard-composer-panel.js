/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis, Y = z.ShadowRoot && (z.ShadyCSS === void 0 || z.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, K = Symbol(), oe = /* @__PURE__ */ new WeakMap();
let _e = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== K) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Y && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = oe.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && oe.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const be = (o) => new _e(typeof o == "string" ? o : o + "", void 0, K), xe = (o, ...e) => {
  const t = o.length === 1 ? o[0] : e.reduce((s, i, n) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + o[n + 1], o[0]);
  return new _e(t, o, K);
}, Ae = (o, e) => {
  if (Y) o.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = z.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, o.appendChild(s);
  }
}, re = Y ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return be(t);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Se, defineProperty: we, getOwnPropertyDescriptor: Ee, getOwnPropertyNames: Ce, getOwnPropertySymbols: Pe, getPrototypeOf: ke } = Object, m = globalThis, ne = m.trustedTypes, Oe = ne ? ne.emptyScript : "", W = m.reactiveElementPolyfillSupport, O = (o, e) => o, B = { toAttribute(o, e) {
  switch (e) {
    case Boolean:
      o = o ? Oe : null;
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
} }, Z = (o, e) => !Se(o, e), ae = { attribute: !0, type: String, converter: B, reflect: !1, useDefault: !1, hasChanged: Z };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), m.litPropertyMetadata ?? (m.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let E = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = ae) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && we(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: n } = Ee(this.prototype, e) ?? { get() {
      return this[t];
    }, set(r) {
      this[t] = r;
    } };
    return { get: i, set(r) {
      const c = i == null ? void 0 : i.call(this);
      n == null || n.call(this, r), this.requestUpdate(e, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ae;
  }
  static _$Ei() {
    if (this.hasOwnProperty(O("elementProperties"))) return;
    const e = ke(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(O("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(O("properties"))) {
      const t = this.properties, s = [...Ce(t), ...Pe(t)];
      for (const i of s) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, i] of t) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const i = this._$Eu(t, s);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const i of s) t.unshift(re(i));
    } else e !== void 0 && t.push(re(e));
    return t;
  }
  static _$Eu(e, t) {
    const s = t.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const s of t.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ae(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var s;
      return (s = t.hostConnected) == null ? void 0 : s.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var s;
      return (s = t.hostDisconnected) == null ? void 0 : s.call(t);
    });
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$ET(e, t) {
    var n;
    const s = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, s);
    if (i !== void 0 && s.reflect === !0) {
      const r = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : B).toAttribute(t, s.type);
      this._$Em = e, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var n, r;
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const c = s.getPropertyOptions(i), a = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((n = c.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? c.converter : B;
      this._$Em = i;
      const h = a.fromAttribute(t, c.type);
      this[i] = h ?? ((r = this._$Ej) == null ? void 0 : r.get(i)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(e, t, s) {
    var i;
    if (e !== void 0) {
      const n = this.constructor, r = this[e];
      if (s ?? (s = n.getPropertyOptions(e)), !((s.hasChanged ?? Z)(r, t) || s.useDefault && s.reflect && r === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(n._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: i, wrapped: n }, r) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, r ?? t ?? this[e]), n !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, r] of this._$Ep) this[n] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, r] of i) {
        const { wrapped: c } = r, a = this[n];
        c !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, r, a);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (s = this._$EO) == null || s.forEach((i) => {
        var n;
        return (n = i.hostUpdate) == null ? void 0 : n.call(i);
      }), this.update(t)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((s) => {
      var i;
      return (i = s.hostUpdated) == null ? void 0 : i.call(s);
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
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[O("elementProperties")] = /* @__PURE__ */ new Map(), E[O("finalized")] = /* @__PURE__ */ new Map(), W == null || W({ ReactiveElement: E }), (m.reactiveElementVersions ?? (m.reactiveElementVersions = [])).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis, I = N.trustedTypes, le = I ? I.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, fe = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, ye = "?" + v, Ne = `<${ye}>`, A = document, U = () => A.createComment(""), M = (o) => o === null || typeof o != "object" && typeof o != "function", Q = Array.isArray, Te = (o) => Q(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", F = `[ 	
\f\r]`, k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ce = /-->/g, de = />/g, $ = RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), he = /'/g, pe = /"/g, ve = /^(?:script|style|textarea|title)$/i, Ue = (o) => (e, ...t) => ({ _$litType$: o, strings: e, values: t }), g = Ue(1), C = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), ue = /* @__PURE__ */ new WeakMap(), b = A.createTreeWalker(A, 129);
function me(o, e) {
  if (!Q(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return le !== void 0 ? le.createHTML(e) : e;
}
const Me = (o, e) => {
  const t = o.length - 1, s = [];
  let i, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = k;
  for (let c = 0; c < t; c++) {
    const a = o[c];
    let h, p, d = -1, _ = 0;
    for (; _ < a.length && (r.lastIndex = _, p = r.exec(a), p !== null); ) _ = r.lastIndex, r === k ? p[1] === "!--" ? r = ce : p[1] !== void 0 ? r = de : p[2] !== void 0 ? (ve.test(p[2]) && (i = RegExp("</" + p[2], "g")), r = $) : p[3] !== void 0 && (r = $) : r === $ ? p[0] === ">" ? (r = i ?? k, d = -1) : p[1] === void 0 ? d = -2 : (d = r.lastIndex - p[2].length, h = p[1], r = p[3] === void 0 ? $ : p[3] === '"' ? pe : he) : r === pe || r === he ? r = $ : r === ce || r === de ? r = k : (r = $, i = void 0);
    const f = r === $ && o[c + 1].startsWith("/>") ? " " : "";
    n += r === k ? a + Ne : d >= 0 ? (s.push(h), a.slice(0, d) + fe + a.slice(d) + v + f) : a + v + (d === -2 ? c : f);
  }
  return [me(o, n + (o[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class H {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let n = 0, r = 0;
    const c = e.length - 1, a = this.parts, [h, p] = Me(e, t);
    if (this.el = H.createElement(h, s), b.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = b.nextNode()) !== null && a.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(fe)) {
          const _ = p[r++], f = i.getAttribute(d).split(v), l = /([.?@])?(.*)/.exec(_);
          a.push({ type: 1, index: n, name: l[2], strings: f, ctor: l[1] === "." ? Re : l[1] === "?" ? De : l[1] === "@" ? ze : L }), i.removeAttribute(d);
        } else d.startsWith(v) && (a.push({ type: 6, index: n }), i.removeAttribute(d));
        if (ve.test(i.tagName)) {
          const d = i.textContent.split(v), _ = d.length - 1;
          if (_ > 0) {
            i.textContent = I ? I.emptyScript : "";
            for (let f = 0; f < _; f++) i.append(d[f], U()), b.nextNode(), a.push({ type: 2, index: ++n });
            i.append(d[_], U());
          }
        }
      } else if (i.nodeType === 8) if (i.data === ye) a.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(v, d + 1)) !== -1; ) a.push({ type: 7, index: n }), d += v.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const s = A.createElement("template");
    return s.innerHTML = e, s;
  }
}
function P(o, e, t = o, s) {
  var r, c;
  if (e === C) return e;
  let i = s !== void 0 ? (r = t._$Co) == null ? void 0 : r[s] : t._$Cl;
  const n = M(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((c = i == null ? void 0 : i._$AO) == null || c.call(i, !1), n === void 0 ? i = void 0 : (i = new n(o), i._$AT(o, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = i : t._$Cl = i), i !== void 0 && (e = P(o, i._$AS(o, e.values), i, s)), e;
}
class He {
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
    const { el: { content: t }, parts: s } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? A).importNode(t, !0);
    b.currentNode = i;
    let n = b.nextNode(), r = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let h;
        a.type === 2 ? h = new R(n, n.nextSibling, this, e) : a.type === 1 ? h = new a.ctor(n, a.name, a.strings, this, e) : a.type === 6 && (h = new je(n, this, e)), this._$AV.push(h), a = s[++c];
      }
      r !== (a == null ? void 0 : a.index) && (n = b.nextNode(), r++);
    }
    return b.currentNode = A, i;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class R {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, s, i) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
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
    e = P(this, e, t), M(e) ? e === u || e == null || e === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : e !== this._$AH && e !== C && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Te(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== u && M(this._$AH) ? this._$AA.nextSibling.data = e : this.T(A.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = H.createElement(me(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(t);
    else {
      const r = new He(i, this), c = r.u(this.options);
      r.p(t), this.T(c), this._$AH = r;
    }
  }
  _$AC(e) {
    let t = ue.get(e.strings);
    return t === void 0 && ue.set(e.strings, t = new H(e)), t;
  }
  k(e) {
    Q(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const n of e) i === t.length ? t.push(s = new R(this.O(U()), this.O(U()), this, this.options)) : s = t[i], s._$AI(n), i++;
    i < t.length && (this._$AR(s && s._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, t); e !== this._$AB; ) {
      const i = e.nextSibling;
      e.remove(), e = i;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class L {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, i, n) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = u;
  }
  _$AI(e, t = this, s, i) {
    const n = this.strings;
    let r = !1;
    if (n === void 0) e = P(this, e, t, 0), r = !M(e) || e !== this._$AH && e !== C, r && (this._$AH = e);
    else {
      const c = e;
      let a, h;
      for (e = n[0], a = 0; a < n.length - 1; a++) h = P(this, c[s + a], t, a), h === C && (h = this._$AH[a]), r || (r = !M(h) || h !== this._$AH[a]), h === u ? e = u : e !== u && (e += (h ?? "") + n[a + 1]), this._$AH[a] = h;
    }
    r && !i && this.j(e);
  }
  j(e) {
    e === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Re extends L {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === u ? void 0 : e;
  }
}
class De extends L {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== u);
  }
}
class ze extends L {
  constructor(e, t, s, i, n) {
    super(e, t, s, i, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = P(this, e, t, 0) ?? u) === C) return;
    const s = this._$AH, i = e === u && s !== u || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, n = e !== u && (s === u || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class je {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    P(this, e);
  }
}
const q = N.litHtmlPolyfillSupport;
q == null || q(H, R), (N.litHtmlVersions ?? (N.litHtmlVersions = [])).push("3.3.1");
const Be = (o, e, t) => {
  const s = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = (t == null ? void 0 : t.renderBefore) ?? null;
    s._$litPart$ = i = new R(e.insertBefore(U(), n), n, void 0, t ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = globalThis;
class T extends E {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Be(t, this.renderRoot, this.renderOptions);
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
var ge;
T._$litElement$ = !0, T.finalized = !0, (ge = x.litElementHydrateSupport) == null || ge.call(x, { LitElement: T });
const G = x.litElementPolyfillSupport;
G == null || G({ LitElement: T });
(x.litElementVersions ?? (x.litElementVersions = [])).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ie = (o) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(o, e);
  }) : customElements.define(o, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Le = { attribute: !0, type: String, converter: B, reflect: !1, hasChanged: Z }, Ve = (o = Le, e, t) => {
  const { kind: s, metadata: i } = t;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), s === "setter" && ((o = Object.create(o)).wrapped = !0), n.set(t.name, o), s === "accessor") {
    const { name: r } = t;
    return { set(c) {
      const a = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(r, a, o);
    }, init(c) {
      return c !== void 0 && this.C(r, void 0, o, c), c;
    } };
  }
  if (s === "setter") {
    const { name: r } = t;
    return function(c) {
      const a = this[r];
      e.call(this, c), this.requestUpdate(r, a, o);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function X(o) {
  return (e, t) => typeof t == "object" ? Ve(o, e, t) : ((s, i, n) => {
    const r = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), r ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(o, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function V(o) {
  return X({ ...o, state: !0, attribute: !1 });
}
const We = "nidia_dashboard_composer/get_config", Fe = "nidia_dashboard_composer/save_config", qe = "nidia_dashboard_composer/generate";
async function Ge(o) {
  return o.callWS({ type: We });
}
async function Je(o, e) {
  await o.callWS({ type: Fe, config: e });
}
async function Ye(o) {
  return o.callWS({ type: qe });
}
var Ke = Object.defineProperty, Ze = Object.getOwnPropertyDescriptor, S = (o, e, t, s) => {
  for (var i = s > 1 ? void 0 : s ? Ze(e, t) : e, n = o.length - 1, r; n >= 0; n--)
    (r = o[n]) && (i = (s ? r(e, t, i) : r(i)) || i);
  return s && i && Ke(e, t, i), i;
};
let y = class extends T {
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
        battery_sensor: null
      }
    }, this._loading = !1, this._generatedDashboard = null, this._configLoaded = !1, this._saveStatus = "idle";
  }
  updated(o) {
    super.updated(o), !this._configLoaded && this.hass && (this._configLoaded = !0, this._loadConfig());
  }
  async _loadConfig() {
    this._loading = !0;
    try {
      this._config = await Ge(this.hass), this._config.modules.includes("home") || (this._config.modules = ["home"]);
    } catch (o) {
      console.error("Failed to load config:", o);
    }
    this._loading = !1;
  }
  async _saveConfig() {
    this._saveStatus = "saving";
    try {
      this._config.modules = ["home"], await Je(this.hass, this._config), this._saveStatus = "saved", setTimeout(() => {
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
      this._generatedDashboard = await Ye(this.hass);
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
    var s;
    if (!((s = this.hass) != null && s.areas)) return { floors: {}, noFloor: [] };
    const o = Object.values(this.hass.areas), e = {}, t = [];
    return o.forEach((i) => {
      i.floor_id ? (e[i.floor_id] || (e[i.floor_id] = []), e[i.floor_id].push(i)) : t.push(i);
    }), { floors: e, noFloor: t };
  }
  render() {
    var s, i, n, r, c, a, h, p, d, _, f;
    const o = (s = this.hass) != null && s.areas ? Object.values(this.hass.areas) : [], { floors: e, noFloor: t } = this._getAreasByFloor();
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
            ${Object.entries(e).map(([l, D]) => g`
              <div style="margin-bottom: 24px;">
                <h3 style="margin: 16px 0 12px 0; font-size: 14px; font-weight: 600; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: 0.5px;">
                  ${l}
                </h3>
                <div class="area-grid">
                  ${D.map((w) => g`
                    <div
                      class="area-card ${this._config.areas.includes(w.area_id) ? "selected" : ""}"
                      @click="${() => this._toggleArea(w.area_id)}"
                    >
                      <span class="area-icon">🏠</span>
                      <div class="area-name">${w.name}</div>
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
                  ${t.map((l) => g`
                    <div
                      class="area-card ${this._config.areas.includes(l.area_id) ? "selected" : ""}"
                      @click="${() => this._toggleArea(l.area_id)}"
                    >
                      <span class="area-icon">🏠</span>
                      <div class="area-name">${l.name}</div>
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
      <select @change="${(l) => this._onBackgroundChange(l)}" .value="${this._config.background || ""}">
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
                .checked="${((i = this._config.energy_villetta) == null ? void 0 : i.enabled) || !1}"
                @change="${(l) => {
      var D, w, ee, te, se, ie;
      this._config = {
        ...this._config,
        energy_villetta: {
          ...this._config.energy_villetta,
          enabled: l.target.checked,
          home_consumption_sensor: ((D = this._config.energy_villetta) == null ? void 0 : D.home_consumption_sensor) || null,
          import_power_sensor: ((w = this._config.energy_villetta) == null ? void 0 : w.import_power_sensor) || null,
          photovoltaic_enabled: ((ee = this._config.energy_villetta) == null ? void 0 : ee.photovoltaic_enabled) || !1,
          photovoltaic_production_sensor: ((te = this._config.energy_villetta) == null ? void 0 : te.photovoltaic_production_sensor) || null,
          battery_enabled: ((se = this._config.energy_villetta) == null ? void 0 : se.battery_enabled) || !1,
          battery_sensor: ((ie = this._config.energy_villetta) == null ? void 0 : ie.battery_sensor) || null
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
                @change="${(l) => {
      this._config = {
        ...this._config,
        energy_villetta: {
          ...this._config.energy_villetta,
          home_consumption_sensor: l.target.value || null
        }
      };
    }}"
                style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--primary-background-color); color: var(--primary-text-color);"
              >
                <option value="">Select entity...</option>
                ${this._getSensorEntities().map((l) => g`
                  <option value="${l.entity_id}">${l.friendly_name || l.entity_id}</option>
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
                @change="${(l) => {
      this._config = {
        ...this._config,
        energy_villetta: {
          ...this._config.energy_villetta,
          import_power_sensor: l.target.value || null
        }
      };
    }}"
                style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--primary-background-color); color: var(--primary-text-color);"
              >
                <option value="">Select entity...</option>
                ${this._getSensorEntities().map((l) => g`
                  <option value="${l.entity_id}">${l.friendly_name || l.entity_id}</option>
                `)}
              </select>
            </div>

            <!-- Photovoltaic Toggle -->
            <div style="margin-bottom: 16px;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input
                  type="checkbox"
                  .checked="${((a = this._config.energy_villetta) == null ? void 0 : a.photovoltaic_enabled) || !1}"
                  @change="${(l) => {
      this._config = {
        ...this._config,
        energy_villetta: {
          ...this._config.energy_villetta,
          photovoltaic_enabled: l.target.checked
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
                  @change="${(l) => {
      this._config = {
        ...this._config,
        energy_villetta: {
          ...this._config.energy_villetta,
          photovoltaic_production_sensor: l.target.value || null
        }
      };
    }}"
                  style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--primary-background-color); color: var(--primary-text-color);"
                >
                  <option value="">Select entity...</option>
                  ${this._getSensorEntities().map((l) => g`
                    <option value="${l.entity_id}">${l.friendly_name || l.entity_id}</option>
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
                  @change="${(l) => {
      this._config = {
        ...this._config,
        energy_villetta: {
          ...this._config.energy_villetta,
          battery_enabled: l.target.checked
        }
      };
    }}"
                  style="margin-right: 8px;"
                />
                <span style="font-weight: 500;">Battery Storage System</span>
              </label>
            </div>

            ${(_ = this._config.energy_villetta) != null && _.battery_enabled ? g`
              <!-- Battery Sensor -->
              <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 4px; font-weight: 500;">
                  Battery Power / Status Sensor <span style="color: red;">*</span>
                </label>
                <select
                  .value="${((f = this._config.energy_villetta) == null ? void 0 : f.battery_sensor) || ""}"
                  @change="${(l) => {
      this._config = {
        ...this._config,
        energy_villetta: {
          ...this._config.energy_villetta,
          battery_sensor: l.target.value || null
        }
      };
    }}"
                  style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--primary-background-color); color: var(--primary-text-color);"
                >
                  <option value="">Select entity...</option>
                  ${this._getSensorEntities().map((l) => g`
                    <option value="${l.entity_id}">${l.friendly_name || l.entity_id}</option>
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
y.styles = xe`
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
  X({ attribute: !1 })
], y.prototype, "hass", 2);
S([
  X({ type: Boolean })
], y.prototype, "narrow", 2);
S([
  V()
], y.prototype, "_config", 2);
S([
  V()
], y.prototype, "_loading", 2);
S([
  V()
], y.prototype, "_generatedDashboard", 2);
S([
  V()
], y.prototype, "_saveStatus", 2);
y = S([
  Ie("nidia-dashboard-composer-panel")
], y);
const j = "0.5.1", $e = "nidia_dashboard_composer_version", J = localStorage.getItem($e);
J !== j && (console.log(`Nidia Dashboard Composer: Version changed from ${J} to ${j}, clearing cache...`), localStorage.setItem($e, j), "caches" in window && caches.keys().then((o) => {
  o.forEach((e) => {
    (e.includes("nidia") || e.includes("dashboard-composer")) && caches.delete(e);
  });
}), J !== null && (console.log("Nidia Dashboard Composer: Forcing hard reload..."), window.location.reload()));
customElements.whenDefined("nidia-dashboard-composer-panel").then(() => {
  console.log(`Nidia Dashboard Composer v${j} panel loaded`);
});
