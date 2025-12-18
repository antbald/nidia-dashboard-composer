/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, F = R.ShadowRoot && (R.ShadyCSS === void 0 || R.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, J = Symbol(), Q = /* @__PURE__ */ new WeakMap();
let ce = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== J) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (F && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = Q.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && Q.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ge = (o) => new ce(typeof o == "string" ? o : o + "", void 0, J), fe = (o, ...e) => {
  const t = o.length === 1 ? o[0] : e.reduce((s, i, n) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + o[n + 1], o[0]);
  return new ce(t, o, J);
}, ve = (o, e) => {
  if (F) o.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = R.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, o.appendChild(s);
  }
}, X = F ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return ge(t);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: $e, defineProperty: ye, getOwnPropertyDescriptor: me, getOwnPropertyNames: be, getOwnPropertySymbols: Ae, getPrototypeOf: xe } = Object, $ = globalThis, ee = $.trustedTypes, Se = ee ? ee.emptyScript : "", B = $.reactiveElementPolyfillSupport, P = (o, e) => o, z = { toAttribute(o, e) {
  switch (e) {
    case Boolean:
      o = o ? Se : null;
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
} }, Y = (o, e) => !$e(o, e), te = { attribute: !0, type: String, converter: z, reflect: !1, useDefault: !1, hasChanged: Y };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), $.litPropertyMetadata ?? ($.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let S = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = te) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && ye(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: n } = me(this.prototype, e) ?? { get() {
      return this[t];
    }, set(r) {
      this[t] = r;
    } };
    return { get: i, set(r) {
      const l = i == null ? void 0 : i.call(this);
      n == null || n.call(this, r), this.requestUpdate(e, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? te;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const e = xe(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const t = this.properties, s = [...be(t), ...Ae(t)];
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
      for (const i of s) t.unshift(X(i));
    } else e !== void 0 && t.push(X(e));
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
    return ve(e, this.constructor.elementStyles), e;
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
      const r = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : z).toAttribute(t, s.type);
      this._$Em = e, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var n, r;
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const l = s.getPropertyOptions(i), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : z;
      this._$Em = i;
      const h = a.fromAttribute(t, l.type);
      this[i] = h ?? ((r = this._$Ej) == null ? void 0 : r.get(i)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(e, t, s) {
    var i;
    if (e !== void 0) {
      const n = this.constructor, r = this[e];
      if (s ?? (s = n.getPropertyOptions(e)), !((s.hasChanged ?? Y)(r, t) || s.useDefault && s.reflect && r === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(n._$Eu(e, s)))) return;
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
        const { wrapped: l } = r, a = this[n];
        l !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, r, a);
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
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[P("elementProperties")] = /* @__PURE__ */ new Map(), S[P("finalized")] = /* @__PURE__ */ new Map(), B == null || B({ ReactiveElement: S }), ($.reactiveElementVersions ?? ($.reactiveElementVersions = [])).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k = globalThis, j = k.trustedTypes, se = j ? j.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, he = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, de = "?" + v, we = `<${de}>`, A = document, N = () => A.createComment(""), T = (o) => o === null || typeof o != "object" && typeof o != "function", K = Array.isArray, Ee = (o) => K(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", V = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ie = /-->/g, oe = />/g, y = RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), re = /'/g, ne = /"/g, pe = /^(?:script|style|textarea|title)$/i, Ce = (o) => (e, ...t) => ({ _$litType$: o, strings: e, values: t }), _ = Ce(1), w = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), ae = /* @__PURE__ */ new WeakMap(), m = A.createTreeWalker(A, 129);
function ue(o, e) {
  if (!K(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return se !== void 0 ? se.createHTML(e) : e;
}
const Pe = (o, e) => {
  const t = o.length - 1, s = [];
  let i, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = C;
  for (let l = 0; l < t; l++) {
    const a = o[l];
    let h, d, c = -1, u = 0;
    for (; u < a.length && (r.lastIndex = u, d = r.exec(a), d !== null); ) u = r.lastIndex, r === C ? d[1] === "!--" ? r = ie : d[1] !== void 0 ? r = oe : d[2] !== void 0 ? (pe.test(d[2]) && (i = RegExp("</" + d[2], "g")), r = y) : d[3] !== void 0 && (r = y) : r === y ? d[0] === ">" ? (r = i ?? C, c = -1) : d[1] === void 0 ? c = -2 : (c = r.lastIndex - d[2].length, h = d[1], r = d[3] === void 0 ? y : d[3] === '"' ? ne : re) : r === ne || r === re ? r = y : r === ie || r === oe ? r = C : (r = y, i = void 0);
    const f = r === y && o[l + 1].startsWith("/>") ? " " : "";
    n += r === C ? a + we : c >= 0 ? (s.push(h), a.slice(0, c) + he + a.slice(c) + v + f) : a + v + (c === -2 ? l : f);
  }
  return [ue(o, n + (o[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class U {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let n = 0, r = 0;
    const l = e.length - 1, a = this.parts, [h, d] = Pe(e, t);
    if (this.el = U.createElement(h, s), m.currentNode = this.el.content, t === 2 || t === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = m.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(he)) {
          const u = d[r++], f = i.getAttribute(c).split(v), H = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: n, name: H[2], strings: f, ctor: H[1] === "." ? Oe : H[1] === "?" ? Ne : H[1] === "@" ? Te : I }), i.removeAttribute(c);
        } else c.startsWith(v) && (a.push({ type: 6, index: n }), i.removeAttribute(c));
        if (pe.test(i.tagName)) {
          const c = i.textContent.split(v), u = c.length - 1;
          if (u > 0) {
            i.textContent = j ? j.emptyScript : "";
            for (let f = 0; f < u; f++) i.append(c[f], N()), m.nextNode(), a.push({ type: 2, index: ++n });
            i.append(c[u], N());
          }
        }
      } else if (i.nodeType === 8) if (i.data === de) a.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = i.data.indexOf(v, c + 1)) !== -1; ) a.push({ type: 7, index: n }), c += v.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const s = A.createElement("template");
    return s.innerHTML = e, s;
  }
}
function E(o, e, t = o, s) {
  var r, l;
  if (e === w) return e;
  let i = s !== void 0 ? (r = t._$Co) == null ? void 0 : r[s] : t._$Cl;
  const n = T(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((l = i == null ? void 0 : i._$AO) == null || l.call(i, !1), n === void 0 ? i = void 0 : (i = new n(o), i._$AT(o, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = i : t._$Cl = i), i !== void 0 && (e = E(o, i._$AS(o, e.values), i, s)), e;
}
class ke {
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
    m.currentNode = i;
    let n = m.nextNode(), r = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let h;
        a.type === 2 ? h = new M(n, n.nextSibling, this, e) : a.type === 1 ? h = new a.ctor(n, a.name, a.strings, this, e) : a.type === 6 && (h = new Ue(n, this, e)), this._$AV.push(h), a = s[++l];
      }
      r !== (a == null ? void 0 : a.index) && (n = m.nextNode(), r++);
    }
    return m.currentNode = A, i;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class M {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, s, i) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
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
    e = E(this, e, t), T(e) ? e === p || e == null || e === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : e !== this._$AH && e !== w && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ee(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== p && T(this._$AH) ? this._$AA.nextSibling.data = e : this.T(A.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = U.createElement(ue(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(t);
    else {
      const r = new ke(i, this), l = r.u(this.options);
      r.p(t), this.T(l), this._$AH = r;
    }
  }
  _$AC(e) {
    let t = ae.get(e.strings);
    return t === void 0 && ae.set(e.strings, t = new U(e)), t;
  }
  k(e) {
    K(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const n of e) i === t.length ? t.push(s = new M(this.O(N()), this.O(N()), this, this.options)) : s = t[i], s._$AI(n), i++;
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
class I {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, i, n) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(e, t = this, s, i) {
    const n = this.strings;
    let r = !1;
    if (n === void 0) e = E(this, e, t, 0), r = !T(e) || e !== this._$AH && e !== w, r && (this._$AH = e);
    else {
      const l = e;
      let a, h;
      for (e = n[0], a = 0; a < n.length - 1; a++) h = E(this, l[s + a], t, a), h === w && (h = this._$AH[a]), r || (r = !T(h) || h !== this._$AH[a]), h === p ? e = p : e !== p && (e += (h ?? "") + n[a + 1]), this._$AH[a] = h;
    }
    r && !i && this.j(e);
  }
  j(e) {
    e === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Oe extends I {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === p ? void 0 : e;
  }
}
class Ne extends I {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== p);
  }
}
class Te extends I {
  constructor(e, t, s, i, n) {
    super(e, t, s, i, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = E(this, e, t, 0) ?? p) === w) return;
    const s = this._$AH, i = e === p && s !== p || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, n = e !== p && (s === p || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ue {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    E(this, e);
  }
}
const W = k.litHtmlPolyfillSupport;
W == null || W(U, M), (k.litHtmlVersions ?? (k.litHtmlVersions = [])).push("3.3.1");
const Me = (o, e, t) => {
  const s = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = (t == null ? void 0 : t.renderBefore) ?? null;
    s._$litPart$ = i = new M(e.insertBefore(N(), n), n, void 0, t ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const b = globalThis;
class O extends S {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Me(t, this.renderRoot, this.renderOptions);
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
    return w;
  }
}
var le;
O._$litElement$ = !0, O.finalized = !0, (le = b.litElementHydrateSupport) == null || le.call(b, { LitElement: O });
const q = b.litElementPolyfillSupport;
q == null || q({ LitElement: O });
(b.litElementVersions ?? (b.litElementVersions = [])).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const He = (o) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(o, e);
  }) : customElements.define(o, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Re = { attribute: !0, type: String, converter: z, reflect: !1, hasChanged: Y }, De = (o = Re, e, t) => {
  const { kind: s, metadata: i } = t;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), s === "setter" && ((o = Object.create(o)).wrapped = !0), n.set(t.name, o), s === "accessor") {
    const { name: r } = t;
    return { set(l) {
      const a = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(r, a, o);
    }, init(l) {
      return l !== void 0 && this.C(r, void 0, o, l), l;
    } };
  }
  if (s === "setter") {
    const { name: r } = t;
    return function(l) {
      const a = this[r];
      e.call(this, l), this.requestUpdate(r, a, o);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function Z(o) {
  return (e, t) => typeof t == "object" ? De(o, e, t) : ((s, i, n) => {
    const r = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), r ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(o, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function L(o) {
  return Z({ ...o, state: !0, attribute: !1 });
}
const ze = "nidia_dashboard_composer/get_config", je = "nidia_dashboard_composer/save_config", Ie = "nidia_dashboard_composer/generate";
async function Le(o) {
  return o.callWS({ type: ze });
}
async function Be(o, e) {
  await o.callWS({ type: je, config: e });
}
async function Ve(o) {
  return o.callWS({ type: Ie });
}
var We = Object.defineProperty, qe = Object.getOwnPropertyDescriptor, x = (o, e, t, s) => {
  for (var i = s > 1 ? void 0 : s ? qe(e, t) : e, n = o.length - 1, r; n >= 0; n--)
    (r = o[n]) && (i = (s ? r(e, t, i) : r(i)) || i);
  return s && i && We(e, t, i), i;
};
let g = class extends O {
  constructor() {
    super(), this.narrow = !1, this._config = {
      areas: [],
      modules: [],
      theme: "default",
      layout_style: "standard",
      energy_villetta: {
        enabled: !1,
        home_consumption_sensor: null,
        photovoltaic_enabled: !1,
        photovoltaic_production_sensor: null
      }
    }, this._loading = !1, this._generatedDashboard = null, this._configLoaded = !1, this._saveStatus = "idle";
  }
  updated(o) {
    super.updated(o), !this._configLoaded && this.hass && (this._configLoaded = !0, this._loadConfig());
  }
  async _loadConfig() {
    this._loading = !0;
    try {
      this._config = await Le(this.hass), this._config.modules.includes("home") || (this._config.modules = ["home"]);
    } catch (o) {
      console.error("Failed to load config:", o);
    }
    this._loading = !1;
  }
  async _saveConfig() {
    this._saveStatus = "saving";
    try {
      this._config.modules = ["home"], await Be(this.hass, this._config), this._saveStatus = "saved", setTimeout(() => {
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
      this._generatedDashboard = await Ve(this.hass);
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
  render() {
    var e, t, s, i, n, r, l;
    const o = (e = this.hass) != null && e.areas ? Object.values(this.hass.areas) : [];
    return _`
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
          
          ${o.length > 0 ? _`
            <div class="area-grid">
              ${o.map((a) => _`
                <div 
                  class="area-card ${this._config.areas.includes(a.area_id) ? "selected" : ""}"
                  @click="${() => this._toggleArea(a.area_id)}"
                >
                  <span class="area-icon">🏠</span>
                  <div class="area-name">${a.name}</div>
                </div>
              `)}
            </div>
          ` : _`
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
                .checked="${((t = this._config.energy_villetta) == null ? void 0 : t.enabled) || !1}"
                @change="${(a) => {
      var h, d, c;
      this._config = {
        ...this._config,
        energy_villetta: {
          ...this._config.energy_villetta,
          enabled: a.target.checked,
          home_consumption_sensor: ((h = this._config.energy_villetta) == null ? void 0 : h.home_consumption_sensor) || null,
          photovoltaic_enabled: ((d = this._config.energy_villetta) == null ? void 0 : d.photovoltaic_enabled) || !1,
          photovoltaic_production_sensor: ((c = this._config.energy_villetta) == null ? void 0 : c.photovoltaic_production_sensor) || null
        }
      };
    }}"
                style="margin-right: 8px;"
              />
              <span style="font-weight: 500;">Enable Energy Image Module</span>
            </label>
          </div>

          ${(s = this._config.energy_villetta) != null && s.enabled ? _`
            <!-- Home Consumption Sensor -->
            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 4px; font-weight: 500;">
                Home Consumption Sensor <span style="color: red;">*</span>
              </label>
              <select
                .value="${((i = this._config.energy_villetta) == null ? void 0 : i.home_consumption_sensor) || ""}"
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
                ${this._getSensorEntities().map((a) => _`
                  <option value="${a.entity_id}">${a.friendly_name || a.entity_id}</option>
                `)}
              </select>
            </div>

            <!-- Photovoltaic Toggle -->
            <div style="margin-bottom: 16px;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input
                  type="checkbox"
                  .checked="${((n = this._config.energy_villetta) == null ? void 0 : n.photovoltaic_enabled) || !1}"
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

            ${(r = this._config.energy_villetta) != null && r.photovoltaic_enabled ? _`
              <!-- PV Production Sensor -->
              <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 4px; font-weight: 500;">
                  Instant Photovoltaic Production Sensor <span style="color: red;">*</span>
                </label>
                <select
                  .value="${((l = this._config.energy_villetta) == null ? void 0 : l.photovoltaic_production_sensor) || ""}"
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
                  ${this._getSensorEntities().map((a) => _`
                    <option value="${a.entity_id}">${a.friendly_name || a.entity_id}</option>
                  `)}
                </select>
              </div>
            ` : ""}
          ` : ""}
        </div>

        ${this._generatedDashboard ? _`
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
g.styles = fe`
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
x([
  Z({ attribute: !1 })
], g.prototype, "hass", 2);
x([
  Z({ type: Boolean })
], g.prototype, "narrow", 2);
x([
  L()
], g.prototype, "_config", 2);
x([
  L()
], g.prototype, "_loading", 2);
x([
  L()
], g.prototype, "_generatedDashboard", 2);
x([
  L()
], g.prototype, "_saveStatus", 2);
g = x([
  He("nidia-dashboard-composer-panel")
], g);
const D = "0.5.1", _e = "nidia_dashboard_composer_version", G = localStorage.getItem(_e);
G !== D && (console.log(`Nidia Dashboard Composer: Version changed from ${G} to ${D}, clearing cache...`), localStorage.setItem(_e, D), "caches" in window && caches.keys().then((o) => {
  o.forEach((e) => {
    (e.includes("nidia") || e.includes("dashboard-composer")) && caches.delete(e);
  });
}), G !== null && (console.log("Nidia Dashboard Composer: Forcing hard reload..."), window.location.reload()));
customElements.whenDefined("nidia-dashboard-composer-panel").then(() => {
  console.log(`Nidia Dashboard Composer v${D} panel loaded`);
});
