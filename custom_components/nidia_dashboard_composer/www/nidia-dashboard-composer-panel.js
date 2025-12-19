/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, q = R.ShadowRoot && (R.ShadyCSS === void 0 || R.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, J = Symbol(), Z = /* @__PURE__ */ new WeakMap();
let ce = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== J) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (q && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = Z.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && Z.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const fe = (r) => new ce(typeof r == "string" ? r : r + "", void 0, J), ve = (r, ...e) => {
  const t = r.length === 1 ? r[0] : e.reduce((s, o, a) => s + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + r[a + 1], r[0]);
  return new ce(t, r, J);
}, _e = (r, e) => {
  if (q) r.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), o = R.litNonce;
    o !== void 0 && s.setAttribute("nonce", o), s.textContent = t.cssText, r.appendChild(s);
  }
}, Q = q ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return fe(t);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: be, defineProperty: me, getOwnPropertyDescriptor: ye, getOwnPropertyNames: $e, getOwnPropertySymbols: xe, getPrototypeOf: we } = Object, m = globalThis, ee = m.trustedTypes, Ae = ee ? ee.emptyScript : "", L = m.reactiveElementPolyfillSupport, O = (r, e) => r, j = { toAttribute(r, e) {
  switch (e) {
    case Boolean:
      r = r ? Ae : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, e) {
  let t = r;
  switch (e) {
    case Boolean:
      t = r !== null;
      break;
    case Number:
      t = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(r);
      } catch {
        t = null;
      }
  }
  return t;
} }, Y = (r, e) => !be(r, e), te = { attribute: !0, type: String, converter: j, reflect: !1, useDefault: !1, hasChanged: Y };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), m.litPropertyMetadata ?? (m.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let A = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = te) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), o = this.getPropertyDescriptor(e, s, t);
      o !== void 0 && me(this.prototype, e, o);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: o, set: a } = ye(this.prototype, e) ?? { get() {
      return this[t];
    }, set(i) {
      this[t] = i;
    } };
    return { get: o, set(i) {
      const l = o == null ? void 0 : o.call(this);
      a == null || a.call(this, i), this.requestUpdate(e, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? te;
  }
  static _$Ei() {
    if (this.hasOwnProperty(O("elementProperties"))) return;
    const e = we(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(O("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(O("properties"))) {
      const t = this.properties, s = [...$e(t), ...xe(t)];
      for (const o of s) this.createProperty(o, t[o]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, o] of t) this.elementProperties.set(s, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const o = this._$Eu(t, s);
      o !== void 0 && this._$Eh.set(o, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const o of s) t.unshift(Q(o));
    } else e !== void 0 && t.push(Q(e));
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
    return _e(e, this.constructor.elementStyles), e;
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
    var a;
    const s = this.constructor.elementProperties.get(e), o = this.constructor._$Eu(e, s);
    if (o !== void 0 && s.reflect === !0) {
      const i = (((a = s.converter) == null ? void 0 : a.toAttribute) !== void 0 ? s.converter : j).toAttribute(t, s.type);
      this._$Em = e, i == null ? this.removeAttribute(o) : this.setAttribute(o, i), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var a, i;
    const s = this.constructor, o = s._$Eh.get(e);
    if (o !== void 0 && this._$Em !== o) {
      const l = s.getPropertyOptions(o), n = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((a = l.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? l.converter : j;
      this._$Em = o;
      const p = n.fromAttribute(t, l.type);
      this[o] = p ?? ((i = this._$Ej) == null ? void 0 : i.get(o)) ?? p, this._$Em = null;
    }
  }
  requestUpdate(e, t, s) {
    var o;
    if (e !== void 0) {
      const a = this.constructor, i = this[e];
      if (s ?? (s = a.getPropertyOptions(e)), !((s.hasChanged ?? Y)(i, t) || s.useDefault && s.reflect && i === ((o = this._$Ej) == null ? void 0 : o.get(e)) && !this.hasAttribute(a._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: o, wrapped: a }, i) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, i ?? t ?? this[e]), a !== !0 || i !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), o === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [a, i] of this._$Ep) this[a] = i;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [a, i] of o) {
        const { wrapped: l } = i, n = this[a];
        l !== !0 || this._$AL.has(a) || n === void 0 || this.C(a, void 0, i, n);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (s = this._$EO) == null || s.forEach((o) => {
        var a;
        return (a = o.hostUpdate) == null ? void 0 : a.call(o);
      }), this.update(t)) : this._$EM();
    } catch (o) {
      throw e = !1, this._$EM(), o;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((s) => {
      var o;
      return (o = s.hostUpdated) == null ? void 0 : o.call(s);
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
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[O("elementProperties")] = /* @__PURE__ */ new Map(), A[O("finalized")] = /* @__PURE__ */ new Map(), L == null || L({ ReactiveElement: A }), (m.reactiveElementVersions ?? (m.reactiveElementVersions = [])).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis, B = P.trustedTypes, se = B ? B.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, de = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, pe = "?" + b, Se = `<${pe}>`, w = document, N = () => w.createComment(""), z = (r) => r === null || typeof r != "object" && typeof r != "function", K = Array.isArray, Ee = (r) => K(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", V = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, oe = /-->/g, re = />/g, y = RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ie = /'/g, ae = /"/g, he = /^(?:script|style|textarea|title)$/i, ke = (r) => (e, ...t) => ({ _$litType$: r, strings: e, values: t }), c = ke(1), S = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), ne = /* @__PURE__ */ new WeakMap(), $ = w.createTreeWalker(w, 129);
function ue(r, e) {
  if (!K(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return se !== void 0 ? se.createHTML(e) : e;
}
const Ce = (r, e) => {
  const t = r.length - 1, s = [];
  let o, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", i = C;
  for (let l = 0; l < t; l++) {
    const n = r[l];
    let p, u, d = -1, f = 0;
    for (; f < n.length && (i.lastIndex = f, u = i.exec(n), u !== null); ) f = i.lastIndex, i === C ? u[1] === "!--" ? i = oe : u[1] !== void 0 ? i = re : u[2] !== void 0 ? (he.test(u[2]) && (o = RegExp("</" + u[2], "g")), i = y) : u[3] !== void 0 && (i = y) : i === y ? u[0] === ">" ? (i = o ?? C, d = -1) : u[1] === void 0 ? d = -2 : (d = i.lastIndex - u[2].length, p = u[1], i = u[3] === void 0 ? y : u[3] === '"' ? ae : ie) : i === ae || i === ie ? i = y : i === oe || i === re ? i = C : (i = y, o = void 0);
    const _ = i === y && r[l + 1].startsWith("/>") ? " " : "";
    a += i === C ? n + Se : d >= 0 ? (s.push(p), n.slice(0, d) + de + n.slice(d) + b + _) : n + b + (d === -2 ? l : _);
  }
  return [ue(r, a + (r[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class U {
  constructor({ strings: e, _$litType$: t }, s) {
    let o;
    this.parts = [];
    let a = 0, i = 0;
    const l = e.length - 1, n = this.parts, [p, u] = Ce(e, t);
    if (this.el = U.createElement(p, s), $.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (o = $.nextNode()) !== null && n.length < l; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const d of o.getAttributeNames()) if (d.endsWith(de)) {
          const f = u[i++], _ = o.getAttribute(d).split(b), H = /([.?@])?(.*)/.exec(f);
          n.push({ type: 1, index: a, name: H[2], strings: _, ctor: H[1] === "." ? Pe : H[1] === "?" ? Te : H[1] === "@" ? Ne : I }), o.removeAttribute(d);
        } else d.startsWith(b) && (n.push({ type: 6, index: a }), o.removeAttribute(d));
        if (he.test(o.tagName)) {
          const d = o.textContent.split(b), f = d.length - 1;
          if (f > 0) {
            o.textContent = B ? B.emptyScript : "";
            for (let _ = 0; _ < f; _++) o.append(d[_], N()), $.nextNode(), n.push({ type: 2, index: ++a });
            o.append(d[f], N());
          }
        }
      } else if (o.nodeType === 8) if (o.data === pe) n.push({ type: 2, index: a });
      else {
        let d = -1;
        for (; (d = o.data.indexOf(b, d + 1)) !== -1; ) n.push({ type: 7, index: a }), d += b.length - 1;
      }
      a++;
    }
  }
  static createElement(e, t) {
    const s = w.createElement("template");
    return s.innerHTML = e, s;
  }
}
function E(r, e, t = r, s) {
  var i, l;
  if (e === S) return e;
  let o = s !== void 0 ? (i = t._$Co) == null ? void 0 : i[s] : t._$Cl;
  const a = z(e) ? void 0 : e._$litDirective$;
  return (o == null ? void 0 : o.constructor) !== a && ((l = o == null ? void 0 : o._$AO) == null || l.call(o, !1), a === void 0 ? o = void 0 : (o = new a(r), o._$AT(r, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = o : t._$Cl = o), o !== void 0 && (e = E(r, o._$AS(r, e.values), o, s)), e;
}
class Oe {
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
    const { el: { content: t }, parts: s } = this._$AD, o = ((e == null ? void 0 : e.creationScope) ?? w).importNode(t, !0);
    $.currentNode = o;
    let a = $.nextNode(), i = 0, l = 0, n = s[0];
    for (; n !== void 0; ) {
      if (i === n.index) {
        let p;
        n.type === 2 ? p = new M(a, a.nextSibling, this, e) : n.type === 1 ? p = new n.ctor(a, n.name, n.strings, this, e) : n.type === 6 && (p = new ze(a, this, e)), this._$AV.push(p), n = s[++l];
      }
      i !== (n == null ? void 0 : n.index) && (a = $.nextNode(), i++);
    }
    return $.currentNode = w, o;
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
  constructor(e, t, s, o) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = o, this._$Cv = (o == null ? void 0 : o.isConnected) ?? !0;
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
    e = E(this, e, t), z(e) ? e === h || e == null || e === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : e !== this._$AH && e !== S && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ee(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== h && z(this._$AH) ? this._$AA.nextSibling.data = e : this.T(w.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var a;
    const { values: t, _$litType$: s } = e, o = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = U.createElement(ue(s.h, s.h[0]), this.options)), s);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === o) this._$AH.p(t);
    else {
      const i = new Oe(o, this), l = i.u(this.options);
      i.p(t), this.T(l), this._$AH = i;
    }
  }
  _$AC(e) {
    let t = ne.get(e.strings);
    return t === void 0 && ne.set(e.strings, t = new U(e)), t;
  }
  k(e) {
    K(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, o = 0;
    for (const a of e) o === t.length ? t.push(s = new M(this.O(N()), this.O(N()), this, this.options)) : s = t[o], s._$AI(a), o++;
    o < t.length && (this._$AR(s && s._$AB.nextSibling, o), t.length = o);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, t); e !== this._$AB; ) {
      const o = e.nextSibling;
      e.remove(), e = o;
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
  constructor(e, t, s, o, a) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = e, this.name = t, this._$AM = o, this.options = a, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = h;
  }
  _$AI(e, t = this, s, o) {
    const a = this.strings;
    let i = !1;
    if (a === void 0) e = E(this, e, t, 0), i = !z(e) || e !== this._$AH && e !== S, i && (this._$AH = e);
    else {
      const l = e;
      let n, p;
      for (e = a[0], n = 0; n < a.length - 1; n++) p = E(this, l[s + n], t, n), p === S && (p = this._$AH[n]), i || (i = !z(p) || p !== this._$AH[n]), p === h ? e = h : e !== h && (e += (p ?? "") + a[n + 1]), this._$AH[n] = p;
    }
    i && !o && this.j(e);
  }
  j(e) {
    e === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Pe extends I {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === h ? void 0 : e;
  }
}
class Te extends I {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== h);
  }
}
class Ne extends I {
  constructor(e, t, s, o, a) {
    super(e, t, s, o, a), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = E(this, e, t, 0) ?? h) === S) return;
    const s = this._$AH, o = e === h && s !== h || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, a = e !== h && (s === h || o);
    o && this.element.removeEventListener(this.name, this, s), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ze {
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
const W = P.litHtmlPolyfillSupport;
W == null || W(U, M), (P.litHtmlVersions ?? (P.litHtmlVersions = [])).push("3.3.1");
const Ue = (r, e, t) => {
  const s = (t == null ? void 0 : t.renderBefore) ?? e;
  let o = s._$litPart$;
  if (o === void 0) {
    const a = (t == null ? void 0 : t.renderBefore) ?? null;
    s._$litPart$ = o = new M(e.insertBefore(N(), a), a, void 0, t ?? {});
  }
  return o._$AI(r), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = globalThis;
class T extends A {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ue(t, this.renderRoot, this.renderOptions);
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
    return S;
  }
}
var le;
T._$litElement$ = !0, T.finalized = !0, (le = x.litElementHydrateSupport) == null || le.call(x, { LitElement: T });
const G = x.litElementPolyfillSupport;
G == null || G({ LitElement: T });
(x.litElementVersions ?? (x.litElementVersions = [])).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Me = (r) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(r, e);
  }) : customElements.define(r, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const He = { attribute: !0, type: String, converter: j, reflect: !1, hasChanged: Y }, Re = (r = He, e, t) => {
  const { kind: s, metadata: o } = t;
  let a = globalThis.litPropertyMetadata.get(o);
  if (a === void 0 && globalThis.litPropertyMetadata.set(o, a = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), a.set(t.name, r), s === "accessor") {
    const { name: i } = t;
    return { set(l) {
      const n = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(i, n, r);
    }, init(l) {
      return l !== void 0 && this.C(i, void 0, r, l), l;
    } };
  }
  if (s === "setter") {
    const { name: i } = t;
    return function(l) {
      const n = this[i];
      e.call(this, l), this.requestUpdate(i, n, r);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function X(r) {
  return (e, t) => typeof t == "object" ? Re(r, e, t) : ((s, o, a) => {
    const i = o.hasOwnProperty(a);
    return o.constructor.createProperty(a, s), i ? Object.getOwnPropertyDescriptor(o, a) : void 0;
  })(r, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function k(r) {
  return X({ ...r, state: !0, attribute: !1 });
}
const De = "nidia_dashboard_composer/get_config", je = "nidia_dashboard_composer/save_config", Be = "nidia_dashboard_composer/generate";
async function Ie(r) {
  return r.callWS({ type: De });
}
async function Le(r, e) {
  await r.callWS({ type: je, config: e });
}
async function Ve(r) {
  return r.callWS({ type: Be });
}
var We = Object.defineProperty, Ge = Object.getOwnPropertyDescriptor, v = (r, e, t, s) => {
  for (var o = s > 1 ? void 0 : s ? Ge(e, t) : e, a = r.length - 1, i; a >= 0; a--)
    (i = r[a]) && (o = (s ? i(e, t, o) : i(o)) || o);
  return s && o && We(e, t, o), o;
};
let g = class extends T {
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
    }, this._loading = !1, this._generatedDashboard = null, this._activeTab = "general", this._saveStatus = "idle", this._sidebarOpen = !1, this._configLoaded = !1;
  }
  updated(r) {
    super.updated(r), !this._configLoaded && this.hass && (this._configLoaded = !0, this._loadConfig());
  }
  async _loadConfig() {
    this._loading = !0;
    try {
      this._config = await Ie(this.hass), this._config.modules.includes("home") || (this._config.modules = ["home"]);
    } catch (r) {
      console.error("Failed to load config:", r);
    }
    this._loading = !1;
  }
  async _saveConfig() {
    this._saveStatus = "saving";
    try {
      this._config.modules = ["home"], await Le(this.hass, this._config), this._saveStatus = "saved", setTimeout(() => {
        this._saveStatus = "idle";
      }, 2e3);
    } catch (r) {
      console.error("Failed to save config:", r), this._saveStatus = "error", setTimeout(() => {
        this._saveStatus = "idle";
      }, 3e3);
    }
  }
  _onBackgroundChange(r) {
    const t = r.target.value;
    this._config = { ...this._config, background: t || void 0 };
  }
  async _generate() {
    this._loading = !0;
    try {
      this._generatedDashboard = await Ve(this.hass);
    } catch (r) {
      console.error("Failed to generate dashboard:", r);
    }
    this._loading = !1;
  }
  _toggleArea(r) {
    const e = this._config.areas.indexOf(r), t = [...this._config.areas];
    e > -1 ? t.splice(e, 1) : t.push(r), this._config = { ...this._config, areas: t };
  }
  _selectAllAreas() {
    this.hass.areas && (this._config = { ...this._config, areas: Object.keys(this.hass.areas) });
  }
  _deselectAllAreas() {
    this._config = { ...this._config, areas: [] };
  }
  _getSensorEntities() {
    var r;
    return (r = this.hass) != null && r.states ? Object.values(this.hass.states).filter((e) => e.entity_id.startsWith("sensor.")).map((e) => ({
      entity_id: e.entity_id,
      friendly_name: e.attributes.friendly_name || e.entity_id
    })).sort((e, t) => e.friendly_name.localeCompare(t.friendly_name)) : [];
  }
  _getAreasByFloor() {
    var s;
    if (!((s = this.hass) != null && s.areas)) return { floors: {}, noFloor: [] };
    const r = Object.values(this.hass.areas), e = {}, t = [];
    return r.forEach((o) => {
      o.floor_id ? (e[o.floor_id] || (e[o.floor_id] = []), e[o.floor_id].push(o)) : t.push(o);
    }), { floors: e, noFloor: t };
  }
  render() {
    return c`
      <div class="app-layout">
        <div class="mobile-header">
          <button class="menu-button" @click="${() => this._sidebarOpen = !0}">☰</button>
          <h2 style="margin: 0; font-size: 16px;">Nidia Composer</h2>
        </div>

        <aside class="sidebar ${this._sidebarOpen ? "open" : ""}">
          <div class="sidebar-header">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h1>Nidia Composer</h1>
              ${this.narrow ? c`<button class="menu-button" @click="${() => this._sidebarOpen = !1}">✕</button>` : ""}
            </div>
            <p>v0.6.2 • Dashboard Tool</p>
          </div>
          
          <nav class="nav-items">
            <div class="nav-item ${this._activeTab === "general" ? "active" : ""}" @click="${() => {
      this._activeTab = "general", this._sidebarOpen = !1;
    }}">
              <span class="nav-icon">⚙️</span>
              <span>General Settings</span>
            </div>
            <div class="nav-item ${this._activeTab === "areas" ? "active" : ""}" @click="${() => {
      this._activeTab = "areas", this._sidebarOpen = !1;
    }}">
              <span class="nav-icon">🏠</span>
              <span>Room Selection</span>
            </div>
            <div class="nav-item ${this._activeTab === "energy" ? "active" : ""}" @click="${() => {
      this._activeTab = "energy", this._sidebarOpen = !1;
    }}">
              <span class="nav-icon">⚡</span>
              <span>Energy Module</span>
            </div>
            <div class="nav-item ${this._activeTab === "preview" ? "active" : ""}" @click="${() => {
      this._activeTab = "preview", this._sidebarOpen = !1;
    }}">
              <span class="nav-icon">👁️</span>
              <span>Preview & JSON</span>
            </div>
          </nav>

          <div class="sidebar-footer">
            ${this._saveStatus !== "idle" ? c`
              <div class="status-badge status-${this._saveStatus}">
                ${this._saveStatus === "saving" ? "Saving..." : this._saveStatus === "saved" ? "Config Saved!" : "Error Saving"}
              </div>
            ` : ""}
          </div>
        </aside>

        ${this._sidebarOpen ? c`<div class="sidebar-overlay" @click="${() => this._sidebarOpen = !1}"></div>` : ""}

        <main class="main-content">
          <div class="content-container">
            ${this._renderActiveTab()}
          </div>

          <div class="floating-actions">
            <button class="btn-secondary" @click="${this._loadConfig}">
              Reset
            </button>
            <button 
              class="btn-primary" 
              @click="${async () => {
      await this._saveConfig(), await this._generate();
    }}"
              ?disabled="${this._saveStatus === "saving" || this._loading}"
            >
              ${this._loading ? "Working..." : "Save & Generate Dashboard"}
            </button>
          </div>
        </main>
      </div>
    `;
  }
  _renderActiveTab() {
    switch (this._activeTab) {
      case "general":
        return this._renderGeneralTab();
      case "areas":
        return this._renderAreasTab();
      case "energy":
        return this._renderEnergyTab();
      case "preview":
        return this._renderPreviewTab();
      default:
        return c``;
    }
  }
  _renderGeneralTab() {
    return c`
      <div class="page-header">
        <h2>General Settings</h2>
        <p>Configure the basic look and feel of your dashboard.</p>
      </div>

      <div class="glass-card">
        <h3 class="section-title">Visual Appearance</h3>
        
        <div class="form-group">
          <label class="form-label">Background Theme</label>
          <select class="form-control" @change="${(r) => this._onBackgroundChange(r)}" .value="${this._config.background || ""}">
            <option value="">Default (No background)</option>
            <option value="modern">Modern Gradient</option>
          </select>
          <p style="font-size: 12px; color: var(--secondary-text-color); margin-top: 8px;">
            Choose a background style for your dashboard. "Modern" uses a sleek gradient with an image overlay.
          </p>
        </div>

        <div class="form-group">
          <label class="form-label">Layout Style</label>
          <select class="form-control" .value="${this._config.layout_style || "standard"}" 
            @change="${(r) => this._config = { ...this._config, layout_style: r.target.value }}">
            <option value="standard">Standard Grid</option>
            <option value="compact">Compact View</option>
          </select>
        </div>
      </div>
    `;
  }
  _renderAreasTab() {
    var s;
    const r = (s = this.hass) != null && s.areas ? Object.values(this.hass.areas) : [], { floors: e, noFloor: t } = this._getAreasByFloor();
    return c`
      <div class="page-header">
        <div style="display: flex; justify-content: space-between; align-items: ${this.narrow ? "flex-start" : "center"}; flex-direction: ${this.narrow ? "column" : "row"}; gap: 16px;">
          <div>
            <h2>Room Selection</h2>
            <p>Select which areas should be included.</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" @click="${this._selectAllAreas}">Select All</button>
            <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" @click="${this._deselectAllAreas}">Deselect All</button>
          </div>
        </div>
      </div>

      ${r.length > 0 ? c`
        ${Object.entries(e).map(([o, a]) => c`
          <div class="floor-section">
            <h3 class="floor-title">Floor: ${o}</h3>
            <div class="area-grid">
              ${a.map((i) => c`
                <div
                  class="area-card ${this._config.areas.includes(i.area_id) ? "selected" : ""}"
                  @click="${() => this._toggleArea(i.area_id)}"
                >
                  <span class="area-icon">🏠</span>
                  <div class="area-name">${i.name}</div>
                </div>
              `)}
            </div>
          </div>
        `)}

        ${t.length > 0 ? c`
          <div class="floor-section">
            <h3 class="floor-title">Other Areas</h3>
            <div class="area-grid">
              ${t.map((o) => c`
                <div
                  class="area-card ${this._config.areas.includes(o.area_id) ? "selected" : ""}"
                  @click="${() => this._toggleArea(o.area_id)}"
                >
                  <span class="area-icon">📍</span>
                  <div class="area-name">${o.name}</div>
                </div>
              `)}
            </div>
          </div>
        ` : ""}
      ` : c`
        <div class="glass-card" style="text-align: center; padding: 48px;">
          <p style="color: var(--secondary-text-color);">No areas found in Home Assistant.</p>
        </div>
      `}
    `;
  }
  _renderEnergyTab() {
    const r = this._getSensorEntities(), e = this._config.energy_villetta || { enabled: !1 };
    return c`
      <div class="page-header">
        <h2>Energy Engine</h2>
        <p>Configure the "Villetta" visualization module.</p>
      </div>

      <div class="glass-card">
        <div class="switch-group">
          <div>
            <div style="font-weight: 600;">Enable Module</div>
            <div style="font-size: 12px; color: var(--secondary-text-color);">Show the energy flow visualization</div>
          </div>
          <input type="checkbox" .checked="${e.enabled}" 
            @change="${(t) => this._updateEnergyConfig({ enabled: t.target.checked })}"
            style="width: 20px; height: 20px; cursor: pointer;">
        </div>

        ${e.enabled ? c`
          <div style="margin-top: 24px;">
            <div class="form-group">
              <label class="form-label">Home Consumption Sensor <span style="color: #ef4444;">*</span></label>
              <select class="form-control" .value="${e.home_consumption_sensor || ""}"
                @change="${(t) => this._updateEnergyConfig({ home_consumption_sensor: t.target.value || null })}">
                <option value="">Select entity...</option>
                ${r.map((t) => c`<option value="${t.entity_id}">${t.friendly_name}</option>`)}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Grid Import Sensor <span style="color: #ef4444;">*</span></label>
              <select class="form-control" .value="${e.import_power_sensor || ""}"
                @change="${(t) => this._updateEnergyConfig({ import_power_sensor: t.target.value || null })}">
                <option value="">Select entity...</option>
                ${r.map((t) => c`<option value="${t.entity_id}">${t.friendly_name}</option>`)}
              </select>
            </div>

            <div class="glass-card" style="background: var(--secondary-background-color); border: none; padding: 20px;">
              <h4 style="margin: 0 0 16px 0; font-size: 14px; color: var(--secondary-text-color); text-transform: uppercase;">Optional Components</h4>
              
              <div class="switch-group" style="background: transparent; padding: 8px 0;">
                <span style="font-size: 14px;">Photovoltaic System</span>
                <input type="checkbox" .checked="${e.photovoltaic_enabled}"
                  @change="${(t) => this._updateEnergyConfig({ photovoltaic_enabled: t.target.checked })}">
              </div>
              ${e.photovoltaic_enabled ? c`
                <div class="form-group" style="padding-left: 12px; border-left: 2px solid var(--divider-color); margin-top: 8px;">
                  <select class="form-control" .value="${e.photovoltaic_production_sensor || ""}"
                    @change="${(t) => this._updateEnergyConfig({ photovoltaic_production_sensor: t.target.value || null })}">
                    <option value="">Select production entity...</option>
                    ${r.map((t) => c`<option value="${t.entity_id}">${t.friendly_name}</option>`)}
                  </select>
                </div>
              ` : ""}

              <div class="switch-group" style="background: transparent; padding: 8px 0;">
                <span style="font-size: 14px;">Battery Storage</span>
                <input type="checkbox" .checked="${e.battery_enabled}"
                  @change="${(t) => this._updateEnergyConfig({ battery_enabled: t.target.checked })}">
              </div>
              ${e.battery_enabled ? c`
                <div class="form-group" style="padding-left: 12px; border-left: 2px solid var(--divider-color); margin-top: 8px;">
                  <select class="form-control" .value="${e.battery_sensor || ""}"
                    @change="${(t) => this._updateEnergyConfig({ battery_sensor: t.target.value || null })}">
                    <option value="">Select battery entity...</option>
                    ${r.map((t) => c`<option value="${t.entity_id}">${t.friendly_name}</option>`)}
                  </select>
                </div>
              ` : ""}

              <div class="switch-group" style="background: transparent; padding: 8px 0;">
                <span style="font-size: 14px;">Grid Export Power</span>
                <input type="checkbox" .checked="${e.export_enabled}"
                  @change="${(t) => this._updateEnergyConfig({ export_enabled: t.target.checked })}">
              </div>
              ${e.export_enabled ? c`
                <div class="form-group" style="padding-left: 12px; border-left: 2px solid var(--divider-color); margin-top: 8px;">
                  <select class="form-control" .value="${e.export_sensor || ""}"
                    @change="${(t) => this._updateEnergyConfig({ export_sensor: t.target.value || null })}">
                    <option value="">Select export entity...</option>
                    ${r.map((t) => c`<option value="${t.entity_id}">${t.friendly_name}</option>`)}
                  </select>
                </div>
              ` : ""}
              
              <div class="switch-group" style="background: transparent; padding: 8px 0;">
                <span style="font-size: 14px;">Electric Vehicle Charging</span>
                <input type="checkbox" .checked="${e.ev_enabled}"
                  @change="${(t) => this._updateEnergyConfig({ ev_enabled: t.target.checked })}">
              </div>
              ${e.ev_enabled ? c`
                <div class="form-group" style="padding-left: 12px; border-left: 2px solid var(--divider-color); margin-top: 8px;">
                  <select class="form-control" .value="${e.ev_sensor || ""}"
                    @change="${(t) => this._updateEnergyConfig({ ev_sensor: t.target.value || null })}">
                    <option value="">Select EV charger entity...</option>
                    ${r.map((t) => c`<option value="${t.entity_id}">${t.friendly_name}</option>`)}
                  </select>
                </div>
              ` : ""}
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }
  _renderPreviewTab() {
    return c`
      <div class="page-header">
        <h2>Live Preview</h2>
        <p>Inspect the generated dashboard configuration.</p>
      </div>

      <div class="glass-card">
        <div style="display: flex; justify-content: space-between; align-items: ${this.narrow ? "flex-start" : "center"}; flex-direction: ${this.narrow ? "column" : "row"}; gap: 16px; margin-bottom: 20px;">
          <h3 class="section-title" style="margin: 0;">YAML/JSON Configuration</h3>
          <button class="btn-secondary" @click="${() => {
      navigator.clipboard.writeText(JSON.stringify(this._generatedDashboard, null, 2));
    }}">
            Copy to Clipboard 📋
          </button>
        </div>
        
        ${this._generatedDashboard ? c`
          <pre class="code-preview">${JSON.stringify(this._generatedDashboard, null, 2)}</pre>
        ` : c`
          <div style="text-align: center; padding: 40px; color: var(--secondary-text-color);">
            Generate the dashboard to see the preview here.
          </div>
        `}
      </div>
    `;
  }
  _updateEnergyConfig(r) {
    this._config = {
      ...this._config,
      energy_villetta: {
        ...this._config.energy_villetta || {
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
        },
        ...r
      }
    };
  }
};
g.styles = ve`
    :host {
      display: block;
      height: 100vh;
      width: 100%;
      background-color: var(--primary-background-color);
      color: var(--primary-text-color);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      overflow: hidden;
    }

    .app-layout {
      display: flex;
      height: 100%;
      width: 100%;
      position: relative;
    }

    /* Sidebar Styles */
    .sidebar {
      width: 280px;
      background: var(--card-background-color, #fff);
      border-right: 1px solid var(--divider-color);
      display: flex;
      flex-direction: column;
      padding: 24px 0;
      flex-shrink: 0;
      box-shadow: 2px 0 8px rgba(0,0,0,0.02);
      z-index: 100;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    :host([narrow]) .sidebar {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      transform: translateX(-100%);
    }

    :host([narrow]) .sidebar.open {
      transform: translateX(0);
      box-shadow: 4px 0 20px rgba(0,0,0,0.15);
    }

    .sidebar-overlay {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.4);
      z-index: 90;
      backdrop-filter: blur(2px);
    }

    :host([narrow]) .sidebar.open + .sidebar-overlay {
      display: block;
    }

    .mobile-header {
      display: none;
      padding: 12px 16px;
      background: var(--card-background-color, #fff);
      border-bottom: 1px solid var(--divider-color);
      align-items: center;
      gap: 12px;
      z-index: 80;
    }

    :host([narrow]) .mobile-header {
      display: flex;
    }

    .menu-button {
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      color: var(--primary-text-color);
      font-size: 20px;
    }

    .sidebar-header {
      padding: 0 24px 32px 24px;
    }

    .sidebar-header h1 {
      font-size: 20px;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(135deg, var(--primary-color) 0%, #a855f7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }

    .sidebar-header p {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin: 4px 0 0 0;
    }

    .nav-items {
      flex: 1;
      padding: 0 12px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      margin-bottom: 4px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--secondary-text-color);
      font-weight: 500;
      gap: 12px;
    }

    .nav-item:hover {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .nav-item.active {
      background: var(--primary-color);
      color: white;
      box-shadow: 0 4px 12px rgba(var(--rgb-primary-color, 33, 150, 243), 0.3);
    }

    .nav-icon {
      font-size: 18px;
    }

    .sidebar-footer {
      padding: 24px;
      border-top: 1px solid var(--divider-color);
    }

    /* Main Content Styles */
    .main-content {
      flex: 1;
      overflow-y: auto;
      background: var(--secondary-background-color);
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .content-container {
      max-width: 900px;
      margin: 0 auto;
      width: 100%;
      padding: 40px 24px 100px 24px;
    }

    :host([narrow]) .content-container {
      padding: 24px 16px 120px 16px;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h2 {
      font-size: 28px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .page-header p {
      color: var(--secondary-text-color);
      margin: 0;
    }

    /* Card Styles */
    .glass-card {
      background: var(--card-background-color, #fff);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04);
      margin-bottom: 24px;
      border: 1px solid var(--divider-color);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .glass-card:hover {
      box-shadow: 0 8px 30px rgba(0,0,0,0.06);
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 20px 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* Grid & Controls */
    .area-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 16px;
    }

    :host([narrow]) .area-grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 12px;
    }

    .area-card {
      background: var(--secondary-background-color);
      border-radius: 12px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 2px solid transparent;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .area-card:hover {
      transform: translateY(-4px);
      border-color: var(--primary-color);
    }

    .area-card.selected {
      border-color: var(--primary-color);
      background: var(--card-background-color);
    }

    .area-card.selected .area-name {
      color: var(--primary-color);
      font-weight: 600;
    }

    .area-card.selected .area-icon {
      transform: scale(1.1);
    }

    .area-icon {
      font-size: 32px;
      margin-bottom: 12px;
      display: block;
      transition: transform 0.3s ease;
    }

    .area-name {
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .floor-section {
      margin-bottom: 40px;
    }

    .floor-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .floor-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--divider-color);
    }

    /* Form Controls */
    .form-group {
      margin-bottom: 24px;
    }

    .form-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      font-size: 14px;
      color: var(--primary-text-color);
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      border-radius: 10px;
      border: 1px solid var(--divider-color);
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(var(--rgb-primary-color, 33, 150, 243), 0.1);
    }

    /* Switch Style */
    .switch-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      background: var(--secondary-background-color);
      border-radius: 10px;
      margin-bottom: 12px;
    }

    /* Actions Sticky Bar */
    .floating-actions {
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      background: rgba(var(--rgb-card-background-color, 255, 255, 255), 0.8);
      backdrop-filter: blur(12px);
      border-top: 1px solid var(--divider-color);
      padding: 16px 40px;
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      z-index: 85;
    }

    :host([narrow]) .floating-actions {
      padding: 16px;
    }

    button {
      padding: 10px 24px;
      border-radius: 10px;
      border: none;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
      box-shadow: 0 4px 12px rgba(var(--rgb-primary-color, 33, 150, 243), 0.2);
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(var(--rgb-primary-color, 33, 150, 243), 0.3);
      filter: brightness(1.05);
    }

    .btn-secondary {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .btn-secondary:hover {
      background: var(--divider-color);
    }

    .status-badge {
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 600;
    }

    .status-saving { background: #fff3e0; color: #ef6c00; }
    .status-saved { background: #e8f5e9; color: #2e7d32; }
    .status-error { background: #ffebee; color: #c62828; }

    .code-preview {
      background: #0f172a;
      color: #e2e8f0;
      padding: 24px;
      border-radius: 12px;
      overflow: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      line-height: 1.6;
      max-height: 500px;
      border: 1px solid #1e293b;
    }

    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: var(--divider-color);
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--secondary-text-color);
    }
  `;
v([
  X({ attribute: !1 })
], g.prototype, "hass", 2);
v([
  X({ type: Boolean, reflect: !0 })
], g.prototype, "narrow", 2);
v([
  k()
], g.prototype, "_config", 2);
v([
  k()
], g.prototype, "_loading", 2);
v([
  k()
], g.prototype, "_generatedDashboard", 2);
v([
  k()
], g.prototype, "_activeTab", 2);
v([
  k()
], g.prototype, "_saveStatus", 2);
v([
  k()
], g.prototype, "_sidebarOpen", 2);
g = v([
  Me("nidia-dashboard-composer-panel")
], g);
const D = "0.5.1", ge = "nidia_dashboard_composer_version", F = localStorage.getItem(ge);
F !== D && (console.log(`Nidia Dashboard Composer: Version changed from ${F} to ${D}, clearing cache...`), localStorage.setItem(ge, D), "caches" in window && caches.keys().then((r) => {
  r.forEach((e) => {
    (e.includes("nidia") || e.includes("dashboard-composer")) && caches.delete(e);
  });
}), F !== null && (console.log("Nidia Dashboard Composer: Forcing hard reload..."), window.location.reload()));
customElements.whenDefined("nidia-dashboard-composer-panel").then(() => {
  console.log(`Nidia Dashboard Composer v${D} panel loaded`);
});
