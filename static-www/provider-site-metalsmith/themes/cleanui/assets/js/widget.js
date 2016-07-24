Date.parseDate = function( input, format ){
  return moment(input,format).toDate();
};

Date.prototype.dateFormat = function( format ){
  return moment(this).format(format);
};

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
}

function showCalModal() {
  $('#pp_booking #book-online').show();
  $('#datetimepicker').datetimepicker('show');
  if ($(document).width() > 900) {
    disableScroll();
  }
}

function hideCalModal() {
  $('#pp_booking #book-online').hide();
  $('#datetimepicker').datetimepicker('hide');
  enableScroll();
}

function showThankYouModal() {
  $('#pp_booking #booked-online').show();
}

function hideThankYouModal() {
  $('#pp_booking #booked-online').hide();
}


function showReviewModal() {
  $('#pp_booking #leave-review').show();
}

function hideReviewModal() {
  $('#pp_booking #leave-review').hide();
}

function showReviewThankYouModal() {
  $('#pp_booking #leave-review-ty').show();
}

function hideReviewThankYouModal() {
  $('#pp_booking #leave-review-ty').hide();
}


$(document).ready(function() {

  $('#datetimepicker').datetimepicker({
    onShow: function(ct){
      // this.setOptions({
      //   minDate: new Date()
      // });
    },
    onGenerate:function( ct ){
      jQuery(this).find('.xdsoft_date.xdsoft_weekend')
        .addClass('xdsoft_disabled');
    },
    lang: 'en',
    format: 'MM/DD/YYYY h:mm a',
    formatDate: 'MM/DD/YYYY',
    formatTime: 'h:mm a',
    datepicker: true,
    timepicker: true,
    minDate: '-1970/01/01',
    allowTimes:[ '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'],
    inline: false,
    hours12: true,
    dayOfWeekStart: 1,
    closeOnDateSelect: false,
    closeOnTimeSelect: false,
    closeOnWithoutClick: false,
    defaultSelect: false
  });

  $(".btn-book-online").click(function() {
    showCalModal();
  });

  $(".ppop_bookonline_action").click(function() {
    showCalModal();
  });

  $(".btn-leave-review").click(function() {
    showReviewModal();
  });
  

  $(".close").click(function() {
    hideCalModal();
    hideReviewModal();
    hideThankYouModal();
    hideReviewThankYouModal();
  });

  $(".btn-cancel").click(function() {
    hideCalModal();
    hideReviewModal();
    hideThankYouModal();
    hideReviewThankYouModal();
  });

});

// /*! jQuery v1.11.0 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
// !function(a, b) {
//     "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function(a) {
//         if (!a.document)
//             throw new Error("jQuery requires a window with a document");
//         return b(a)
//     }
//     : b(a)
// }("undefined" != typeof window ? window : this, function(a, b) {
//     var c = []
//       , d = c.slice
//       , e = c.concat
//       , f = c.push
//       , g = c.indexOf
//       , h = {}
//       , i = h.toString
//       , j = h.hasOwnProperty
//       , k = "".trim
//       , l = {}
//       , m = "1.11.0"
//       , n = function(a, b) {
//         return new n.fn.init(a,b)
//     }
//       , o = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
//       , p = /^-ms-/
//       , q = /-([\da-z])/gi
//       , r = function(a, b) {
//         return b.toUpperCase()
//     }
//     ;
//     n.fn = n.prototype = {
//         jquery: m,
//         constructor: n,
//         selector: "",
//         length: 0,
//         toArray: function() {
//             return d.call(this)
//         },
//         get: function(a) {
//             return null != a ? 0 > a ? this[a + this.length] : this[a] : d.call(this)
//         },
//         pushStack: function(a) {
//             var b = n.merge(this.constructor(), a);
//             return b.prevObject = this,
//             b.context = this.context,
//             b
//         },
//         each: function(a, b) {
//             return n.each(this, a, b)
//         },
//         map: function(a) {
//             return this.pushStack(n.map(this, function(b, c) {
//                 return a.call(b, c, b)
//             }))
//         },
//         slice: function() {
//             return this.pushStack(d.apply(this, arguments))
//         },
//         first: function() {
//             return this.eq(0)
//         },
//         last: function() {
//             return this.eq(-1)
//         },
//         eq: function(a) {
//             var b = this.length
//               , c = +a + (0 > a ? b : 0);
//             return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
//         },
//         end: function() {
//             return this.prevObject || this.constructor(null )
//         },
//         push: f,
//         sort: c.sort,
//         splice: c.splice
//     },
//     n.extend = n.fn.extend = function() {
//         var a, b, c, d, e, f, g = arguments[0] || {}, h = 1, i = arguments.length, j = !1;
//         for ("boolean" == typeof g && (j = g,
//         g = arguments[h] || {},
//         h++),
//         "object" == typeof g || n.isFunction(g) || (g = {}),
//         h === i && (g = this,
//         h--); i > h; h++)
//             if (null != (e = arguments[h]))
//                 for (d in e)
//                     a = g[d],
//                     c = e[d],
//                     g !== c && (j && c && (n.isPlainObject(c) || (b = n.isArray(c))) ? (b ? (b = !1,
//                     f = a && n.isArray(a) ? a : []) : f = a && n.isPlainObject(a) ? a : {},
//                     g[d] = n.extend(j, f, c)) : void 0 !== c && (g[d] = c));
//         return g
//     }
//     ,
//     n.extend({
//         expando: "jQuery" + (m + Math.random()).replace(/\D/g, ""),
//         isReady: !0,
//         error: function(a) {
//             throw new Error(a)
//         },
//         noop: function() {},
//         isFunction: function(a) {
//             return "function" === n.type(a)
//         },
//         isArray: Array.isArray || function(a) {
//             return "array" === n.type(a)
//         }
//         ,
//         isWindow: function(a) {
//             return null != a && a == a.window
//         },
//         isNumeric: function(a) {
//             return a - parseFloat(a) >= 0
//         },
//         isEmptyObject: function(a) {
//             var b;
//             for (b in a)
//                 return !1;
//             return !0
//         },
//         isPlainObject: function(a) {
//             var b;
//             if (!a || "object" !== n.type(a) || a.nodeType || n.isWindow(a))
//                 return !1;
//             try {
//                 if (a.constructor && !j.call(a, "constructor") && !j.call(a.constructor.prototype, "isPrototypeOf"))
//                     return !1
//             } catch (c) {
//                 return !1
//             }
//             if (l.ownLast)
//                 for (b in a)
//                     return j.call(a, b);
//             for (b in a)
//                 ;
//             return void 0 === b || j.call(a, b)
//         },
//         type: function(a) {
//             return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? h[i.call(a)] || "object" : typeof a
//         },
//         globalEval: function(b) {
//             b && n.trim(b) && (a.execScript || function(b) {
//                 a.eval.call(a, b)
//             }
//             )(b)
//         },
//         camelCase: function(a) {
//             return a.replace(p, "ms-").replace(q, r)
//         },
//         nodeName: function(a, b) {
//             return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
//         },
//         each: function(a, b, c) {
//             var d, e = 0, f = a.length, g = s(a);
//             if (c) {
//                 if (g) {
//                     for (; f > e; e++)
//                         if (d = b.apply(a[e], c),
//                         d === !1)
//                             break
//                 } else
//                     for (e in a)
//                         if (d = b.apply(a[e], c),
//                         d === !1)
//                             break
//             } else if (g) {
//                 for (; f > e; e++)
//                     if (d = b.call(a[e], e, a[e]),
//                     d === !1)
//                         break
//             } else
//                 for (e in a)
//                     if (d = b.call(a[e], e, a[e]),
//                     d === !1)
//                         break;
//             return a
//         },
//         trim: k && !k.call("\ufeff\xa0") ? function(a) {
//             return null == a ? "" : k.call(a)
//         }
//         : function(a) {
//             return null == a ? "" : (a + "").replace(o, "")
//         }
//         ,
//         makeArray: function(a, b) {
//             var c = b || [];
//             return null != a && (s(Object(a)) ? n.merge(c, "string" == typeof a ? [a] : a) : f.call(c, a)),
//             c
//         },
//         inArray: function(a, b, c) {
//             var d;
//             if (b) {
//                 if (g)
//                     return g.call(b, a, c);
//                 for (d = b.length,
//                 c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++)
//                     if (c in b && b[c] === a)
//                         return c
//             }
//             return -1
//         },
//         merge: function(a, b) {
//             var c = +b.length
//               , d = 0
//               , e = a.length;
//             while (c > d)
//                 a[e++] = b[d++];
//             if (c !== c)
//                 while (void 0 !== b[d])
//                     a[e++] = b[d++];
//             return a.length = e,
//             a
//         },
//         grep: function(a, b, c) {
//             for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++)
//                 d = !b(a[f], f),
//                 d !== h && e.push(a[f]);
//             return e
//         },
//         map: function(a, b, c) {
//             var d, f = 0, g = a.length, h = s(a), i = [];
//             if (h)
//                 for (; g > f; f++)
//                     d = b(a[f], f, c),
//                     null != d && i.push(d);
//             else
//                 for (f in a)
//                     d = b(a[f], f, c),
//                     null != d && i.push(d);
//             return e.apply([], i)
//         },
//         guid: 1,
//         proxy: function(a, b) {
//             var c, e, f;
//             return "string" == typeof b && (f = a[b],
//             b = a,
//             a = f),
//             n.isFunction(a) ? (c = d.call(arguments, 2),
//             e = function() {
//                 return a.apply(b || this, c.concat(d.call(arguments)))
//             }
//             ,
//             e.guid = a.guid = a.guid || n.guid++,
//             e) : void 0
//         },
//         now: function() {
//             return +new Date
//         },
//         support: l
//     }),
//     n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(a, b) {
//         h["[object " + b + "]"] = b.toLowerCase()
//     });
//     function s(a) {
//         var b = a.length
//           , c = n.type(a);
//         return "function" === c || n.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
//     }
//     var t = function(a) {
//         var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s = "sizzle" + -new Date, t = a.document, u = 0, v = 0, w = eb(), x = eb(), y = eb(), z = function(a, b) {
//             return a === b && (j = !0),
//             0
//         }
//         , A = "undefined", B = 1 << 31, C = {}.hasOwnProperty, D = [], E = D.pop, F = D.push, G = D.push, H = D.slice, I = D.indexOf || function(a) {
//             for (var b = 0, c = this.length; c > b; b++)
//                 if (this[b] === a)
//                     return b;
//             return -1
//         }
//         , J = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", K = "[\\x20\\t\\r\\n\\f]", L = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", M = L.replace("w", "w#"), N = "\\[" + K + "*(" + L + ")" + K + "*(?:([*^$|!~]?=)" + K + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + M + ")|)|)" + K + "*\\]", O = ":(" + L + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + N.replace(3, 8) + ")*)|.*)\\)|)", P = new RegExp("^" + K + "+|((?:^|[^\\\\])(?:\\\\.)*)" + K + "+$","g"), Q = new RegExp("^" + K + "*," + K + "*"), R = new RegExp("^" + K + "*([>+~]|" + K + ")" + K + "*"), S = new RegExp("=" + K + "*([^\\]'\"]*?)" + K + "*\\]","g"), T = new RegExp(O), U = new RegExp("^" + M + "$"), V = {
//             ID: new RegExp("^#(" + L + ")"),
//             CLASS: new RegExp("^\\.(" + L + ")"),
//             TAG: new RegExp("^(" + L.replace("w", "w*") + ")"),
//             ATTR: new RegExp("^" + N),
//             PSEUDO: new RegExp("^" + O),
//             CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + K + "*(even|odd|(([+-]|)(\\d*)n|)" + K + "*(?:([+-]|)" + K + "*(\\d+)|))" + K + "*\\)|)","i"),
//             bool: new RegExp("^(?:" + J + ")$","i"),
//             needsContext: new RegExp("^" + K + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + K + "*((?:-\\d)?\\d*)" + K + "*\\)|)(?=[^-]|$)","i")
//         }, W = /^(?:input|select|textarea|button)$/i, X = /^h\d$/i, Y = /^[^{]+\{\s*\[native \w/, Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, $ = /[+~]/, _ = /'|\\/g, ab = new RegExp("\\\\([\\da-f]{1,6}" + K + "?|(" + K + ")|.)","ig"), bb = function(a, b, c) {
//             var d = "0x" + b - 65536;
//             return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
//         }
//         ;
//         try {
//             G.apply(D = H.call(t.childNodes), t.childNodes),
//             D[t.childNodes.length].nodeType
//         } catch (cb) {
//             G = {
//                 apply: D.length ? function(a, b) {
//                     F.apply(a, H.call(b))
//                 }
//                 : function(a, b) {
//                     var c = a.length
//                       , d = 0;
//                     while (a[c++] = b[d++])
//                         ;
//                     a.length = c - 1
//                 }
//             }
//         }
//         function db(a, b, d, e) {
//             var f, g, h, i, j, m, p, q, u, v;
//             if ((b ? b.ownerDocument || b : t) !== l && k(b),
//             b = b || l,
//             d = d || [],
//             !a || "string" != typeof a)
//                 return d;
//             if (1 !== (i = b.nodeType) && 9 !== i)
//                 return [];
//             if (n && !e) {
//                 if (f = Z.exec(a))
//                     if (h = f[1]) {
//                         if (9 === i) {
//                             if (g = b.getElementById(h),
//                             !g || !g.parentNode)
//                                 return d;
//                             if (g.id === h)
//                                 return d.push(g),
//                                 d
//                         } else if (b.ownerDocument && (g = b.ownerDocument.getElementById(h)) && r(b, g) && g.id === h)
//                             return d.push(g),
//                             d
//                     } else {
//                         if (f[2])
//                             return G.apply(d, b.getElementsByTagName(a)),
//                             d;
//                         if ((h = f[3]) && c.getElementsByClassName && b.getElementsByClassName)
//                             return G.apply(d, b.getElementsByClassName(h)),
//                             d
//                     }
//                 if (c.qsa && (!o || !o.test(a))) {
//                     if (q = p = s,
//                     u = b,
//                     v = 9 === i && a,
//                     1 === i && "object" !== b.nodeName.toLowerCase()) {
//                         m = ob(a),
//                         (p = b.getAttribute("id")) ? q = p.replace(_, "\\$&") : b.setAttribute("id", q),
//                         q = "[id='" + q + "'] ",
//                         j = m.length;
//                         while (j--)
//                             m[j] = q + pb(m[j]);
//                         u = $.test(a) && mb(b.parentNode) || b,
//                         v = m.join(",")
//                     }
//                     if (v)
//                         try {
//                             return G.apply(d, u.querySelectorAll(v)),
//                             d
//                         } catch (w) {} finally {
//                             p || b.removeAttribute("id")
//                         }
//                 }
//             }
//             return xb(a.replace(P, "$1"), b, d, e)
//         }
//         function eb() {
//             var a = [];
//             function b(c, e) {
//                 return a.push(c + " ") > d.cacheLength && delete b[a.shift()],
//                 b[c + " "] = e
//             }
//             return b
//         }
//         function fb(a) {
//             return a[s] = !0,
//             a
//         }
//         function gb(a) {
//             var b = l.createElement("div");
//             try {
//                 return !!a(b)
//             } catch (c) {
//                 return !1
//             } finally {
//                 b.parentNode && b.parentNode.removeChild(b),
//                 b = null
//             }
//         }
//         function hb(a, b) {
//             var c = a.split("|")
//               , e = a.length;
//             while (e--)
//                 d.attrHandle[c[e]] = b
//         }
//         function ib(a, b) {
//             var c = b && a
//               , d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || B) - (~a.sourceIndex || B);
//             if (d)
//                 return d;
//             if (c)
//                 while (c = c.nextSibling)
//                     if (c === b)
//                         return -1;
//             return a ? 1 : -1
//         }
//         function jb(a) {
//             return function(b) {
//                 var c = b.nodeName.toLowerCase();
//                 return "input" === c && b.type === a
//             }
//         }
//         function kb(a) {
//             return function(b) {
//                 var c = b.nodeName.toLowerCase();
//                 return ("input" === c || "button" === c) && b.type === a
//             }
//         }
//         function lb(a) {
//             return fb(function(b) {
//                 return b = +b,
//                 fb(function(c, d) {
//                     var e, f = a([], c.length, b), g = f.length;
//                     while (g--)
//                         c[e = f[g]] && (c[e] = !(d[e] = c[e]))
//                 })
//             })
//         }
//         function mb(a) {
//             return a && typeof a.getElementsByTagName !== A && a
//         }
//         c = db.support = {},
//         f = db.isXML = function(a) {
//             var b = a && (a.ownerDocument || a).documentElement;
//             return b ? "HTML" !== b.nodeName : !1
//         }
//         ,
//         k = db.setDocument = function(a) {
//             var b, e = a ? a.ownerDocument || a : t, g = e.defaultView;
//             return e !== l && 9 === e.nodeType && e.documentElement ? (l = e,
//             m = e.documentElement,
//             n = !f(e),
//             g && g !== g.top && (g.addEventListener ? g.addEventListener("unload", function() {
//                 k()
//             }, !1) : g.attachEvent && g.attachEvent("onunload", function() {
//                 k()
//             })),
//             c.attributes = gb(function(a) {
//                 return a.className = "i",
//                 !a.getAttribute("className")
//             }),
//             c.getElementsByTagName = gb(function(a) {
//                 return a.appendChild(e.createComment("")),
//                 !a.getElementsByTagName("*").length
//             }),
//             c.getElementsByClassName = Y.test(e.getElementsByClassName) && gb(function(a) {
//                 return a.innerHTML = "<div class='a'></div><div class='a i'></div>",
//                 a.firstChild.className = "i",
//                 2 === a.getElementsByClassName("i").length
//             }),
//             c.getById = gb(function(a) {
//                 return m.appendChild(a).id = s,
//                 !e.getElementsByName || !e.getElementsByName(s).length
//             }),
//             c.getById ? (d.find.ID = function(a, b) {
//                 if (typeof b.getElementById !== A && n) {
//                     var c = b.getElementById(a);
//                     return c && c.parentNode ? [c] : []
//                 }
//             }
//             ,
//             d.filter.ID = function(a) {
//                 var b = a.replace(ab, bb);
//                 return function(a) {
//                     return a.getAttribute("id") === b
//                 }
//             }
//             ) : (delete d.find.ID,
//             d.filter.ID = function(a) {
//                 var b = a.replace(ab, bb);
//                 return function(a) {
//                     var c = typeof a.getAttributeNode !== A && a.getAttributeNode("id");
//                     return c && c.value === b
//                 }
//             }
//             ),
//             d.find.TAG = c.getElementsByTagName ? function(a, b) {
//                 return typeof b.getElementsByTagName !== A ? b.getElementsByTagName(a) : void 0
//             }
//             : function(a, b) {
//                 var c, d = [], e = 0, f = b.getElementsByTagName(a);
//                 if ("*" === a) {
//                     while (c = f[e++])
//                         1 === c.nodeType && d.push(c);
//                     return d
//                 }
//                 return f
//             }
//             ,
//             d.find.CLASS = c.getElementsByClassName && function(a, b) {
//                 return typeof b.getElementsByClassName !== A && n ? b.getElementsByClassName(a) : void 0
//             }
//             ,
//             p = [],
//             o = [],
//             (c.qsa = Y.test(e.querySelectorAll)) && (gb(function(a) {
//                 a.innerHTML = "<select t=''><option selected=''></option></select>",
//                 a.querySelectorAll("[t^='']").length && o.push("[*^$]=" + K + "*(?:''|\"\")"),
//                 a.querySelectorAll("[selected]").length || o.push("\\[" + K + "*(?:value|" + J + ")"),
//                 a.querySelectorAll(":checked").length || o.push(":checked")
//             }),
//             gb(function(a) {
//                 var b = e.createElement("input");
//                 b.setAttribute("type", "hidden"),
//                 a.appendChild(b).setAttribute("name", "D"),
//                 a.querySelectorAll("[name=d]").length && o.push("name" + K + "*[*^$|!~]?="),
//                 a.querySelectorAll(":enabled").length || o.push(":enabled", ":disabled"),
//                 a.querySelectorAll("*,:x"),
//                 o.push(",.*:")
//             })),
//             (c.matchesSelector = Y.test(q = m.webkitMatchesSelector || m.mozMatchesSelector || m.oMatchesSelector || m.msMatchesSelector)) && gb(function(a) {
//                 c.disconnectedMatch = q.call(a, "div"),
//                 q.call(a, "[s!='']:x"),
//                 p.push("!=", O)
//             }),
//             o = o.length && new RegExp(o.join("|")),
//             p = p.length && new RegExp(p.join("|")),
//             b = Y.test(m.compareDocumentPosition),
//             r = b || Y.test(m.contains) ? function(a, b) {
//                 var c = 9 === a.nodeType ? a.documentElement : a
//                   , d = b && b.parentNode;
//                 return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
//             }
//             : function(a, b) {
//                 if (b)
//                     while (b = b.parentNode)
//                         if (b === a)
//                             return !0;
//                 return !1
//             }
//             ,
//             z = b ? function(a, b) {
//                 if (a === b)
//                     return j = !0,
//                     0;
//                 var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
//                 return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1,
//                 1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === e || a.ownerDocument === t && r(t, a) ? -1 : b === e || b.ownerDocument === t && r(t, b) ? 1 : i ? I.call(i, a) - I.call(i, b) : 0 : 4 & d ? -1 : 1)
//             }
//             : function(a, b) {
//                 if (a === b)
//                     return j = !0,
//                     0;
//                 var c, d = 0, f = a.parentNode, g = b.parentNode, h = [a], k = [b];
//                 if (!f || !g)
//                     return a === e ? -1 : b === e ? 1 : f ? -1 : g ? 1 : i ? I.call(i, a) - I.call(i, b) : 0;
//                 if (f === g)
//                     return ib(a, b);
//                 c = a;
//                 while (c = c.parentNode)
//                     h.unshift(c);
//                 c = b;
//                 while (c = c.parentNode)
//                     k.unshift(c);
//                 while (h[d] === k[d])
//                     d++;
//                 return d ? ib(h[d], k[d]) : h[d] === t ? -1 : k[d] === t ? 1 : 0
//             }
//             ,
//             e) : l
//         }
//         ,
//         db.matches = function(a, b) {
//             return db(a, null , null , b)
//         }
//         ,
//         db.matchesSelector = function(a, b) {
//             if ((a.ownerDocument || a) !== l && k(a),
//             b = b.replace(S, "='$1']"),
//             !(!c.matchesSelector || !n || p && p.test(b) || o && o.test(b)))
//                 try {
//                     var d = q.call(a, b);
//                     if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType)
//                         return d
//                 } catch (e) {}
//             return db(b, l, null , [a]).length > 0
//         }
//         ,
//         db.contains = function(a, b) {
//             return (a.ownerDocument || a) !== l && k(a),
//             r(a, b)
//         }
//         ,
//         db.attr = function(a, b) {
//             (a.ownerDocument || a) !== l && k(a);
//             var e = d.attrHandle[b.toLowerCase()]
//               , f = e && C.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !n) : void 0;
//             return void 0 !== f ? f : c.attributes || !n ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null
//         }
//         ,
//         db.error = function(a) {
//             throw new Error("Syntax error, unrecognized expression: " + a)
//         }
//         ,
//         db.uniqueSort = function(a) {
//             var b, d = [], e = 0, f = 0;
//             if (j = !c.detectDuplicates,
//             i = !c.sortStable && a.slice(0),
//             a.sort(z),
//             j) {
//                 while (b = a[f++])
//                     b === a[f] && (e = d.push(f));
//                 while (e--)
//                     a.splice(d[e], 1)
//             }
//             return i = null ,
//             a
//         }
//         ,
//         e = db.getText = function(a) {
//             var b, c = "", d = 0, f = a.nodeType;
//             if (f) {
//                 if (1 === f || 9 === f || 11 === f) {
//                     if ("string" == typeof a.textContent)
//                         return a.textContent;
//                     for (a = a.firstChild; a; a = a.nextSibling)
//                         c += e(a)
//                 } else if (3 === f || 4 === f)
//                     return a.nodeValue
//             } else
//                 while (b = a[d++])
//                     c += e(b);
//             return c
//         }
//         ,
//         d = db.selectors = {
//             cacheLength: 50,
//             createPseudo: fb,
//             match: V,
//             attrHandle: {},
//             find: {},
//             relative: {
//                 ">": {
//                     dir: "parentNode",
//                     first: !0
//                 },
//                 " ": {
//                     dir: "parentNode"
//                 },
//                 "+": {
//                     dir: "previousSibling",
//                     first: !0
//                 },
//                 "~": {
//                     dir: "previousSibling"
//                 }
//             },
//             preFilter: {
//                 ATTR: function(a) {
//                     return a[1] = a[1].replace(ab, bb),
//                     a[3] = (a[4] || a[5] || "").replace(ab, bb),
//                     "~=" === a[2] && (a[3] = " " + a[3] + " "),
//                     a.slice(0, 4)
//                 },
//                 CHILD: function(a) {
//                     return a[1] = a[1].toLowerCase(),
//                     "nth" === a[1].slice(0, 3) ? (a[3] || db.error(a[0]),
//                     a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])),
//                     a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && db.error(a[0]),
//                     a
//                 },
//                 PSEUDO: function(a) {
//                     var b, c = !a[5] && a[2];
//                     return V.CHILD.test(a[0]) ? null : (a[3] && void 0 !== a[4] ? a[2] = a[4] : c && T.test(c) && (b = ob(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b),
//                     a[2] = c.slice(0, b)),
//                     a.slice(0, 3))
//                 }
//             },
//             filter: {
//                 TAG: function(a) {
//                     var b = a.replace(ab, bb).toLowerCase();
//                     return "*" === a ? function() {
//                         return !0
//                     }
//                     : function(a) {
//                         return a.nodeName && a.nodeName.toLowerCase() === b
//                     }
//                 },
//                 CLASS: function(a) {
//                     var b = w[a + " "];
//                     return b || (b = new RegExp("(^|" + K + ")" + a + "(" + K + "|$)")) && w(a, function(a) {
//                         return b.test("string" == typeof a.className && a.className || typeof a.getAttribute !== A && a.getAttribute("class") || "")
//                     })
//                 },
//                 ATTR: function(a, b, c) {
//                     return function(d) {
//                         var e = db.attr(d, a);
//                         return null == e ? "!=" === b : b ? (e += "",
//                         "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e + " ").indexOf(c) > -1 : "|=" === b ? e === c || e.slice(0, c.length + 1) === c + "-" : !1) : !0
//                     }
//                 },
//                 CHILD: function(a, b, c, d, e) {
//                     var f = "nth" !== a.slice(0, 3)
//                       , g = "last" !== a.slice(-4)
//                       , h = "of-type" === b;
//                     return 1 === d && 0 === e ? function(a) {
//                         return !!a.parentNode
//                     }
//                     : function(b, c, i) {
//                         var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling", q = b.parentNode, r = h && b.nodeName.toLowerCase(), t = !i && !h;
//                         if (q) {
//                             if (f) {
//                                 while (p) {
//                                     l = b;
//                                     while (l = l[p])
//                                         if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType)
//                                             return !1;
//                                     o = p = "only" === a && !o && "nextSibling"
//                                 }
//                                 return !0
//                             }
//                             if (o = [g ? q.firstChild : q.lastChild],
//                             g && t) {
//                                 k = q[s] || (q[s] = {}),
//                                 j = k[a] || [],
//                                 n = j[0] === u && j[1],
//                                 m = j[0] === u && j[2],
//                                 l = n && q.childNodes[n];
//                                 while (l = ++n && l && l[p] || (m = n = 0) || o.pop())
//                                     if (1 === l.nodeType && ++m && l === b) {
//                                         k[a] = [u, n, m];
//                                         break
//                                     }
//                             } else if (t && (j = (b[s] || (b[s] = {}))[a]) && j[0] === u)
//                                 m = j[1];
//                             else
//                                 while (l = ++n && l && l[p] || (m = n = 0) || o.pop())
//                                     if ((h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) && ++m && (t && ((l[s] || (l[s] = {}))[a] = [u, m]),
//                                     l === b))
//                                         break;
//                             return m -= e,
//                             m === d || m % d === 0 && m / d >= 0
//                         }
//                     }
//                 },
//                 PSEUDO: function(a, b) {
//                     var c, e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || db.error("unsupported pseudo: " + a);
//                     return e[s] ? e(b) : e.length > 1 ? (c = [a, a, "", b],
//                     d.setFilters.hasOwnProperty(a.toLowerCase()) ? fb(function(a, c) {
//                         var d, f = e(a, b), g = f.length;
//                         while (g--)
//                             d = I.call(a, f[g]),
//                             a[d] = !(c[d] = f[g])
//                     }) : function(a) {
//                         return e(a, 0, c)
//                     }
//                     ) : e
//                 }
//             },
//             pseudos: {
//                 not: fb(function(a) {
//                     var b = []
//                       , c = []
//                       , d = g(a.replace(P, "$1"));
//                     return d[s] ? fb(function(a, b, c, e) {
//                         var f, g = d(a, null , e, []), h = a.length;
//                         while (h--)
//                             (f = g[h]) && (a[h] = !(b[h] = f))
//                     }) : function(a, e, f) {
//                         return b[0] = a,
//                         d(b, null , f, c),
//                         !c.pop()
//                     }
//                 }),
//                 has: fb(function(a) {
//                     return function(b) {
//                         return db(a, b).length > 0
//                     }
//                 }),
//                 contains: fb(function(a) {
//                     return function(b) {
//                         return (b.textContent || b.innerText || e(b)).indexOf(a) > -1
//                     }
//                 }),
//                 lang: fb(function(a) {
//                     return U.test(a || "") || db.error("unsupported lang: " + a),
//                     a = a.replace(ab, bb).toLowerCase(),
//                     function(b) {
//                         var c;
//                         do
//                             if (c = n ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang"))
//                                 return c = c.toLowerCase(),
//                                 c === a || 0 === c.indexOf(a + "-");
//                         while ((b = b.parentNode) && 1 === b.nodeType);return !1
//                     }
//                 }),
//                 target: function(b) {
//                     var c = a.location && a.location.hash;
//                     return c && c.slice(1) === b.id
//                 },
//                 root: function(a) {
//                     return a === m
//                 },
//                 focus: function(a) {
//                     return a === l.activeElement && (!l.hasFocus || l.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
//                 },
//                 enabled: function(a) {
//                     return a.disabled === !1
//                 },
//                 disabled: function(a) {
//                     return a.disabled === !0
//                 },
//                 checked: function(a) {
//                     var b = a.nodeName.toLowerCase();
//                     return "input" === b && !!a.checked || "option" === b && !!a.selected
//                 },
//                 selected: function(a) {
//                     return a.parentNode && a.parentNode.selectedIndex,
//                     a.selected === !0
//                 },
//                 empty: function(a) {
//                     for (a = a.firstChild; a; a = a.nextSibling)
//                         if (a.nodeType < 6)
//                             return !1;
//                     return !0
//                 },
//                 parent: function(a) {
//                     return !d.pseudos.empty(a)
//                 },
//                 header: function(a) {
//                     return X.test(a.nodeName)
//                 },
//                 input: function(a) {
//                     return W.test(a.nodeName)
//                 },
//                 button: function(a) {
//                     var b = a.nodeName.toLowerCase();
//                     return "input" === b && "button" === a.type || "button" === b
//                 },
//                 text: function(a) {
//                     var b;
//                     return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
//                 },
//                 first: lb(function() {
//                     return [0]
//                 }),
//                 last: lb(function(a, b) {
//                     return [b - 1]
//                 }),
//                 eq: lb(function(a, b, c) {
//                     return [0 > c ? c + b : c]
//                 }),
//                 even: lb(function(a, b) {
//                     for (var c = 0; b > c; c += 2)
//                         a.push(c);
//                     return a
//                 }),
//                 odd: lb(function(a, b) {
//                     for (var c = 1; b > c; c += 2)
//                         a.push(c);
//                     return a
//                 }),
//                 lt: lb(function(a, b, c) {
//                     for (var d = 0 > c ? c + b : c; --d >= 0; )
//                         a.push(d);
//                     return a
//                 }),
//                 gt: lb(function(a, b, c) {
//                     for (var d = 0 > c ? c + b : c; ++d < b; )
//                         a.push(d);
//                     return a
//                 })
//             }
//         },
//         d.pseudos.nth = d.pseudos.eq;
//         for (b in {
//             radio: !0,
//             checkbox: !0,
//             file: !0,
//             password: !0,
//             image: !0
//         })
//             d.pseudos[b] = jb(b);
//         for (b in {
//             submit: !0,
//             reset: !0
//         })
//             d.pseudos[b] = kb(b);
//         function nb() {}
//         nb.prototype = d.filters = d.pseudos,
//         d.setFilters = new nb;
//         function ob(a, b) {
//             var c, e, f, g, h, i, j, k = x[a + " "];
//             if (k)
//                 return b ? 0 : k.slice(0);
//             h = a,
//             i = [],
//             j = d.preFilter;
//             while (h) {
//                 (!c || (e = Q.exec(h))) && (e && (h = h.slice(e[0].length) || h),
//                 i.push(f = [])),
//                 c = !1,
//                 (e = R.exec(h)) && (c = e.shift(),
//                 f.push({
//                     value: c,
//                     type: e[0].replace(P, " ")
//                 }),
//                 h = h.slice(c.length));
//                 for (g in d.filter)
//                     !(e = V[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(),
//                     f.push({
//                         value: c,
//                         type: g,
//                         matches: e
//                     }),
//                     h = h.slice(c.length));
//                 if (!c)
//                     break
//             }
//             return b ? h.length : h ? db.error(a) : x(a, i).slice(0)
//         }
//         function pb(a) {
//             for (var b = 0, c = a.length, d = ""; c > b; b++)
//                 d += a[b].value;
//             return d
//         }
//         function qb(a, b, c) {
//             var d = b.dir
//               , e = c && "parentNode" === d
//               , f = v++;
//             return b.first ? function(b, c, f) {
//                 while (b = b[d])
//                     if (1 === b.nodeType || e)
//                         return a(b, c, f)
//             }
//             : function(b, c, g) {
//                 var h, i, j = [u, f];
//                 if (g) {
//                     while (b = b[d])
//                         if ((1 === b.nodeType || e) && a(b, c, g))
//                             return !0
//                 } else
//                     while (b = b[d])
//                         if (1 === b.nodeType || e) {
//                             if (i = b[s] || (b[s] = {}),
//                             (h = i[d]) && h[0] === u && h[1] === f)
//                                 return j[2] = h[2];
//                             if (i[d] = j,
//                             j[2] = a(b, c, g))
//                                 return !0
//                         }
//             }
//         }
//         function rb(a) {
//             return a.length > 1 ? function(b, c, d) {
//                 var e = a.length;
//                 while (e--)
//                     if (!a[e](b, c, d))
//                         return !1;
//                 return !0
//             }
//             : a[0]
//         }
//         function sb(a, b, c, d, e) {
//             for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)
//                 (f = a[h]) && (!c || c(f, d, e)) && (g.push(f),
//                 j && b.push(h));
//             return g
//         }
//         function tb(a, b, c, d, e, f) {
//             return d && !d[s] && (d = tb(d)),
//             e && !e[s] && (e = tb(e, f)),
//             fb(function(f, g, h, i) {
//                 var j, k, l, m = [], n = [], o = g.length, p = f || wb(b || "*", h.nodeType ? [h] : h, []), q = !a || !f && b ? p : sb(p, m, a, h, i), r = c ? e || (f ? a : o || d) ? [] : g : q;
//                 if (c && c(q, r, h, i),
//                 d) {
//                     j = sb(r, n),
//                     d(j, [], h, i),
//                     k = j.length;
//                     while (k--)
//                         (l = j[k]) && (r[n[k]] = !(q[n[k]] = l))
//                 }
//                 if (f) {
//                     if (e || a) {
//                         if (e) {
//                             j = [],
//                             k = r.length;
//                             while (k--)
//                                 (l = r[k]) && j.push(q[k] = l);
//                             e(null , r = [], j, i)
//                         }
//                         k = r.length;
//                         while (k--)
//                             (l = r[k]) && (j = e ? I.call(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l))
//                     }
//                 } else
//                     r = sb(r === g ? r.splice(o, r.length) : r),
//                     e ? e(null , g, r, i) : G.apply(g, r)
//             })
//         }
//         function ub(a) {
//             for (var b, c, e, f = a.length, g = d.relative[a[0].type], i = g || d.relative[" "], j = g ? 1 : 0, k = qb(function(a) {
//                 return a === b
//             }, i, !0), l = qb(function(a) {
//                 return I.call(b, a) > -1
//             }, i, !0), m = [function(a, c, d) {
//                 return !g && (d || c !== h) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d))
//             }
//             ]; f > j; j++)
//                 if (c = d.relative[a[j].type])
//                     m = [qb(rb(m), c)];
//                 else {
//                     if (c = d.filter[a[j].type].apply(null , a[j].matches),
//                     c[s]) {
//                         for (e = ++j; f > e; e++)
//                             if (d.relative[a[e].type])
//                                 break;
//                         return tb(j > 1 && rb(m), j > 1 && pb(a.slice(0, j - 1).concat({
//                             value: " " === a[j - 2].type ? "*" : ""
//                         })).replace(P, "$1"), c, e > j && ub(a.slice(j, e)), f > e && ub(a = a.slice(e)), f > e && pb(a))
//                     }
//                     m.push(c)
//                 }
//             return rb(m)
//         }
//         function vb(a, b) {
//             var c = b.length > 0
//               , e = a.length > 0
//               , f = function(f, g, i, j, k) {
//                 var m, n, o, p = 0, q = "0", r = f && [], s = [], t = h, v = f || e && d.find.TAG("*", k), w = u += null == t ? 1 : Math.random() || .1, x = v.length;
//                 for (k && (h = g !== l && g); q !== x && null != (m = v[q]); q++) {
//                     if (e && m) {
//                         n = 0;
//                         while (o = a[n++])
//                             if (o(m, g, i)) {
//                                 j.push(m);
//                                 break
//                             }
//                         k && (u = w)
//                     }
//                     c && ((m = !o && m) && p--,
//                     f && r.push(m))
//                 }
//                 if (p += q,
//                 c && q !== p) {
//                     n = 0;
//                     while (o = b[n++])
//                         o(r, s, g, i);
//                     if (f) {
//                         if (p > 0)
//                             while (q--)
//                                 r[q] || s[q] || (s[q] = E.call(j));
//                         s = sb(s)
//                     }
//                     G.apply(j, s),
//                     k && !f && s.length > 0 && p + b.length > 1 && db.uniqueSort(j)
//                 }
//                 return k && (u = w,
//                 h = t),
//                 r
//             }
//             ;
//             return c ? fb(f) : f
//         }
//         g = db.compile = function(a, b) {
//             var c, d = [], e = [], f = y[a + " "];
//             if (!f) {
//                 b || (b = ob(a)),
//                 c = b.length;
//                 while (c--)
//                     f = ub(b[c]),
//                     f[s] ? d.push(f) : e.push(f);
//                 f = y(a, vb(e, d))
//             }
//             return f
//         }
//         ;
//         function wb(a, b, c) {
//             for (var d = 0, e = b.length; e > d; d++)
//                 db(a, b[d], c);
//             return c
//         }
//         function xb(a, b, e, f) {
//             var h, i, j, k, l, m = ob(a);
//             if (!f && 1 === m.length) {
//                 if (i = m[0] = m[0].slice(0),
//                 i.length > 2 && "ID" === (j = i[0]).type && c.getById && 9 === b.nodeType && n && d.relative[i[1].type]) {
//                     if (b = (d.find.ID(j.matches[0].replace(ab, bb), b) || [])[0],
//                     !b)
//                         return e;
//                     a = a.slice(i.shift().value.length)
//                 }
//                 h = V.needsContext.test(a) ? 0 : i.length;
//                 while (h--) {
//                     if (j = i[h],
//                     d.relative[k = j.type])
//                         break;
//                     if ((l = d.find[k]) && (f = l(j.matches[0].replace(ab, bb), $.test(i[0].type) && mb(b.parentNode) || b))) {
//                         if (i.splice(h, 1),
//                         a = f.length && pb(i),
//                         !a)
//                             return G.apply(e, f),
//                             e;
//                         break
//                     }
//                 }
//             }
//             return g(a, m)(f, b, !n, e, $.test(a) && mb(b.parentNode) || b),
//             e
//         }
//         return c.sortStable = s.split("").sort(z).join("") === s,
//         c.detectDuplicates = !!j,
//         k(),
//         c.sortDetached = gb(function(a) {
//             return 1 & a.compareDocumentPosition(l.createElement("div"))
//         }),
//         gb(function(a) {
//             return a.innerHTML = "<a href='#'></a>",
//             "#" === a.firstChild.getAttribute("href")
//         }) || hb("type|href|height|width", function(a, b, c) {
//             return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
//         }),
//         c.attributes && gb(function(a) {
//             return a.innerHTML = "<input/>",
//             a.firstChild.setAttribute("value", ""),
//             "" === a.firstChild.getAttribute("value")
//         }) || hb("value", function(a, b, c) {
//             return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
//         }),
//         gb(function(a) {
//             return null == a.getAttribute("disabled")
//         }) || hb(J, function(a, b, c) {
//             var d;
//             return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
//         }),
//         db
//     }(a);
//     n.find = t,
//     n.expr = t.selectors,
//     n.expr[":"] = n.expr.pseudos,
//     n.unique = t.uniqueSort,
//     n.text = t.getText,
//     n.isXMLDoc = t.isXML,
//     n.contains = t.contains;
//     var u = n.expr.match.needsContext
//       , v = /^<(\w+)\s*\/?>(?:<\/\1>|)$/
//       , w = /^.[^:#\[\.,]*$/;
//     function x(a, b, c) {
//         if (n.isFunction(b))
//             return n.grep(a, function(a, d) {
//                 return !!b.call(a, d, a) !== c
//             });
//         if (b.nodeType)
//             return n.grep(a, function(a) {
//                 return a === b !== c
//             });
//         if ("string" == typeof b) {
//             if (w.test(b))
//                 return n.filter(b, a, c);
//             b = n.filter(b, a)
//         }
//         return n.grep(a, function(a) {
//             return n.inArray(a, b) >= 0 !== c
//         })
//     }
//     n.filter = function(a, b, c) {
//         var d = b[0];
//         return c && (a = ":not(" + a + ")"),
//         1 === b.length && 1 === d.nodeType ? n.find.matchesSelector(d, a) ? [d] : [] : n.find.matches(a, n.grep(b, function(a) {
//             return 1 === a.nodeType
//         }))
//     }
//     ,
//     n.fn.extend({
//         find: function(a) {
//             var b, c = [], d = this, e = d.length;
//             if ("string" != typeof a)
//                 return this.pushStack(n(a).filter(function() {
//                     for (b = 0; e > b; b++)
//                         if (n.contains(d[b], this))
//                             return !0
//                 }));
//             for (b = 0; e > b; b++)
//                 n.find(a, d[b], c);
//             return c = this.pushStack(e > 1 ? n.unique(c) : c),
//             c.selector = this.selector ? this.selector + " " + a : a,
//             c
//         },
//         filter: function(a) {
//             return this.pushStack(x(this, a || [], !1))
//         },
//         not: function(a) {
//             return this.pushStack(x(this, a || [], !0))
//         },
//         is: function(a) {
//             return !!x(this, "string" == typeof a && u.test(a) ? n(a) : a || [], !1).length
//         }
//     });
//     var y, z = a.document, A = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, B = n.fn.init = function(a, b) {
//         var c, d;
//         if (!a)
//             return this;
//         if ("string" == typeof a) {
//             if (c = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null , a, null ] : A.exec(a),
//             !c || !c[1] && b)
//                 return !b || b.jquery ? (b || y).find(a) : this.constructor(b).find(a);
//             if (c[1]) {
//                 if (b = b instanceof n ? b[0] : b,
//                 n.merge(this, n.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : z, !0)),
//                 v.test(c[1]) && n.isPlainObject(b))
//                     for (c in b)
//                         n.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
//                 return this
//             }
//             if (d = z.getElementById(c[2]),
//             d && d.parentNode) {
//                 if (d.id !== c[2])
//                     return y.find(a);
//                 this.length = 1,
//                 this[0] = d
//             }
//             return this.context = z,
//             this.selector = a,
//             this
//         }
//         return a.nodeType ? (this.context = this[0] = a,
//         this.length = 1,
//         this) : n.isFunction(a) ? "undefined" != typeof y.ready ? y.ready(a) : a(n) : (void 0 !== a.selector && (this.selector = a.selector,
//         this.context = a.context),
//         n.makeArray(a, this))
//     }
//     ;
//     B.prototype = n.fn,
//     y = n(z);
//     var C = /^(?:parents|prev(?:Until|All))/
//       , D = {
//         children: !0,
//         contents: !0,
//         next: !0,
//         prev: !0
//     };
//     n.extend({
//         dir: function(a, b, c) {
//             var d = []
//               , e = a[b];
//             while (e && 9 !== e.nodeType && (void 0 === c || 1 !== e.nodeType || !n(e).is(c)))
//                 1 === e.nodeType && d.push(e),
//                 e = e[b];
//             return d
//         },
//         sibling: function(a, b) {
//             for (var c = []; a; a = a.nextSibling)
//                 1 === a.nodeType && a !== b && c.push(a);
//             return c
//         }
//     }),
//     n.fn.extend({
//         has: function(a) {
//             var b, c = n(a, this), d = c.length;
//             return this.filter(function() {
//                 for (b = 0; d > b; b++)
//                     if (n.contains(this, c[b]))
//                         return !0
//             })
//         },
//         closest: function(a, b) {
//             for (var c, d = 0, e = this.length, f = [], g = u.test(a) || "string" != typeof a ? n(a, b || this.context) : 0; e > d; d++)
//                 for (c = this[d]; c && c !== b; c = c.parentNode)
//                     if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && n.find.matchesSelector(c, a))) {
//                         f.push(c);
//                         break
//                     }
//             return this.pushStack(f.length > 1 ? n.unique(f) : f)
//         },
//         index: function(a) {
//             return a ? "string" == typeof a ? n.inArray(this[0], n(a)) : n.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
//         },
//         add: function(a, b) {
//             return this.pushStack(n.unique(n.merge(this.get(), n(a, b))))
//         },
//         addBack: function(a) {
//             return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
//         }
//     });
//     function E(a, b) {
//         do
//             a = a[b];
//         while (a && 1 !== a.nodeType);return a
//     }
//     n.each({
//         parent: function(a) {
//             var b = a.parentNode;
//             return b && 11 !== b.nodeType ? b : null
//         },
//         parents: function(a) {
//             return n.dir(a, "parentNode")
//         },
//         parentsUntil: function(a, b, c) {
//             return n.dir(a, "parentNode", c)
//         },
//         next: function(a) {
//             return E(a, "nextSibling")
//         },
//         prev: function(a) {
//             return E(a, "previousSibling")
//         },
//         nextAll: function(a) {
//             return n.dir(a, "nextSibling")
//         },
//         prevAll: function(a) {
//             return n.dir(a, "previousSibling")
//         },
//         nextUntil: function(a, b, c) {
//             return n.dir(a, "nextSibling", c)
//         },
//         prevUntil: function(a, b, c) {
//             return n.dir(a, "previousSibling", c)
//         },
//         siblings: function(a) {
//             return n.sibling((a.parentNode || {}).firstChild, a)
//         },
//         children: function(a) {
//             return n.sibling(a.firstChild)
//         },
//         contents: function(a) {
//             return n.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : n.merge([], a.childNodes)
//         }
//     }, function(a, b) {
//         n.fn[a] = function(c, d) {
//             var e = n.map(this, b, c);
//             return "Until" !== a.slice(-5) && (d = c),
//             d && "string" == typeof d && (e = n.filter(d, e)),
//             this.length > 1 && (D[a] || (e = n.unique(e)),
//             C.test(a) && (e = e.reverse())),
//             this.pushStack(e)
//         }
//     });
//     var F = /\S+/g
//       , G = {};
//     function H(a) {
//         var b = G[a] = {};
//         return n.each(a.match(F) || [], function(a, c) {
//             b[c] = !0
//         }),
//         b
//     }
//     n.Callbacks = function(a) {
//         a = "string" == typeof a ? G[a] || H(a) : n.extend({}, a);
//         var b, c, d, e, f, g, h = [], i = !a.once && [], j = function(l) {
//             for (c = a.memory && l,
//             d = !0,
//             f = g || 0,
//             g = 0,
//             e = h.length,
//             b = !0; h && e > f; f++)
//                 if (h[f].apply(l[0], l[1]) === !1 && a.stopOnFalse) {
//                     c = !1;
//                     break
//                 }
//             b = !1,
//             h && (i ? i.length && j(i.shift()) : c ? h = [] : k.disable())
//         }
//         , k = {
//             add: function() {
//                 if (h) {
//                     var d = h.length;
//                     !function f(b) {
//                         n.each(b, function(b, c) {
//                             var d = n.type(c);
//                             "function" === d ? a.unique && k.has(c) || h.push(c) : c && c.length && "string" !== d && f(c)
//                         })
//                     }(arguments),
//                     b ? e = h.length : c && (g = d,
//                     j(c))
//                 }
//                 return this
//             },
//             remove: function() {
//                 return h && n.each(arguments, function(a, c) {
//                     var d;
//                     while ((d = n.inArray(c, h, d)) > -1)
//                         h.splice(d, 1),
//                         b && (e >= d && e--,
//                         f >= d && f--)
//                 }),
//                 this
//             },
//             has: function(a) {
//                 return a ? n.inArray(a, h) > -1 : !(!h || !h.length)
//             },
//             empty: function() {
//                 return h = [],
//                 e = 0,
//                 this
//             },
//             disable: function() {
//                 return h = i = c = void 0,
//                 this
//             },
//             disabled: function() {
//                 return !h
//             },
//             lock: function() {
//                 return i = void 0,
//                 c || k.disable(),
//                 this
//             },
//             locked: function() {
//                 return !i
//             },
//             fireWith: function(a, c) {
//                 return !h || d && !i || (c = c || [],
//                 c = [a, c.slice ? c.slice() : c],
//                 b ? i.push(c) : j(c)),
//                 this
//             },
//             fire: function() {
//                 return k.fireWith(this, arguments),
//                 this
//             },
//             fired: function() {
//                 return !!d
//             }
//         };
//         return k
//     }
//     ,
//     n.extend({
//         Deferred: function(a) {
//             var b = [["resolve", "done", n.Callbacks("once memory"), "resolved"], ["reject", "fail", n.Callbacks("once memory"), "rejected"], ["notify", "progress", n.Callbacks("memory")]]
//               , c = "pending"
//               , d = {
//                 state: function() {
//                     return c
//                 },
//                 always: function() {
//                     return e.done(arguments).fail(arguments),
//                     this
//                 },
//                 then: function() {
//                     var a = arguments;
//                     return n.Deferred(function(c) {
//                         n.each(b, function(b, f) {
//                             var g = n.isFunction(a[b]) && a[b];
//                             e[f[1]](function() {
//                                 var a = g && g.apply(this, arguments);
//                                 a && n.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
//                             })
//                         }),
//                         a = null
//                     }).promise()
//                 },
//                 promise: function(a) {
//                     return null != a ? n.extend(a, d) : d
//                 }
//             }
//               , e = {};
//             return d.pipe = d.then,
//             n.each(b, function(a, f) {
//                 var g = f[2]
//                   , h = f[3];
//                 d[f[1]] = g.add,
//                 h && g.add(function() {
//                     c = h
//                 }, b[1 ^ a][2].disable, b[2][2].lock),
//                 e[f[0]] = function() {
//                     return e[f[0] + "With"](this === e ? d : this, arguments),
//                     this
//                 }
//                 ,
//                 e[f[0] + "With"] = g.fireWith
//             }),
//             d.promise(e),
//             a && a.call(e, e),
//             e
//         },
//         when: function(a) {
//             var b = 0, c = d.call(arguments), e = c.length, f = 1 !== e || a && n.isFunction(a.promise) ? e : 0, g = 1 === f ? a : n.Deferred(), h = function(a, b, c) {
//                 return function(e) {
//                     b[a] = this,
//                     c[a] = arguments.length > 1 ? d.call(arguments) : e,
//                     c === i ? g.notifyWith(b, c) : --f || g.resolveWith(b, c)
//                 }
//             }
//             , i, j, k;
//             if (e > 1)
//                 for (i = new Array(e),
//                 j = new Array(e),
//                 k = new Array(e); e > b; b++)
//                     c[b] && n.isFunction(c[b].promise) ? c[b].promise().done(h(b, k, c)).fail(g.reject).progress(h(b, j, i)) : --f;
//             return f || g.resolveWith(k, c),
//             g.promise()
//         }
//     });
//     var I;
//     n.fn.ready = function(a) {
//         return n.ready.promise().done(a),
//         this
//     }
//     ,
//     n.extend({
//         isReady: !1,
//         readyWait: 1,
//         holdReady: function(a) {
//             a ? n.readyWait++ : n.ready(!0)
//         },
//         ready: function(a) {
//             if (a === !0 ? !--n.readyWait : !n.isReady) {
//                 if (!z.body)
//                     return setTimeout(n.ready);
//                 n.isReady = !0,
//                 a !== !0 && --n.readyWait > 0 || (I.resolveWith(z, [n]),
//                 n.fn.trigger && n(z).trigger("ready").off("ready"))
//             }
//         }
//     });
//     function J() {
//         z.addEventListener ? (z.removeEventListener("DOMContentLoaded", K, !1),
//         a.removeEventListener("load", K, !1)) : (z.detachEvent("onreadystatechange", K),
//         a.detachEvent("onload", K))
//     }
//     function K() {
//         (z.addEventListener || "load" === event.type || "complete" === z.readyState) && (J(),
//         n.ready())
//     }
//     n.ready.promise = function(b) {
//         if (!I)
//             if (I = n.Deferred(),
//             "complete" === z.readyState)
//                 setTimeout(n.ready);
//             else if (z.addEventListener)
//                 z.addEventListener("DOMContentLoaded", K, !1),
//                 a.addEventListener("load", K, !1);
//             else {
//                 z.attachEvent("onreadystatechange", K),
//                 a.attachEvent("onload", K);
//                 var c = !1;
//                 try {
//                     c = null == a.frameElement && z.documentElement
//                 } catch (d) {}
//                 c && c.doScroll && !function e() {
//                     if (!n.isReady) {
//                         try {
//                             c.doScroll("left")
//                         } catch (a) {
//                             return setTimeout(e, 50)
//                         }
//                         J(),
//                         n.ready()
//                     }
//                 }()
//             }
//         return I.promise(b)
//     }
//     ;
//     var L = "undefined", M;
//     for (M in n(l))
//         break;
//     l.ownLast = "0" !== M,
//     l.inlineBlockNeedsLayout = !1,
//     n(function() {
//         var a, b, c = z.getElementsByTagName("body")[0];
//         c && (a = z.createElement("div"),
//         a.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",
//         b = z.createElement("div"),
//         c.appendChild(a).appendChild(b),
//         typeof b.style.zoom !== L && (b.style.cssText = "border:0;margin:0;width:1px;padding:1px;display:inline;zoom:1",
//         (l.inlineBlockNeedsLayout = 3 === b.offsetWidth) && (c.style.zoom = 1)),
//         c.removeChild(a),
//         a = b = null )
//     }),
//     function() {
//         var a = z.createElement("div");
//         if (null == l.deleteExpando) {
//             l.deleteExpando = !0;
//             try {
//                 delete a.test
//             } catch (b) {
//                 l.deleteExpando = !1
//             }
//         }
//         a = null
//     }(),
//     n.acceptData = function(a) {
//         var b = n.noData[(a.nodeName + " ").toLowerCase()]
//           , c = +a.nodeType || 1;
//         return 1 !== c && 9 !== c ? !1 : !b || b !== !0 && a.getAttribute("classid") === b
//     }
//     ;
//     var N = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
//       , O = /([A-Z])/g;
//     function P(a, b, c) {
//         if (void 0 === c && 1 === a.nodeType) {
//             var d = "data-" + b.replace(O, "-$1").toLowerCase();
//             if (c = a.getAttribute(d),
//             "string" == typeof c) {
//                 try {
//                     c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : N.test(c) ? n.parseJSON(c) : c
//                 } catch (e) {}
//                 n.data(a, b, c)
//             } else
//                 c = void 0
//         }
//         return c
//     }
//     function Q(a) {
//         var b;
//         for (b in a)
//             if (("data" !== b || !n.isEmptyObject(a[b])) && "toJSON" !== b)
//                 return !1;
//         return !0
//     }
//     function R(a, b, d, e) {
//         if (n.acceptData(a)) {
//             var f, g, h = n.expando, i = a.nodeType, j = i ? n.cache : a, k = i ? a[h] : a[h] && h;
//             if (k && j[k] && (e || j[k].data) || void 0 !== d || "string" != typeof b)
//                 return k || (k = i ? a[h] = c.pop() || n.guid++ : h),
//                 j[k] || (j[k] = i ? {} : {
//                     toJSON: n.noop
//                 }),
//                 ("object" == typeof b || "function" == typeof b) && (e ? j[k] = n.extend(j[k], b) : j[k].data = n.extend(j[k].data, b)),
//                 g = j[k],
//                 e || (g.data || (g.data = {}),
//                 g = g.data),
//                 void 0 !== d && (g[n.camelCase(b)] = d),
//                 "string" == typeof b ? (f = g[b],
//                 null == f && (f = g[n.camelCase(b)])) : f = g,
//                 f
//         }
//     }
//     function S(a, b, c) {
//         if (n.acceptData(a)) {
//             var d, e, f = a.nodeType, g = f ? n.cache : a, h = f ? a[n.expando] : n.expando;
//             if (g[h]) {
//                 if (b && (d = c ? g[h] : g[h].data)) {
//                     n.isArray(b) ? b = b.concat(n.map(b, n.camelCase)) : b in d ? b = [b] : (b = n.camelCase(b),
//                     b = b in d ? [b] : b.split(" ")),
//                     e = b.length;
//                     while (e--)
//                         delete d[b[e]];
//                     if (c ? !Q(d) : !n.isEmptyObject(d))
//                         return
//                 }
//                 (c || (delete g[h].data,
//                 Q(g[h]))) && (f ? n.cleanData([a], !0) : l.deleteExpando || g != g.window ? delete g[h] : g[h] = null )
//             }
//         }
//     }
//     n.extend({
//         cache: {},
//         noData: {
//             "applet ": !0,
//             "embed ": !0,
//             "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
//         },
//         hasData: function(a) {
//             return a = a.nodeType ? n.cache[a[n.expando]] : a[n.expando],
//             !!a && !Q(a)
//         },
//         data: function(a, b, c) {
//             return R(a, b, c)
//         },
//         removeData: function(a, b) {
//             return S(a, b)
//         },
//         _data: function(a, b, c) {
//             return R(a, b, c, !0)
//         },
//         _removeData: function(a, b) {
//             return S(a, b, !0)
//         }
//     }),
//     n.fn.extend({
//         data: function(a, b) {
//             var c, d, e, f = this[0], g = f && f.attributes;
//             if (void 0 === a) {
//                 if (this.length && (e = n.data(f),
//                 1 === f.nodeType && !n._data(f, "parsedAttrs"))) {
//                     c = g.length;
//                     while (c--)
//                         d = g[c].name,
//                         0 === d.indexOf("data-") && (d = n.camelCase(d.slice(5)),
//                         P(f, d, e[d]));
//                     n._data(f, "parsedAttrs", !0)
//                 }
//                 return e
//             }
//             return "object" == typeof a ? this.each(function() {
//                 n.data(this, a)
//             }) : arguments.length > 1 ? this.each(function() {
//                 n.data(this, a, b)
//             }) : f ? P(f, a, n.data(f, a)) : void 0
//         },
//         removeData: function(a) {
//             return this.each(function() {
//                 n.removeData(this, a)
//             })
//         }
//     }),
//     n.extend({
//         queue: function(a, b, c) {
//             var d;
//             return a ? (b = (b || "fx") + "queue",
//             d = n._data(a, b),
//             c && (!d || n.isArray(c) ? d = n._data(a, b, n.makeArray(c)) : d.push(c)),
//             d || []) : void 0
//         },
//         dequeue: function(a, b) {
//             b = b || "fx";
//             var c = n.queue(a, b)
//               , d = c.length
//               , e = c.shift()
//               , f = n._queueHooks(a, b)
//               , g = function() {
//                 n.dequeue(a, b)
//             }
//             ;
//             "inprogress" === e && (e = c.shift(),
//             d--),
//             e && ("fx" === b && c.unshift("inprogress"),
//             delete f.stop,
//             e.call(a, g, f)),
//             !d && f && f.empty.fire()
//         },
//         _queueHooks: function(a, b) {
//             var c = b + "queueHooks";
//             return n._data(a, c) || n._data(a, c, {
//                 empty: n.Callbacks("once memory").add(function() {
//                     n._removeData(a, b + "queue"),
//                     n._removeData(a, c)
//                 })
//             })
//         }
//     }),
//     n.fn.extend({
//         queue: function(a, b) {
//             var c = 2;
//             return "string" != typeof a && (b = a,
//             a = "fx",
//             c--),
//             arguments.length < c ? n.queue(this[0], a) : void 0 === b ? this : this.each(function() {
//                 var c = n.queue(this, a, b);
//                 n._queueHooks(this, a),
//                 "fx" === a && "inprogress" !== c[0] && n.dequeue(this, a)
//             })
//         },
//         dequeue: function(a) {
//             return this.each(function() {
//                 n.dequeue(this, a)
//             })
//         },
//         clearQueue: function(a) {
//             return this.queue(a || "fx", [])
//         },
//         promise: function(a, b) {
//             var c, d = 1, e = n.Deferred(), f = this, g = this.length, h = function() {
//                 --d || e.resolveWith(f, [f])
//             }
//             ;
//             "string" != typeof a && (b = a,
//             a = void 0),
//             a = a || "fx";
//             while (g--)
//                 c = n._data(f[g], a + "queueHooks"),
//                 c && c.empty && (d++,
//                 c.empty.add(h));
//             return h(),
//             e.promise(b)
//         }
//     });
//     var T = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
//       , U = ["Top", "Right", "Bottom", "Left"]
//       , V = function(a, b) {
//         return a = b || a,
//         "none" === n.css(a, "display") || !n.contains(a.ownerDocument, a)
//     }
//       , W = n.access = function(a, b, c, d, e, f, g) {
//         var h = 0
//           , i = a.length
//           , j = null == c;
//         if ("object" === n.type(c)) {
//             e = !0;
//             for (h in c)
//                 n.access(a, b, h, c[h], !0, f, g)
//         } else if (void 0 !== d && (e = !0,
//         n.isFunction(d) || (g = !0),
//         j && (g ? (b.call(a, d),
//         b = null ) : (j = b,
//         b = function(a, b, c) {
//             return j.call(n(a), c)
//         }
//         )),
//         b))
//             for (; i > h; h++)
//                 b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
//         return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
//     }
//       , X = /^(?:checkbox|radio)$/i;
//     !function() {
//         var a = z.createDocumentFragment()
//           , b = z.createElement("div")
//           , c = z.createElement("input");
//         if (b.setAttribute("className", "t"),
//         b.innerHTML = "  <link/><table></table><a href='/a'>a</a>",
//         l.leadingWhitespace = 3 === b.firstChild.nodeType,
//         l.tbody = !b.getElementsByTagName("tbody").length,
//         l.htmlSerialize = !!b.getElementsByTagName("link").length,
//         l.html5Clone = "<:nav></:nav>" !== z.createElement("nav").cloneNode(!0).outerHTML,
//         c.type = "checkbox",
//         c.checked = !0,
//         a.appendChild(c),
//         l.appendChecked = c.checked,
//         b.innerHTML = "<textarea>x</textarea>",
//         l.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue,
//         a.appendChild(b),
//         b.innerHTML = "<input type='radio' checked='checked' name='t'/>",
//         l.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked,
//         l.noCloneEvent = !0,
//         b.attachEvent && (b.attachEvent("onclick", function() {
//             l.noCloneEvent = !1
//         }),
//         b.cloneNode(!0).click()),
//         null == l.deleteExpando) {
//             l.deleteExpando = !0;
//             try {
//                 delete b.test
//             } catch (d) {
//                 l.deleteExpando = !1
//             }
//         }
//         a = b = c = null
//     }(),
//     function() {
//         var b, c, d = z.createElement("div");
//         for (b in {
//             submit: !0,
//             change: !0,
//             focusin: !0
//         })
//             c = "on" + b,
//             (l[b + "Bubbles"] = c in a) || (d.setAttribute(c, "t"),
//             l[b + "Bubbles"] = d.attributes[c].expando === !1);
//         d = null
//     }();
//     var Y = /^(?:input|select|textarea)$/i
//       , Z = /^key/
//       , $ = /^(?:mouse|contextmenu)|click/
//       , _ = /^(?:focusinfocus|focusoutblur)$/
//       , ab = /^([^.]*)(?:\.(.+)|)$/;
//     function bb() {
//         return !0
//     }
//     function cb() {
//         return !1
//     }
//     function db() {
//         try {
//             return z.activeElement
//         } catch (a) {}
//     }
//     n.event = {
//         global: {},
//         add: function(a, b, c, d, e) {
//             var f, g, h, i, j, k, l, m, o, p, q, r = n._data(a);
//             if (r) {
//                 c.handler && (i = c,
//                 c = i.handler,
//                 e = i.selector),
//                 c.guid || (c.guid = n.guid++),
//                 (g = r.events) || (g = r.events = {}),
//                 (k = r.handle) || (k = r.handle = function(a) {
//                     return typeof n === L || a && n.event.triggered === a.type ? void 0 : n.event.dispatch.apply(k.elem, arguments)
//                 }
//                 ,
//                 k.elem = a),
//                 b = (b || "").match(F) || [""],
//                 h = b.length;
//                 while (h--)
//                     f = ab.exec(b[h]) || [],
//                     o = q = f[1],
//                     p = (f[2] || "").split(".").sort(),
//                     o && (j = n.event.special[o] || {},
//                     o = (e ? j.delegateType : j.bindType) || o,
//                     j = n.event.special[o] || {},
//                     l = n.extend({
//                         type: o,
//                         origType: q,
//                         data: d,
//                         handler: c,
//                         guid: c.guid,
//                         selector: e,
//                         needsContext: e && n.expr.match.needsContext.test(e),
//                         namespace: p.join(".")
//                     }, i),
//                     (m = g[o]) || (m = g[o] = [],
//                     m.delegateCount = 0,
//                     j.setup && j.setup.call(a, d, p, k) !== !1 || (a.addEventListener ? a.addEventListener(o, k, !1) : a.attachEvent && a.attachEvent("on" + o, k))),
//                     j.add && (j.add.call(a, l),
//                     l.handler.guid || (l.handler.guid = c.guid)),
//                     e ? m.splice(m.delegateCount++, 0, l) : m.push(l),
//                     n.event.global[o] = !0);
//                 a = null
//             }
//         },
//         remove: function(a, b, c, d, e) {
//             var f, g, h, i, j, k, l, m, o, p, q, r = n.hasData(a) && n._data(a);
//             if (r && (k = r.events)) {
//                 b = (b || "").match(F) || [""],
//                 j = b.length;
//                 while (j--)
//                     if (h = ab.exec(b[j]) || [],
//                     o = q = h[1],
//                     p = (h[2] || "").split(".").sort(),
//                     o) {
//                         l = n.event.special[o] || {},
//                         o = (d ? l.delegateType : l.bindType) || o,
//                         m = k[o] || [],
//                         h = h[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"),
//                         i = f = m.length;
//                         while (f--)
//                             g = m[f],
//                             !e && q !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (m.splice(f, 1),
//                             g.selector && m.delegateCount--,
//                             l.remove && l.remove.call(a, g));
//                         i && !m.length && (l.teardown && l.teardown.call(a, p, r.handle) !== !1 || n.removeEvent(a, o, r.handle),
//                         delete k[o])
//                     } else
//                         for (o in k)
//                             n.event.remove(a, o + b[j], c, d, !0);
//                 n.isEmptyObject(k) && (delete r.handle,
//                 n._removeData(a, "events"))
//             }
//         },
//         trigger: function(b, c, d, e) {
//             var f, g, h, i, k, l, m, o = [d || z], p = j.call(b, "type") ? b.type : b, q = j.call(b, "namespace") ? b.namespace.split(".") : [];
//             if (h = l = d = d || z,
//             3 !== d.nodeType && 8 !== d.nodeType && !_.test(p + n.event.triggered) && (p.indexOf(".") >= 0 && (q = p.split("."),
//             p = q.shift(),
//             q.sort()),
//             g = p.indexOf(":") < 0 && "on" + p,
//             b = b[n.expando] ? b : new n.Event(p,"object" == typeof b && b),
//             b.isTrigger = e ? 2 : 3,
//             b.namespace = q.join("."),
//             b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + q.join("\\.(?:.*\\.|)") + "(\\.|$)") : null ,
//             b.result = void 0,
//             b.target || (b.target = d),
//             c = null == c ? [b] : n.makeArray(c, [b]),
//             k = n.event.special[p] || {},
//             e || !k.trigger || k.trigger.apply(d, c) !== !1)) {
//                 if (!e && !k.noBubble && !n.isWindow(d)) {
//                     for (i = k.delegateType || p,
//                     _.test(i + p) || (h = h.parentNode); h; h = h.parentNode)
//                         o.push(h),
//                         l = h;
//                     l === (d.ownerDocument || z) && o.push(l.defaultView || l.parentWindow || a)
//                 }
//                 m = 0;
//                 while ((h = o[m++]) && !b.isPropagationStopped())
//                     b.type = m > 1 ? i : k.bindType || p,
//                     f = (n._data(h, "events") || {})[b.type] && n._data(h, "handle"),
//                     f && f.apply(h, c),
//                     f = g && h[g],
//                     f && f.apply && n.acceptData(h) && (b.result = f.apply(h, c),
//                     b.result === !1 && b.preventDefault());
//                 if (b.type = p,
//                 !e && !b.isDefaultPrevented() && (!k._default || k._default.apply(o.pop(), c) === !1) && n.acceptData(d) && g && d[p] && !n.isWindow(d)) {
//                     l = d[g],
//                     l && (d[g] = null ),
//                     n.event.triggered = p;
//                     try {
//                         d[p]()
//                     } catch (r) {}
//                     n.event.triggered = void 0,
//                     l && (d[g] = l)
//                 }
//                 return b.result
//             }
//         },
//         dispatch: function(a) {
//             a = n.event.fix(a);
//             var b, c, e, f, g, h = [], i = d.call(arguments), j = (n._data(this, "events") || {})[a.type] || [], k = n.event.special[a.type] || {};
//             if (i[0] = a,
//             a.delegateTarget = this,
//             !k.preDispatch || k.preDispatch.call(this, a) !== !1) {
//                 h = n.event.handlers.call(this, a, j),
//                 b = 0;
//                 while ((f = h[b++]) && !a.isPropagationStopped()) {
//                     a.currentTarget = f.elem,
//                     g = 0;
//                     while ((e = f.handlers[g++]) && !a.isImmediatePropagationStopped())
//                         (!a.namespace_re || a.namespace_re.test(e.namespace)) && (a.handleObj = e,
//                         a.data = e.data,
//                         c = ((n.event.special[e.origType] || {}).handle || e.handler).apply(f.elem, i),
//                         void 0 !== c && (a.result = c) === !1 && (a.preventDefault(),
//                         a.stopPropagation()))
//                 }
//                 return k.postDispatch && k.postDispatch.call(this, a),
//                 a.result
//             }
//         },
//         handlers: function(a, b) {
//             var c, d, e, f, g = [], h = b.delegateCount, i = a.target;
//             if (h && i.nodeType && (!a.button || "click" !== a.type))
//                 for (; i != this; i = i.parentNode || this)
//                     if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
//                         for (e = [],
//                         f = 0; h > f; f++)
//                             d = b[f],
//                             c = d.selector + " ",
//                             void 0 === e[c] && (e[c] = d.needsContext ? n(c, this).index(i) >= 0 : n.find(c, this, null , [i]).length),
//                             e[c] && e.push(d);
//                         e.length && g.push({
//                             elem: i,
//                             handlers: e
//                         })
//                     }
//             return h < b.length && g.push({
//                 elem: this,
//                 handlers: b.slice(h)
//             }),
//             g
//         },
//         fix: function(a) {
//             if (a[n.expando])
//                 return a;
//             var b, c, d, e = a.type, f = a, g = this.fixHooks[e];
//             g || (this.fixHooks[e] = g = $.test(e) ? this.mouseHooks : Z.test(e) ? this.keyHooks : {}),
//             d = g.props ? this.props.concat(g.props) : this.props,
//             a = new n.Event(f),
//             b = d.length;
//             while (b--)
//                 c = d[b],
//                 a[c] = f[c];
//             return a.target || (a.target = f.srcElement || z),
//             3 === a.target.nodeType && (a.target = a.target.parentNode),
//             a.metaKey = !!a.metaKey,
//             g.filter ? g.filter(a, f) : a
//         },
//         props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
//         fixHooks: {},
//         keyHooks: {
//             props: "char charCode key keyCode".split(" "),
//             filter: function(a, b) {
//                 return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode),
//                 a
//             }
//         },
//         mouseHooks: {
//             props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
//             filter: function(a, b) {
//                 var c, d, e, f = b.button, g = b.fromElement;
//                 return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || z,
//                 e = d.documentElement,
//                 c = d.body,
//                 a.pageX = b.clientX + (e && e.scrollLeft || c && c.scrollLeft || 0) - (e && e.clientLeft || c && c.clientLeft || 0),
//                 a.pageY = b.clientY + (e && e.scrollTop || c && c.scrollTop || 0) - (e && e.clientTop || c && c.clientTop || 0)),
//                 !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g),
//                 a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0),
//                 a
//             }
//         },
//         special: {
//             load: {
//                 noBubble: !0
//             },
//             focus: {
//                 trigger: function() {
//                     if (this !== db() && this.focus)
//                         try {
//                             return this.focus(),
//                             !1
//                         } catch (a) {}
//                 },
//                 delegateType: "focusin"
//             },
//             blur: {
//                 trigger: function() {
//                     return this === db() && this.blur ? (this.blur(),
//                     !1) : void 0
//                 },
//                 delegateType: "focusout"
//             },
//             click: {
//                 trigger: function() {
//                     return n.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(),
//                     !1) : void 0
//                 },
//                 _default: function(a) {
//                     return n.nodeName(a.target, "a")
//                 }
//             },
//             beforeunload: {
//                 postDispatch: function(a) {
//                     void 0 !== a.result && (a.originalEvent.returnValue = a.result)
//                 }
//             }
//         },
//         simulate: function(a, b, c, d) {
//             var e = n.extend(new n.Event, c, {
//                 type: a,
//                 isSimulated: !0,
//                 originalEvent: {}
//             });
//             d ? n.event.trigger(e, null , b) : n.event.dispatch.call(b, e),
//             e.isDefaultPrevented() && c.preventDefault()
//         }
//     },
//     n.removeEvent = z.removeEventListener ? function(a, b, c) {
//         a.removeEventListener && a.removeEventListener(b, c, !1)
//     }
//     : function(a, b, c) {
//         var d = "on" + b;
//         a.detachEvent && (typeof a[d] === L && (a[d] = null ),
//         a.detachEvent(d, c))
//     }
//     ,
//     n.Event = function(a, b) {
//         return this instanceof n.Event ? (a && a.type ? (this.originalEvent = a,
//         this.type = a.type,
//         this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && (a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault()) ? bb : cb) : this.type = a,
//         b && n.extend(this, b),
//         this.timeStamp = a && a.timeStamp || n.now(),
//         void (this[n.expando] = !0)) : new n.Event(a,b)
//     }
//     ,
//     n.Event.prototype = {
//         isDefaultPrevented: cb,
//         isPropagationStopped: cb,
//         isImmediatePropagationStopped: cb,
//         preventDefault: function() {
//             var a = this.originalEvent;
//             this.isDefaultPrevented = bb,
//             a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
//         },
//         stopPropagation: function() {
//             var a = this.originalEvent;
//             this.isPropagationStopped = bb,
//             a && (a.stopPropagation && a.stopPropagation(),
//             a.cancelBubble = !0)
//         },
//         stopImmediatePropagation: function() {
//             this.isImmediatePropagationStopped = bb,
//             this.stopPropagation()
//         }
//     },
//     n.each({
//         mouseenter: "mouseover",
//         mouseleave: "mouseout"
//     }, function(a, b) {
//         n.event.special[a] = {
//             delegateType: b,
//             bindType: b,
//             handle: function(a) {
//                 var c, d = this, e = a.relatedTarget, f = a.handleObj;
//                 return (!e || e !== d && !n.contains(d, e)) && (a.type = f.origType,
//                 c = f.handler.apply(this, arguments),
//                 a.type = b),
//                 c
//             }
//         }
//     }),
//     l.submitBubbles || (n.event.special.submit = {
//         setup: function() {
//             return n.nodeName(this, "form") ? !1 : void n.event.add(this, "click._submit keypress._submit", function(a) {
//                 var b = a.target
//                   , c = n.nodeName(b, "input") || n.nodeName(b, "button") ? b.form : void 0;
//                 c && !n._data(c, "submitBubbles") && (n.event.add(c, "submit._submit", function(a) {
//                     a._submit_bubble = !0
//                 }),
//                 n._data(c, "submitBubbles", !0))
//             })
//         },
//         postDispatch: function(a) {
//             a._submit_bubble && (delete a._submit_bubble,
//             this.parentNode && !a.isTrigger && n.event.simulate("submit", this.parentNode, a, !0))
//         },
//         teardown: function() {
//             return n.nodeName(this, "form") ? !1 : void n.event.remove(this, "._submit")
//         }
//     }),
//     l.changeBubbles || (n.event.special.change = {
//         setup: function() {
//             return Y.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (n.event.add(this, "propertychange._change", function(a) {
//                 "checked" === a.originalEvent.propertyName && (this._just_changed = !0)
//             }),
//             n.event.add(this, "click._change", function(a) {
//                 this._just_changed && !a.isTrigger && (this._just_changed = !1),
//                 n.event.simulate("change", this, a, !0)
//             })),
//             !1) : void n.event.add(this, "beforeactivate._change", function(a) {
//                 var b = a.target;
//                 Y.test(b.nodeName) && !n._data(b, "changeBubbles") && (n.event.add(b, "change._change", function(a) {
//                     !this.parentNode || a.isSimulated || a.isTrigger || n.event.simulate("change", this.parentNode, a, !0)
//                 }),
//                 n._data(b, "changeBubbles", !0))
//             })
//         },
//         handle: function(a) {
//             var b = a.target;
//             return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0
//         },
//         teardown: function() {
//             return n.event.remove(this, "._change"),
//             !Y.test(this.nodeName)
//         }
//     }),
//     l.focusinBubbles || n.each({
//         focus: "focusin",
//         blur: "focusout"
//     }, function(a, b) {
//         var c = function(a) {
//             n.event.simulate(b, a.target, n.event.fix(a), !0)
//         }
//         ;
//         n.event.special[b] = {
//             setup: function() {
//                 var d = this.ownerDocument || this
//                   , e = n._data(d, b);
//                 e || d.addEventListener(a, c, !0),
//                 n._data(d, b, (e || 0) + 1)
//             },
//             teardown: function() {
//                 var d = this.ownerDocument || this
//                   , e = n._data(d, b) - 1;
//                 e ? n._data(d, b, e) : (d.removeEventListener(a, c, !0),
//                 n._removeData(d, b))
//             }
//         }
//     }),
//     n.fn.extend({
//         on: function(a, b, c, d, e) {
//             var f, g;
//             if ("object" == typeof a) {
//                 "string" != typeof b && (c = c || b,
//                 b = void 0);
//                 for (f in a)
//                     this.on(f, b, c, a[f], e);
//                 return this
//             }
//             if (null == c && null == d ? (d = b,
//             c = b = void 0) : null == d && ("string" == typeof b ? (d = c,
//             c = void 0) : (d = c,
//             c = b,
//             b = void 0)),
//             d === !1)
//                 d = cb;
//             else if (!d)
//                 return this;
//             return 1 === e && (g = d,
//             d = function(a) {
//                 return n().off(a),
//                 g.apply(this, arguments)
//             }
//             ,
//             d.guid = g.guid || (g.guid = n.guid++)),
//             this.each(function() {
//                 n.event.add(this, a, d, c, b)
//             })
//         },
//         one: function(a, b, c, d) {
//             return this.on(a, b, c, d, 1)
//         },
//         off: function(a, b, c) {
//             var d, e;
//             if (a && a.preventDefault && a.handleObj)
//                 return d = a.handleObj,
//                 n(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler),
//                 this;
//             if ("object" == typeof a) {
//                 for (e in a)
//                     this.off(e, b, a[e]);
//                 return this
//             }
//             return (b === !1 || "function" == typeof b) && (c = b,
//             b = void 0),
//             c === !1 && (c = cb),
//             this.each(function() {
//                 n.event.remove(this, a, c, b)
//             })
//         },
//         trigger: function(a, b) {
//             return this.each(function() {
//                 n.event.trigger(a, b, this)
//             })
//         },
//         triggerHandler: function(a, b) {
//             var c = this[0];
//             return c ? n.event.trigger(a, b, c, !0) : void 0
//         }
//     });
//     function eb(a) {
//         var b = fb.split("|")
//           , c = a.createDocumentFragment();
//         if (c.createElement)
//             while (b.length)
//                 c.createElement(b.pop());
//         return c
//     }
//     var fb = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video"
//       , gb = / jQuery\d+="(?:null|\d+)"/g
//       , hb = new RegExp("<(?:" + fb + ")[\\s/>]","i")
//       , ib = /^\s+/
//       , jb = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi
//       , kb = /<([\w:]+)/
//       , lb = /<tbody/i
//       , mb = /<|&#?\w+;/
//       , nb = /<(?:script|style|link)/i
//       , ob = /checked\s*(?:[^=]|=\s*.checked.)/i
//       , pb = /^$|\/(?:java|ecma)script/i
//       , qb = /^true\/(.*)/
//       , rb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g
//       , sb = {
//         option: [1, "<select multiple='multiple'>", "</select>"],
//         legend: [1, "<fieldset>", "</fieldset>"],
//         area: [1, "<map>", "</map>"],
//         param: [1, "<object>", "</object>"],
//         thead: [1, "<table>", "</table>"],
//         tr: [2, "<table><tbody>", "</tbody></table>"],
//         col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
//         td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
//         _default: l.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
//     }
//       , tb = eb(z)
//       , ub = tb.appendChild(z.createElement("div"));
//     sb.optgroup = sb.option,
//     sb.tbody = sb.tfoot = sb.colgroup = sb.caption = sb.thead,
//     sb.th = sb.td;
//     function vb(a, b) {
//         var c, d, e = 0, f = typeof a.getElementsByTagName !== L ? a.getElementsByTagName(b || "*") : typeof a.querySelectorAll !== L ? a.querySelectorAll(b || "*") : void 0;
//         if (!f)
//             for (f = [],
//             c = a.childNodes || a; null != (d = c[e]); e++)
//                 !b || n.nodeName(d, b) ? f.push(d) : n.merge(f, vb(d, b));
//         return void 0 === b || b && n.nodeName(a, b) ? n.merge([a], f) : f
//     }
//     function wb(a) {
//         X.test(a.type) && (a.defaultChecked = a.checked)
//     }
//     function xb(a, b) {
//         return n.nodeName(a, "table") && n.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
//     }
//     function yb(a) {
//         return a.type = (null !== n.find.attr(a, "type")) + "/" + a.type,
//         a
//     }
//     function zb(a) {
//         var b = qb.exec(a.type);
//         return b ? a.type = b[1] : a.removeAttribute("type"),
//         a
//     }
//     function Ab(a, b) {
//         for (var c, d = 0; null != (c = a[d]); d++)
//             n._data(c, "globalEval", !b || n._data(b[d], "globalEval"))
//     }
//     function Bb(a, b) {
//         if (1 === b.nodeType && n.hasData(a)) {
//             var c, d, e, f = n._data(a), g = n._data(b, f), h = f.events;
//             if (h) {
//                 delete g.handle,
//                 g.events = {};
//                 for (c in h)
//                     for (d = 0,
//                     e = h[c].length; e > d; d++)
//                         n.event.add(b, c, h[c][d])
//             }
//             g.data && (g.data = n.extend({}, g.data))
//         }
//     }
//     function Cb(a, b) {
//         var c, d, e;
//         if (1 === b.nodeType) {
//             if (c = b.nodeName.toLowerCase(),
//             !l.noCloneEvent && b[n.expando]) {
//                 e = n._data(b);
//                 for (d in e.events)
//                     n.removeEvent(b, d, e.handle);
//                 b.removeAttribute(n.expando)
//             }
//             "script" === c && b.text !== a.text ? (yb(b).text = a.text,
//             zb(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML),
//             l.html5Clone && a.innerHTML && !n.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && X.test(a.type) ? (b.defaultChecked = b.checked = a.checked,
//             b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
//         }
//     }
//     n.extend({
//         clone: function(a, b, c) {
//             var d, e, f, g, h, i = n.contains(a.ownerDocument, a);
//             if (l.html5Clone || n.isXMLDoc(a) || !hb.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (ub.innerHTML = a.outerHTML,
//             ub.removeChild(f = ub.firstChild)),
//             !(l.noCloneEvent && l.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || n.isXMLDoc(a)))
//                 for (d = vb(f),
//                 h = vb(a),
//                 g = 0; null != (e = h[g]); ++g)
//                     d[g] && Cb(e, d[g]);
//             if (b)
//                 if (c)
//                     for (h = h || vb(a),
//                     d = d || vb(f),
//                     g = 0; null != (e = h[g]); g++)
//                         Bb(e, d[g]);
//                 else
//                     Bb(a, f);
//             return d = vb(f, "script"),
//             d.length > 0 && Ab(d, !i && vb(a, "script")),
//             d = h = e = null ,
//             f
//         },
//         buildFragment: function(a, b, c, d) {
//             for (var e, f, g, h, i, j, k, m = a.length, o = eb(b), p = [], q = 0; m > q; q++)
//                 if (f = a[q],
//                 f || 0 === f)
//                     if ("object" === n.type(f))
//                         n.merge(p, f.nodeType ? [f] : f);
//                     else if (mb.test(f)) {
//                         h = h || o.appendChild(b.createElement("div")),
//                         i = (kb.exec(f) || ["", ""])[1].toLowerCase(),
//                         k = sb[i] || sb._default,
//                         h.innerHTML = k[1] + f.replace(jb, "<$1></$2>") + k[2],
//                         e = k[0];
//                         while (e--)
//                             h = h.lastChild;
//                         if (!l.leadingWhitespace && ib.test(f) && p.push(b.createTextNode(ib.exec(f)[0])),
//                         !l.tbody) {
//                             f = "table" !== i || lb.test(f) ? "<table>" !== k[1] || lb.test(f) ? 0 : h : h.firstChild,
//                             e = f && f.childNodes.length;
//                             while (e--)
//                                 n.nodeName(j = f.childNodes[e], "tbody") && !j.childNodes.length && f.removeChild(j)
//                         }
//                         n.merge(p, h.childNodes),
//                         h.textContent = "";
//                         while (h.firstChild)
//                             h.removeChild(h.firstChild);
//                         h = o.lastChild
//                     } else
//                         p.push(b.createTextNode(f));
//             h && o.removeChild(h),
//             l.appendChecked || n.grep(vb(p, "input"), wb),
//             q = 0;
//             while (f = p[q++])
//                 if ((!d || -1 === n.inArray(f, d)) && (g = n.contains(f.ownerDocument, f),
//                 h = vb(o.appendChild(f), "script"),
//                 g && Ab(h),
//                 c)) {
//                     e = 0;
//                     while (f = h[e++])
//                         pb.test(f.type || "") && c.push(f)
//                 }
//             return h = null ,
//             o
//         },
//         cleanData: function(a, b) {
//             for (var d, e, f, g, h = 0, i = n.expando, j = n.cache, k = l.deleteExpando, m = n.event.special; null != (d = a[h]); h++)
//                 if ((b || n.acceptData(d)) && (f = d[i],
//                 g = f && j[f])) {
//                     if (g.events)
//                         for (e in g.events)
//                             m[e] ? n.event.remove(d, e) : n.removeEvent(d, e, g.handle);
//                     j[f] && (delete j[f],
//                     k ? delete d[i] : typeof d.removeAttribute !== L ? d.removeAttribute(i) : d[i] = null ,
//                     c.push(f))
//                 }
//         }
//     }),
//     n.fn.extend({
//         text: function(a) {
//             return W(this, function(a) {
//                 return void 0 === a ? n.text(this) : this.empty().append((this[0] && this[0].ownerDocument || z).createTextNode(a))
//             }, null , a, arguments.length)
//         },
//         append: function() {
//             return this.domManip(arguments, function(a) {
//                 if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
//                     var b = xb(this, a);
//                     b.appendChild(a)
//                 }
//             })
//         },
//         prepend: function() {
//             return this.domManip(arguments, function(a) {
//                 if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
//                     var b = xb(this, a);
//                     b.insertBefore(a, b.firstChild)
//                 }
//             })
//         },
//         before: function() {
//             return this.domManip(arguments, function(a) {
//                 this.parentNode && this.parentNode.insertBefore(a, this)
//             })
//         },
//         after: function() {
//             return this.domManip(arguments, function(a) {
//                 this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
//             })
//         },
//         remove: function(a, b) {
//             for (var c, d = a ? n.filter(a, this) : this, e = 0; null != (c = d[e]); e++)
//                 b || 1 !== c.nodeType || n.cleanData(vb(c)),
//                 c.parentNode && (b && n.contains(c.ownerDocument, c) && Ab(vb(c, "script")),
//                 c.parentNode.removeChild(c));
//             return this
//         },
//         empty: function() {
//             for (var a, b = 0; null != (a = this[b]); b++) {
//                 1 === a.nodeType && n.cleanData(vb(a, !1));
//                 while (a.firstChild)
//                     a.removeChild(a.firstChild);
//                 a.options && n.nodeName(a, "select") && (a.options.length = 0)
//             }
//             return this
//         },
//         clone: function(a, b) {
//             return a = null == a ? !1 : a,
//             b = null == b ? a : b,
//             this.map(function() {
//                 return n.clone(this, a, b)
//             })
//         },
//         html: function(a) {
//             return W(this, function(a) {
//                 var b = this[0] || {}
//                   , c = 0
//                   , d = this.length;
//                 if (void 0 === a)
//                     return 1 === b.nodeType ? b.innerHTML.replace(gb, "") : void 0;
//                 if (!("string" != typeof a || nb.test(a) || !l.htmlSerialize && hb.test(a) || !l.leadingWhitespace && ib.test(a) || sb[(kb.exec(a) || ["", ""])[1].toLowerCase()])) {
//                     a = a.replace(jb, "<$1></$2>");
//                     try {
//                         for (; d > c; c++)
//                             b = this[c] || {},
//                             1 === b.nodeType && (n.cleanData(vb(b, !1)),
//                             b.innerHTML = a);
//                         b = 0
//                     } catch (e) {}
//                 }
//                 b && this.empty().append(a)
//             }, null , a, arguments.length)
//         },
//         replaceWith: function() {
//             var a = arguments[0];
//             return this.domManip(arguments, function(b) {
//                 a = this.parentNode,
//                 n.cleanData(vb(this)),
//                 a && a.replaceChild(b, this)
//             }),
//             a && (a.length || a.nodeType) ? this : this.remove()
//         },
//         detach: function(a) {
//             return this.remove(a, !0)
//         },
//         domManip: function(a, b) {
//             a = e.apply([], a);
//             var c, d, f, g, h, i, j = 0, k = this.length, m = this, o = k - 1, p = a[0], q = n.isFunction(p);
//             if (q || k > 1 && "string" == typeof p && !l.checkClone && ob.test(p))
//                 return this.each(function(c) {
//                     var d = m.eq(c);
//                     q && (a[0] = p.call(this, c, d.html())),
//                     d.domManip(a, b)
//                 });
//             if (k && (i = n.buildFragment(a, this[0].ownerDocument, !1, this),
//             c = i.firstChild,
//             1 === i.childNodes.length && (i = c),
//             c)) {
//                 for (g = n.map(vb(i, "script"), yb),
//                 f = g.length; k > j; j++)
//                     d = i,
//                     j !== o && (d = n.clone(d, !0, !0),
//                     f && n.merge(g, vb(d, "script"))),
//                     b.call(this[j], d, j);
//                 if (f)
//                     for (h = g[g.length - 1].ownerDocument,
//                     n.map(g, zb),
//                     j = 0; f > j; j++)
//                         d = g[j],
//                         pb.test(d.type || "") && !n._data(d, "globalEval") && n.contains(h, d) && (d.src ? n._evalUrl && n._evalUrl(d.src) : n.globalEval((d.text || d.textContent || d.innerHTML || "").replace(rb, "")));
//                 i = c = null
//             }
//             return this
//         }
//     }),
//     n.each({
//         appendTo: "append",
//         prependTo: "prepend",
//         insertBefore: "before",
//         insertAfter: "after",
//         replaceAll: "replaceWith"
//     }, function(a, b) {
//         n.fn[a] = function(a) {
//             for (var c, d = 0, e = [], g = n(a), h = g.length - 1; h >= d; d++)
//                 c = d === h ? this : this.clone(!0),
//                 n(g[d])[b](c),
//                 f.apply(e, c.get());
//             return this.pushStack(e)
//         }
//     });
//     var Db, Eb = {};
//     function Fb(b, c) {
//         var d = n(c.createElement(b)).appendTo(c.body)
//           , e = a.getDefaultComputedStyle ? a.getDefaultComputedStyle(d[0]).display : n.css(d[0], "display");
//         return d.detach(),
//         e
//     }
//     function Gb(a) {
//         var b = z
//           , c = Eb[a];
//         return c || (c = Fb(a, b),
//         "none" !== c && c || (Db = (Db || n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),
//         b = (Db[0].contentWindow || Db[0].contentDocument).document,
//         b.write(),
//         b.close(),
//         c = Fb(a, b),
//         Db.detach()),
//         Eb[a] = c),
//         c
//     }
//     !function() {
//         var a, b, c = z.createElement("div"), d = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";
//         c.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
//         a = c.getElementsByTagName("a")[0],
//         a.style.cssText = "float:left;opacity:.5",
//         l.opacity = /^0.5/.test(a.style.opacity),
//         l.cssFloat = !!a.style.cssFloat,
//         c.style.backgroundClip = "content-box",
//         c.cloneNode(!0).style.backgroundClip = "",
//         l.clearCloneStyle = "content-box" === c.style.backgroundClip,
//         a = c = null ,
//         l.shrinkWrapBlocks = function() {
//             var a, c, e, f;
//             if (null == b) {
//                 if (a = z.getElementsByTagName("body")[0],
//                 !a)
//                     return;
//                 f = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px",
//                 c = z.createElement("div"),
//                 e = z.createElement("div"),
//                 a.appendChild(c).appendChild(e),
//                 b = !1,
//                 typeof e.style.zoom !== L && (e.style.cssText = d + ";width:1px;padding:1px;zoom:1",
//                 e.innerHTML = "<div></div>",
//                 e.firstChild.style.width = "5px",
//                 b = 3 !== e.offsetWidth),
//                 a.removeChild(c),
//                 a = c = e = null
//             }
//             return b
//         }
//     }();
//     var Hb = /^margin/, Ib = new RegExp("^(" + T + ")(?!px)[a-z%]+$","i"), Jb, Kb, Lb = /^(top|right|bottom|left)$/;
//     a.getComputedStyle ? (Jb = function(a) {
//         return a.ownerDocument.defaultView.getComputedStyle(a, null )
//     }
//     ,
//     Kb = function(a, b, c) {
//         var d, e, f, g, h = a.style;
//         return c = c || Jb(a),
//         g = c ? c.getPropertyValue(b) || c[b] : void 0,
//         c && ("" !== g || n.contains(a.ownerDocument, a) || (g = n.style(a, b)),
//         Ib.test(g) && Hb.test(b) && (d = h.width,
//         e = h.minWidth,
//         f = h.maxWidth,
//         h.minWidth = h.maxWidth = h.width = g,
//         g = c.width,
//         h.width = d,
//         h.minWidth = e,
//         h.maxWidth = f)),
//         void 0 === g ? g : g + ""
//     }
//     ) : z.documentElement.currentStyle && (Jb = function(a) {
//         return a.currentStyle
//     }
//     ,
//     Kb = function(a, b, c) {
//         var d, e, f, g, h = a.style;
//         return c = c || Jb(a),
//         g = c ? c[b] : void 0,
//         null == g && h && h[b] && (g = h[b]),
//         Ib.test(g) && !Lb.test(b) && (d = h.left,
//         e = a.runtimeStyle,
//         f = e && e.left,
//         f && (e.left = a.currentStyle.left),
//         h.left = "fontSize" === b ? "1em" : g,
//         g = h.pixelLeft + "px",
//         h.left = d,
//         f && (e.left = f)),
//         void 0 === g ? g : g + "" || "auto"
//     }
//     );
//     function Mb(a, b) {
//         return {
//             get: function() {
//                 var c = a();
//                 if (null != c)
//                     return c ? void delete this.get : (this.get = b).apply(this, arguments)
//             }
//         }
//     }
//     !function() {
//         var b, c, d, e, f, g, h = z.createElement("div"), i = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px", j = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";
//         h.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
//         b = h.getElementsByTagName("a")[0],
//         b.style.cssText = "float:left;opacity:.5",
//         l.opacity = /^0.5/.test(b.style.opacity),
//         l.cssFloat = !!b.style.cssFloat,
//         h.style.backgroundClip = "content-box",
//         h.cloneNode(!0).style.backgroundClip = "",
//         l.clearCloneStyle = "content-box" === h.style.backgroundClip,
//         b = h = null ,
//         n.extend(l, {
//             reliableHiddenOffsets: function() {
//                 if (null != c)
//                     return c;
//                 var a, b, d, e = z.createElement("div"), f = z.getElementsByTagName("body")[0];
//                 if (f)
//                     return e.setAttribute("className", "t"),
//                     e.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
//                     a = z.createElement("div"),
//                     a.style.cssText = i,
//                     f.appendChild(a).appendChild(e),
//                     e.innerHTML = "<table><tr><td></td><td>t</td></tr></table>",
//                     b = e.getElementsByTagName("td"),
//                     b[0].style.cssText = "padding:0;margin:0;border:0;display:none",
//                     d = 0 === b[0].offsetHeight,
//                     b[0].style.display = "",
//                     b[1].style.display = "none",
//                     c = d && 0 === b[0].offsetHeight,
//                     f.removeChild(a),
//                     e = f = null ,
//                     c
//             },
//             boxSizing: function() {
//                 return null == d && k(),
//                 d
//             },
//             boxSizingReliable: function() {
//                 return null == e && k(),
//                 e
//             },
//             pixelPosition: function() {
//                 return null == f && k(),
//                 f
//             },
//             reliableMarginRight: function() {
//                 var b, c, d, e;
//                 if (null == g && a.getComputedStyle) {
//                     if (b = z.getElementsByTagName("body")[0],
//                     !b)
//                         return;
//                     c = z.createElement("div"),
//                     d = z.createElement("div"),
//                     c.style.cssText = i,
//                     b.appendChild(c).appendChild(d),
//                     e = d.appendChild(z.createElement("div")),
//                     e.style.cssText = d.style.cssText = j,
//                     e.style.marginRight = e.style.width = "0",
//                     d.style.width = "1px",
//                     g = !parseFloat((a.getComputedStyle(e, null ) || {}).marginRight),
//                     b.removeChild(c)
//                 }
//                 return g
//             }
//         });
//         function k() {
//             var b, c, h = z.getElementsByTagName("body")[0];
//             h && (b = z.createElement("div"),
//             c = z.createElement("div"),
//             b.style.cssText = i,
//             h.appendChild(b).appendChild(c),
//             c.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;display:block;padding:1px;border:1px;width:4px;margin-top:1%;top:1%",
//             n.swap(h, null != h.style.zoom ? {
//                 zoom: 1
//             } : {}, function() {
//                 d = 4 === c.offsetWidth
//             }),
//             e = !0,
//             f = !1,
//             g = !0,
//             a.getComputedStyle && (f = "1%" !== (a.getComputedStyle(c, null ) || {}).top,
//             e = "4px" === (a.getComputedStyle(c, null ) || {
//                 width: "4px"
//             }).width),
//             h.removeChild(b),
//             c = h = null )
//         }
//     }(),
//     n.swap = function(a, b, c, d) {
//         var e, f, g = {};
//         for (f in b)
//             g[f] = a.style[f],
//             a.style[f] = b[f];
//         e = c.apply(a, d || []);
//         for (f in b)
//             a.style[f] = g[f];
//         return e
//     }
//     ;
//     var Nb = /alpha\([^)]*\)/i
//       , Ob = /opacity\s*=\s*([^)]*)/
//       , Pb = /^(none|table(?!-c[ea]).+)/
//       , Qb = new RegExp("^(" + T + ")(.*)$","i")
//       , Rb = new RegExp("^([+-])=(" + T + ")","i")
//       , Sb = {
//         position: "absolute",
//         visibility: "hidden",
//         display: "block"
//     }
//       , Tb = {
//         letterSpacing: 0,
//         fontWeight: 400
//     }
//       , Ub = ["Webkit", "O", "Moz", "ms"];
//     function Vb(a, b) {
//         if (b in a)
//             return b;
//         var c = b.charAt(0).toUpperCase() + b.slice(1)
//           , d = b
//           , e = Ub.length;
//         while (e--)
//             if (b = Ub[e] + c,
//             b in a)
//                 return b;
//         return d
//     }
//     function Wb(a, b) {
//         for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++)
//             d = a[g],
//             d.style && (f[g] = n._data(d, "olddisplay"),
//             c = d.style.display,
//             b ? (f[g] || "none" !== c || (d.style.display = ""),
//             "" === d.style.display && V(d) && (f[g] = n._data(d, "olddisplay", Gb(d.nodeName)))) : f[g] || (e = V(d),
//             (c && "none" !== c || !e) && n._data(d, "olddisplay", e ? c : n.css(d, "display"))));
//         for (g = 0; h > g; g++)
//             d = a[g],
//             d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
//         return a
//     }
//     function Xb(a, b, c) {
//         var d = Qb.exec(b);
//         return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
//     }
//     function Yb(a, b, c, d, e) {
//         for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2)
//             "margin" === c && (g += n.css(a, c + U[f], !0, e)),
//             d ? ("content" === c && (g -= n.css(a, "padding" + U[f], !0, e)),
//             "margin" !== c && (g -= n.css(a, "border" + U[f] + "Width", !0, e))) : (g += n.css(a, "padding" + U[f], !0, e),
//             "padding" !== c && (g += n.css(a, "border" + U[f] + "Width", !0, e)));
//         return g
//     }
//     function Zb(a, b, c) {
//         var d = !0
//           , e = "width" === b ? a.offsetWidth : a.offsetHeight
//           , f = Jb(a)
//           , g = l.boxSizing() && "border-box" === n.css(a, "boxSizing", !1, f);
//         if (0 >= e || null == e) {
//             if (e = Kb(a, b, f),
//             (0 > e || null == e) && (e = a.style[b]),
//             Ib.test(e))
//                 return e;
//             d = g && (l.boxSizingReliable() || e === a.style[b]),
//             e = parseFloat(e) || 0
//         }
//         return e + Yb(a, b, c || (g ? "border" : "content"), d, f) + "px"
//     }
//     n.extend({
//         cssHooks: {
//             opacity: {
//                 get: function(a, b) {
//                     if (b) {
//                         var c = Kb(a, "opacity");
//                         return "" === c ? "1" : c
//                     }
//                 }
//             }
//         },
//         cssNumber: {
//             columnCount: !0,
//             fillOpacity: !0,
//             fontWeight: !0,
//             lineHeight: !0,
//             opacity: !0,
//             order: !0,
//             orphans: !0,
//             widows: !0,
//             zIndex: !0,
//             zoom: !0
//         },
//         cssProps: {
//             "float": l.cssFloat ? "cssFloat" : "styleFloat"
//         },
//         style: function(a, b, c, d) {
//             if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
//                 var e, f, g, h = n.camelCase(b), i = a.style;
//                 if (b = n.cssProps[h] || (n.cssProps[h] = Vb(i, h)),
//                 g = n.cssHooks[b] || n.cssHooks[h],
//                 void 0 === c)
//                     return g && "get"in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
//                 if (f = typeof c,
//                 "string" === f && (e = Rb.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(n.css(a, b)),
//                 f = "number"),
//                 null != c && c === c && ("number" !== f || n.cssNumber[h] || (c += "px"),
//                 l.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"),
//                 !(g && "set"in g && void 0 === (c = g.set(a, c, d)))))
//                     try {
//                         i[b] = "",
//                         i[b] = c
//                     } catch (j) {}
//             }
//         },
//         css: function(a, b, c, d) {
//             var e, f, g, h = n.camelCase(b);
//             return b = n.cssProps[h] || (n.cssProps[h] = Vb(a.style, h)),
//             g = n.cssHooks[b] || n.cssHooks[h],
//             g && "get"in g && (f = g.get(a, !0, c)),
//             void 0 === f && (f = Kb(a, b, d)),
//             "normal" === f && b in Tb && (f = Tb[b]),
//             "" === c || c ? (e = parseFloat(f),
//             c === !0 || n.isNumeric(e) ? e || 0 : f) : f
//         }
//     }),
//     n.each(["height", "width"], function(a, b) {
//         n.cssHooks[b] = {
//             get: function(a, c, d) {
//                 return c ? 0 === a.offsetWidth && Pb.test(n.css(a, "display")) ? n.swap(a, Sb, function() {
//                     return Zb(a, b, d)
//                 }) : Zb(a, b, d) : void 0
//             },
//             set: function(a, c, d) {
//                 var e = d && Jb(a);
//                 return Xb(a, c, d ? Yb(a, b, d, l.boxSizing() && "border-box" === n.css(a, "boxSizing", !1, e), e) : 0)
//             }
//         }
//     }),
//     l.opacity || (n.cssHooks.opacity = {
//         get: function(a, b) {
//             return Ob.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
//         },
//         set: function(a, b) {
//             var c = a.style
//               , d = a.currentStyle
//               , e = n.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : ""
//               , f = d && d.filter || c.filter || "";
//             c.zoom = 1,
//             (b >= 1 || "" === b) && "" === n.trim(f.replace(Nb, "")) && c.removeAttribute && (c.removeAttribute("filter"),
//             "" === b || d && !d.filter) || (c.filter = Nb.test(f) ? f.replace(Nb, e) : f + " " + e)
//         }
//     }),
//     n.cssHooks.marginRight = Mb(l.reliableMarginRight, function(a, b) {
//         return b ? n.swap(a, {
//             display: "inline-block"
//         }, Kb, [a, "marginRight"]) : void 0
//     }),
//     n.each({
//         margin: "",
//         padding: "",
//         border: "Width"
//     }, function(a, b) {
//         n.cssHooks[a + b] = {
//             expand: function(c) {
//                 for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++)
//                     e[a + U[d] + b] = f[d] || f[d - 2] || f[0];
//                 return e
//             }
//         },
//         Hb.test(a) || (n.cssHooks[a + b].set = Xb)
//     }),
//     n.fn.extend({
//         css: function(a, b) {
//             return W(this, function(a, b, c) {
//                 var d, e, f = {}, g = 0;
//                 if (n.isArray(b)) {
//                     for (d = Jb(a),
//                     e = b.length; e > g; g++)
//                         f[b[g]] = n.css(a, b[g], !1, d);
//                     return f
//                 }
//                 return void 0 !== c ? n.style(a, b, c) : n.css(a, b)
//             }, a, b, arguments.length > 1)
//         },
//         show: function() {
//             return Wb(this, !0)
//         },
//         hide: function() {
//             return Wb(this)
//         },
//         toggle: function(a) {
//             return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
//                 V(this) ? n(this).show() : n(this).hide()
//             })
//         }
//     });
//     function $b(a, b, c, d, e) {
//         return new $b.prototype.init(a,b,c,d,e)
//     }
//     n.Tween = $b,
//     $b.prototype = {
//         constructor: $b,
//         init: function(a, b, c, d, e, f) {
//             this.elem = a,
//             this.prop = c,
//             this.easing = e || "swing",
//             this.options = b,
//             this.start = this.now = this.cur(),
//             this.end = d,
//             this.unit = f || (n.cssNumber[c] ? "" : "px")
//         },
//         cur: function() {
//             var a = $b.propHooks[this.prop];
//             return a && a.get ? a.get(this) : $b.propHooks._default.get(this)
//         },
//         run: function(a) {
//             var b, c = $b.propHooks[this.prop];
//             return this.pos = b = this.options.duration ? n.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a,
//             this.now = (this.end - this.start) * b + this.start,
//             this.options.step && this.options.step.call(this.elem, this.now, this),
//             c && c.set ? c.set(this) : $b.propHooks._default.set(this),
//             this
//         }
//     },
//     $b.prototype.init.prototype = $b.prototype,
//     $b.propHooks = {
//         _default: {
//             get: function(a) {
//                 var b;
//                 return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = n.css(a.elem, a.prop, ""),
//                 b && "auto" !== b ? b : 0) : a.elem[a.prop]
//             },
//             set: function(a) {
//                 n.fx.step[a.prop] ? n.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[n.cssProps[a.prop]] || n.cssHooks[a.prop]) ? n.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
//             }
//         }
//     },
//     $b.propHooks.scrollTop = $b.propHooks.scrollLeft = {
//         set: function(a) {
//             a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
//         }
//     },
//     n.easing = {
//         linear: function(a) {
//             return a
//         },
//         swing: function(a) {
//             return .5 - Math.cos(a * Math.PI) / 2
//         }
//     },
//     n.fx = $b.prototype.init,
//     n.fx.step = {};
//     var _b, ac, bc = /^(?:toggle|show|hide)$/, cc = new RegExp("^(?:([+-])=|)(" + T + ")([a-z%]*)$","i"), dc = /queueHooks$/, ec = [jc], fc = {
//         "*": [function(a, b) {
//             var c = this.createTween(a, b)
//               , d = c.cur()
//               , e = cc.exec(b)
//               , f = e && e[3] || (n.cssNumber[a] ? "" : "px")
//               , g = (n.cssNumber[a] || "px" !== f && +d) && cc.exec(n.css(c.elem, a))
//               , h = 1
//               , i = 20;
//             if (g && g[3] !== f) {
//                 f = f || g[3],
//                 e = e || [],
//                 g = +d || 1;
//                 do
//                     h = h || ".5",
//                     g /= h,
//                     n.style(c.elem, a, g + f);
//                 while (h !== (h = c.cur() / d) && 1 !== h && --i)
//             }
//             return e && (g = c.start = +g || +d || 0,
//             c.unit = f,
//             c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]),
//             c
//         }
//         ]
//     };
//     function gc() {
//         return setTimeout(function() {
//             _b = void 0
//         }),
//         _b = n.now()
//     }
//     function hc(a, b) {
//         var c, d = {
//             height: a
//         }, e = 0;
//         for (b = b ? 1 : 0; 4 > e; e += 2 - b)
//             c = U[e],
//             d["margin" + c] = d["padding" + c] = a;
//         return b && (d.opacity = d.width = a),
//         d
//     }
//     function ic(a, b, c) {
//         for (var d, e = (fc[b] || []).concat(fc["*"]), f = 0, g = e.length; g > f; f++)
//             if (d = e[f].call(c, b, a))
//                 return d
//     }
//     function jc(a, b, c) {
//         var d, e, f, g, h, i, j, k, m = this, o = {}, p = a.style, q = a.nodeType && V(a), r = n._data(a, "fxshow");
//         c.queue || (h = n._queueHooks(a, "fx"),
//         null == h.unqueued && (h.unqueued = 0,
//         i = h.empty.fire,
//         h.empty.fire = function() {
//             h.unqueued || i()
//         }
//         ),
//         h.unqueued++,
//         m.always(function() {
//             m.always(function() {
//                 h.unqueued--,
//                 n.queue(a, "fx").length || h.empty.fire()
//             })
//         })),
//         1 === a.nodeType && ("height"in b || "width"in b) && (c.overflow = [p.overflow, p.overflowX, p.overflowY],
//         j = n.css(a, "display"),
//         k = Gb(a.nodeName),
//         "none" === j && (j = k),
//         "inline" === j && "none" === n.css(a, "float") && (l.inlineBlockNeedsLayout && "inline" !== k ? p.zoom = 1 : p.display = "inline-block")),
//         c.overflow && (p.overflow = "hidden",
//         l.shrinkWrapBlocks() || m.always(function() {
//             p.overflow = c.overflow[0],
//             p.overflowX = c.overflow[1],
//             p.overflowY = c.overflow[2]
//         }));
//         for (d in b)
//             if (e = b[d],
//             bc.exec(e)) {
//                 if (delete b[d],
//                 f = f || "toggle" === e,
//                 e === (q ? "hide" : "show")) {
//                     if ("show" !== e || !r || void 0 === r[d])
//                         continue;q = !0
//                 }
//                 o[d] = r && r[d] || n.style(a, d)
//             }
//         if (!n.isEmptyObject(o)) {
//             r ? "hidden"in r && (q = r.hidden) : r = n._data(a, "fxshow", {}),
//             f && (r.hidden = !q),
//             q ? n(a).show() : m.done(function() {
//                 n(a).hide()
//             }),
//             m.done(function() {
//                 var b;
//                 n._removeData(a, "fxshow");
//                 for (b in o)
//                     n.style(a, b, o[b])
//             });
//             for (d in o)
//                 g = ic(q ? r[d] : 0, d, m),
//                 d in r || (r[d] = g.start,
//                 q && (g.end = g.start,
//                 g.start = "width" === d || "height" === d ? 1 : 0))
//         }
//     }
//     function kc(a, b) {
//         var c, d, e, f, g;
//         for (c in a)
//             if (d = n.camelCase(c),
//             e = b[d],
//             f = a[c],
//             n.isArray(f) && (e = f[1],
//             f = a[c] = f[0]),
//             c !== d && (a[d] = f,
//             delete a[c]),
//             g = n.cssHooks[d],
//             g && "expand"in g) {
//                 f = g.expand(f),
//                 delete a[d];
//                 for (c in f)
//                     c in a || (a[c] = f[c],
//                     b[c] = e)
//             } else
//                 b[d] = e
//     }
//     function lc(a, b, c) {
//         var d, e, f = 0, g = ec.length, h = n.Deferred().always(function() {
//             delete i.elem
//         }), i = function() {
//             if (e)
//                 return !1;
//             for (var b = _b || gc(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++)
//                 j.tweens[g].run(f);
//             return h.notifyWith(a, [j, f, c]),
//             1 > f && i ? c : (h.resolveWith(a, [j]),
//             !1)
//         }
//         , j = h.promise({
//             elem: a,
//             props: n.extend({}, b),
//             opts: n.extend(!0, {
//                 specialEasing: {}
//             }, c),
//             originalProperties: b,
//             originalOptions: c,
//             startTime: _b || gc(),
//             duration: c.duration,
//             tweens: [],
//             createTween: function(b, c) {
//                 var d = n.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
//                 return j.tweens.push(d),
//                 d
//             },
//             stop: function(b) {
//                 var c = 0
//                   , d = b ? j.tweens.length : 0;
//                 if (e)
//                     return this;
//                 for (e = !0; d > c; c++)
//                     j.tweens[c].run(1);
//                 return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]),
//                 this
//             }
//         }), k = j.props;
//         for (kc(k, j.opts.specialEasing); g > f; f++)
//             if (d = ec[f].call(j, a, k, j.opts))
//                 return d;
//         return n.map(k, ic, j),
//         n.isFunction(j.opts.start) && j.opts.start.call(a, j),
//         n.fx.timer(n.extend(i, {
//             elem: a,
//             anim: j,
//             queue: j.opts.queue
//         })),
//         j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
//     }
//     n.Animation = n.extend(lc, {
//         tweener: function(a, b) {
//             n.isFunction(a) ? (b = a,
//             a = ["*"]) : a = a.split(" ");
//             for (var c, d = 0, e = a.length; e > d; d++)
//                 c = a[d],
//                 fc[c] = fc[c] || [],
//                 fc[c].unshift(b)
//         },
//         prefilter: function(a, b) {
//             b ? ec.unshift(a) : ec.push(a)
//         }
//     }),
//     n.speed = function(a, b, c) {
//         var d = a && "object" == typeof a ? n.extend({}, a) : {
//             complete: c || !c && b || n.isFunction(a) && a,
//             duration: a,
//             easing: c && b || b && !n.isFunction(b) && b
//         };
//         return d.duration = n.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in n.fx.speeds ? n.fx.speeds[d.duration] : n.fx.speeds._default,
//         (null == d.queue || d.queue === !0) && (d.queue = "fx"),
//         d.old = d.complete,
//         d.complete = function() {
//             n.isFunction(d.old) && d.old.call(this),
//             d.queue && n.dequeue(this, d.queue)
//         }
//         ,
//         d
//     }
//     ,
//     n.fn.extend({
//         fadeTo: function(a, b, c, d) {
//             return this.filter(V).css("opacity", 0).show().end().animate({
//                 opacity: b
//             }, a, c, d)
//         },
//         animate: function(a, b, c, d) {
//             var e = n.isEmptyObject(a)
//               , f = n.speed(b, c, d)
//               , g = function() {
//                 var b = lc(this, n.extend({}, a), f);
//                 (e || n._data(this, "finish")) && b.stop(!0)
//             }
//             ;
//             return g.finish = g,
//             e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
//         },
//         stop: function(a, b, c) {
//             var d = function(a) {
//                 var b = a.stop;
//                 delete a.stop,
//                 b(c)
//             }
//             ;
//             return "string" != typeof a && (c = b,
//             b = a,
//             a = void 0),
//             b && a !== !1 && this.queue(a || "fx", []),
//             this.each(function() {
//                 var b = !0
//                   , e = null != a && a + "queueHooks"
//                   , f = n.timers
//                   , g = n._data(this);
//                 if (e)
//                     g[e] && g[e].stop && d(g[e]);
//                 else
//                     for (e in g)
//                         g[e] && g[e].stop && dc.test(e) && d(g[e]);
//                 for (e = f.length; e--; )
//                     f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c),
//                     b = !1,
//                     f.splice(e, 1));
//                 (b || !c) && n.dequeue(this, a)
//             })
//         },
//         finish: function(a) {
//             return a !== !1 && (a = a || "fx"),
//             this.each(function() {
//                 var b, c = n._data(this), d = c[a + "queue"], e = c[a + "queueHooks"], f = n.timers, g = d ? d.length : 0;
//                 for (c.finish = !0,
//                 n.queue(this, a, []),
//                 e && e.stop && e.stop.call(this, !0),
//                 b = f.length; b--; )
//                     f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0),
//                     f.splice(b, 1));
//                 for (b = 0; g > b; b++)
//                     d[b] && d[b].finish && d[b].finish.call(this);
//                 delete c.finish
//             })
//         }
//     }),
//     n.each(["toggle", "show", "hide"], function(a, b) {
//         var c = n.fn[b];
//         n.fn[b] = function(a, d, e) {
//             return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(hc(b, !0), a, d, e)
//         }
//     }),
//     n.each({
//         slideDown: hc("show"),
//         slideUp: hc("hide"),
//         slideToggle: hc("toggle"),
//         fadeIn: {
//             opacity: "show"
//         },
//         fadeOut: {
//             opacity: "hide"
//         },
//         fadeToggle: {
//             opacity: "toggle"
//         }
//     }, function(a, b) {
//         n.fn[a] = function(a, c, d) {
//             return this.animate(b, a, c, d)
//         }
//     }),
//     n.timers = [],
//     n.fx.tick = function() {
//         var a, b = n.timers, c = 0;
//         for (_b = n.now(); c < b.length; c++)
//             a = b[c],
//             a() || b[c] !== a || b.splice(c--, 1);
//         b.length || n.fx.stop(),
//         _b = void 0
//     }
//     ,
//     n.fx.timer = function(a) {
//         n.timers.push(a),
//         a() ? n.fx.start() : n.timers.pop()
//     }
//     ,
//     n.fx.interval = 13,
//     n.fx.start = function() {
//         ac || (ac = setInterval(n.fx.tick, n.fx.interval))
//     }
//     ,
//     n.fx.stop = function() {
//         clearInterval(ac),
//         ac = null
//     }
//     ,
//     n.fx.speeds = {
//         slow: 600,
//         fast: 200,
//         _default: 400
//     },
//     n.fn.delay = function(a, b) {
//         return a = n.fx ? n.fx.speeds[a] || a : a,
//         b = b || "fx",
//         this.queue(b, function(b, c) {
//             var d = setTimeout(b, a);
//             c.stop = function() {
//                 clearTimeout(d)
//             }
//         })
//     }
//     ,
//     function() {
//         var a, b, c, d, e = z.createElement("div");
//         e.setAttribute("className", "t"),
//         e.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
//         a = e.getElementsByTagName("a")[0],
//         c = z.createElement("select"),
//         d = c.appendChild(z.createElement("option")),
//         b = e.getElementsByTagName("input")[0],
//         a.style.cssText = "top:1px",
//         l.getSetAttribute = "t" !== e.className,
//         l.style = /top/.test(a.getAttribute("style")),
//         l.hrefNormalized = "/a" === a.getAttribute("href"),
//         l.checkOn = !!b.value,
//         l.optSelected = d.selected,
//         l.enctype = !!z.createElement("form").enctype,
//         c.disabled = !0,
//         l.optDisabled = !d.disabled,
//         b = z.createElement("input"),
//         b.setAttribute("value", ""),
//         l.input = "" === b.getAttribute("value"),
//         b.value = "t",
//         b.setAttribute("type", "radio"),
//         l.radioValue = "t" === b.value,
//         a = b = c = d = e = null
//     }();
//     var mc = /\r/g;
//     n.fn.extend({
//         val: function(a) {
//             var b, c, d, e = this[0];
//             {
//                 if (arguments.length)
//                     return d = n.isFunction(a),
//                     this.each(function(c) {
//                         var e;
//                         1 === this.nodeType && (e = d ? a.call(this, c, n(this).val()) : a,
//                         null == e ? e = "" : "number" == typeof e ? e += "" : n.isArray(e) && (e = n.map(e, function(a) {
//                             return null == a ? "" : a + ""
//                         })),
//                         b = n.valHooks[this.type] || n.valHooks[this.nodeName.toLowerCase()],
//                         b && "set"in b && void 0 !== b.set(this, e, "value") || (this.value = e))
//                     });
//                 if (e)
//                     return b = n.valHooks[e.type] || n.valHooks[e.nodeName.toLowerCase()],
//                     b && "get"in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value,
//                     "string" == typeof c ? c.replace(mc, "") : null == c ? "" : c)
//             }
//         }
//     }),
//     n.extend({
//         valHooks: {
//             option: {
//                 get: function(a) {
//                     var b = n.find.attr(a, "value");
//                     return null != b ? b : n.text(a)
//                 }
//             },
//             select: {
//                 get: function(a) {
//                     for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)
//                         if (c = d[i],
//                         !(!c.selected && i !== e || (l.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && n.nodeName(c.parentNode, "optgroup"))) {
//                             if (b = n(c).val(),
//                             f)
//                                 return b;
//                             g.push(b)
//                         }
//                     return g
//                 },
//                 set: function(a, b) {
//                     var c, d, e = a.options, f = n.makeArray(b), g = e.length;
//                     while (g--)
//                         if (d = e[g],
//                         n.inArray(n.valHooks.option.get(d), f) >= 0)
//                             try {
//                                 d.selected = c = !0
//                             } catch (h) {
//                                 d.scrollHeight
//                             }
//                         else
//                             d.selected = !1;
//                     return c || (a.selectedIndex = -1),
//                     e
//                 }
//             }
//         }
//     }),
//     n.each(["radio", "checkbox"], function() {
//         n.valHooks[this] = {
//             set: function(a, b) {
//                 return n.isArray(b) ? a.checked = n.inArray(n(a).val(), b) >= 0 : void 0
//             }
//         },
//         l.checkOn || (n.valHooks[this].get = function(a) {
//             return null === a.getAttribute("value") ? "on" : a.value
//         }
//         )
//     });
//     var nc, oc, pc = n.expr.attrHandle, qc = /^(?:checked|selected)$/i, rc = l.getSetAttribute, sc = l.input;
//     n.fn.extend({
//         attr: function(a, b) {
//             return W(this, n.attr, a, b, arguments.length > 1)
//         },
//         removeAttr: function(a) {
//             return this.each(function() {
//                 n.removeAttr(this, a)
//             })
//         }
//     }),
//     n.extend({
//         attr: function(a, b, c) {
//             var d, e, f = a.nodeType;
//             if (a && 3 !== f && 8 !== f && 2 !== f)
//                 return typeof a.getAttribute === L ? n.prop(a, b, c) : (1 === f && n.isXMLDoc(a) || (b = b.toLowerCase(),
//                 d = n.attrHooks[b] || (n.expr.match.bool.test(b) ? oc : nc)),
//                 void 0 === c ? d && "get"in d && null !== (e = d.get(a, b)) ? e : (e = n.find.attr(a, b),
//                 null == e ? void 0 : e) : null !== c ? d && "set"in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""),
//                 c) : void n.removeAttr(a, b))
//         },
//         removeAttr: function(a, b) {
//             var c, d, e = 0, f = b && b.match(F);
//             if (f && 1 === a.nodeType)
//                 while (c = f[e++])
//                     d = n.propFix[c] || c,
//                     n.expr.match.bool.test(c) ? sc && rc || !qc.test(c) ? a[d] = !1 : a[n.camelCase("default-" + c)] = a[d] = !1 : n.attr(a, c, ""),
//                     a.removeAttribute(rc ? c : d)
//         },
//         attrHooks: {
//             type: {
//                 set: function(a, b) {
//                     if (!l.radioValue && "radio" === b && n.nodeName(a, "input")) {
//                         var c = a.value;
//                         return a.setAttribute("type", b),
//                         c && (a.value = c),
//                         b
//                     }
//                 }
//             }
//         }
//     }),
//     oc = {
//         set: function(a, b, c) {
//             return b === !1 ? n.removeAttr(a, c) : sc && rc || !qc.test(c) ? a.setAttribute(!rc && n.propFix[c] || c, c) : a[n.camelCase("default-" + c)] = a[c] = !0,
//             c
//         }
//     },
//     n.each(n.expr.match.bool.source.match(/\w+/g), function(a, b) {
//         var c = pc[b] || n.find.attr;
//         pc[b] = sc && rc || !qc.test(b) ? function(a, b, d) {
//             var e, f;
//             return d || (f = pc[b],
//             pc[b] = e,
//             e = null != c(a, b, d) ? b.toLowerCase() : null ,
//             pc[b] = f),
//             e
//         }
//         : function(a, b, c) {
//             return c ? void 0 : a[n.camelCase("default-" + b)] ? b.toLowerCase() : null
//         }
//     }),
//     sc && rc || (n.attrHooks.value = {
//         set: function(a, b, c) {
//             return n.nodeName(a, "input") ? void (a.defaultValue = b) : nc && nc.set(a, b, c)
//         }
//     }),
//     rc || (nc = {
//         set: function(a, b, c) {
//             var d = a.getAttributeNode(c);
//             return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)),
//             d.value = b += "",
//             "value" === c || b === a.getAttribute(c) ? b : void 0
//         }
//     },
//     pc.id = pc.name = pc.coords = function(a, b, c) {
//         var d;
//         return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null
//     }
//     ,
//     n.valHooks.button = {
//         get: function(a, b) {
//             var c = a.getAttributeNode(b);
//             return c && c.specified ? c.value : void 0
//         },
//         set: nc.set
//     },
//     n.attrHooks.contenteditable = {
//         set: function(a, b, c) {
//             nc.set(a, "" === b ? !1 : b, c)
//         }
//     },
//     n.each(["width", "height"], function(a, b) {
//         n.attrHooks[b] = {
//             set: function(a, c) {
//                 return "" === c ? (a.setAttribute(b, "auto"),
//                 c) : void 0
//             }
//         }
//     })),
//     l.style || (n.attrHooks.style = {
//         get: function(a) {
//             return a.style.cssText || void 0
//         },
//         set: function(a, b) {
//             return a.style.cssText = b + ""
//         }
//     });
//     var tc = /^(?:input|select|textarea|button|object)$/i
//       , uc = /^(?:a|area)$/i;
//     n.fn.extend({
//         prop: function(a, b) {
//             return W(this, n.prop, a, b, arguments.length > 1)
//         },
//         removeProp: function(a) {
//             return a = n.propFix[a] || a,
//             this.each(function() {
//                 try {
//                     this[a] = void 0,
//                     delete this[a]
//                 } catch (b) {}
//             })
//         }
//     }),
//     n.extend({
//         propFix: {
//             "for": "htmlFor",
//             "class": "className"
//         },
//         prop: function(a, b, c) {
//             var d, e, f, g = a.nodeType;
//             if (a && 3 !== g && 8 !== g && 2 !== g)
//                 return f = 1 !== g || !n.isXMLDoc(a),
//                 f && (b = n.propFix[b] || b,
//                 e = n.propHooks[b]),
//                 void 0 !== c ? e && "set"in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get"in e && null !== (d = e.get(a, b)) ? d : a[b]
//         },
//         propHooks: {
//             tabIndex: {
//                 get: function(a) {
//                     var b = n.find.attr(a, "tabindex");
//                     return b ? parseInt(b, 10) : tc.test(a.nodeName) || uc.test(a.nodeName) && a.href ? 0 : -1
//                 }
//             }
//         }
//     }),
//     l.hrefNormalized || n.each(["href", "src"], function(a, b) {
//         n.propHooks[b] = {
//             get: function(a) {
//                 return a.getAttribute(b, 4)
//             }
//         }
//     }),
//     l.optSelected || (n.propHooks.selected = {
//         get: function(a) {
//             var b = a.parentNode;
//             return b && (b.selectedIndex,
//             b.parentNode && b.parentNode.selectedIndex),
//             null
//         }
//     }),
//     n.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
//         n.propFix[this.toLowerCase()] = this
//     }),
//     l.enctype || (n.propFix.enctype = "encoding");
//     var vc = /[\t\r\n\f]/g;
//     n.fn.extend({
//         addClass: function(a) {
//             var b, c, d, e, f, g, h = 0, i = this.length, j = "string" == typeof a && a;
//             if (n.isFunction(a))
//                 return this.each(function(b) {
//                     n(this).addClass(a.call(this, b, this.className))
//                 });
//             if (j)
//                 for (b = (a || "").match(F) || []; i > h; h++)
//                     if (c = this[h],
//                     d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(vc, " ") : " ")) {
//                         f = 0;
//                         while (e = b[f++])
//                             d.indexOf(" " + e + " ") < 0 && (d += e + " ");
//                         g = n.trim(d),
//                         c.className !== g && (c.className = g)
//                     }
//             return this
//         },
//         removeClass: function(a) {
//             var b, c, d, e, f, g, h = 0, i = this.length, j = 0 === arguments.length || "string" == typeof a && a;
//             if (n.isFunction(a))
//                 return this.each(function(b) {
//                     n(this).removeClass(a.call(this, b, this.className))
//                 });
//             if (j)
//                 for (b = (a || "").match(F) || []; i > h; h++)
//                     if (c = this[h],
//                     d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(vc, " ") : "")) {
//                         f = 0;
//                         while (e = b[f++])
//                             while (d.indexOf(" " + e + " ") >= 0)
//                                 d = d.replace(" " + e + " ", " ");
//                         g = a ? n.trim(d) : "",
//                         c.className !== g && (c.className = g)
//                     }
//             return this
//         },
//         toggleClass: function(a, b) {
//             var c = typeof a;
//             return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(n.isFunction(a) ? function(c) {
//                 n(this).toggleClass(a.call(this, c, this.className, b), b)
//             }
//             : function() {
//                 if ("string" === c) {
//                     var b, d = 0, e = n(this), f = a.match(F) || [];
//                     while (b = f[d++])
//                         e.hasClass(b) ? e.removeClass(b) : e.addClass(b)
//                 } else
//                     (c === L || "boolean" === c) && (this.className && n._data(this, "__className__", this.className),
//                     this.className = this.className || a === !1 ? "" : n._data(this, "__className__") || "")
//             }
//             )
//         },
//         hasClass: function(a) {
//             for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++)
//                 if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(vc, " ").indexOf(b) >= 0)
//                     return !0;
//             return !1
//         }
//     }),
//     n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
//         n.fn[b] = function(a, c) {
//             return arguments.length > 0 ? this.on(b, null , a, c) : this.trigger(b)
//         }
//     }),
//     n.fn.extend({
//         hover: function(a, b) {
//             return this.mouseenter(a).mouseleave(b || a)
//         },
//         bind: function(a, b, c) {
//             return this.on(a, null , b, c)
//         },
//         unbind: function(a, b) {
//             return this.off(a, null , b)
//         },
//         delegate: function(a, b, c, d) {
//             return this.on(b, a, c, d)
//         },
//         undelegate: function(a, b, c) {
//             return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
//         }
//     });
//     var wc = n.now()
//       , xc = /\?/
//       , yc = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
//     n.parseJSON = function(b) {
//         if (a.JSON && a.JSON.parse)
//             return a.JSON.parse(b + "");
//         var c, d = null , e = n.trim(b + "");
//         return e && !n.trim(e.replace(yc, function(a, b, e, f) {
//             return c && b && (d = 0),
//             0 === d ? a : (c = e || b,
//             d += !f - !e,
//             "")
//         })) ? Function("return " + e)() : n.error("Invalid JSON: " + b)
//     }
//     ,
//     n.parseXML = function(b) {
//         var c, d;
//         if (!b || "string" != typeof b)
//             return null ;
//         try {
//             a.DOMParser ? (d = new DOMParser,
//             c = d.parseFromString(b, "text/xml")) : (c = new ActiveXObject("Microsoft.XMLDOM"),
//             c.async = "false",
//             c.loadXML(b))
//         } catch (e) {
//             c = void 0
//         }
//         return c && c.documentElement && !c.getElementsByTagName("parsererror").length || n.error("Invalid XML: " + b),
//         c
//     }
//     ;
//     var zc, Ac, Bc = /#.*$/, Cc = /([?&])_=[^&]*/, Dc = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, Ec = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Fc = /^(?:GET|HEAD)$/, Gc = /^\/\//, Hc = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, Ic = {}, Jc = {}, Kc = "*/".concat("*");
//     try {
//         Ac = location.href
//     } catch (Lc) {
//         Ac = z.createElement("a"),
//         Ac.href = "",
//         Ac = Ac.href
//     }
//     zc = Hc.exec(Ac.toLowerCase()) || [];
//     function Mc(a) {
//         return function(b, c) {
//             "string" != typeof b && (c = b,
//             b = "*");
//             var d, e = 0, f = b.toLowerCase().match(F) || [];
//             if (n.isFunction(c))
//                 while (d = f[e++])
//                     "+" === d.charAt(0) ? (d = d.slice(1) || "*",
//                     (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
//         }
//     }
//     function Nc(a, b, c, d) {
//         var e = {}
//           , f = a === Jc;
//         function g(h) {
//             var i;
//             return e[h] = !0,
//             n.each(a[h] || [], function(a, h) {
//                 var j = h(b, c, d);
//                 return "string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j),
//                 g(j),
//                 !1)
//             }),
//             i
//         }
//         return g(b.dataTypes[0]) || !e["*"] && g("*")
//     }
//     function Oc(a, b) {
//         var c, d, e = n.ajaxSettings.flatOptions || {};
//         for (d in b)
//             void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
//         return c && n.extend(!0, a, c),
//         a
//     }
//     function Pc(a, b, c) {
//         var d, e, f, g, h = a.contents, i = a.dataTypes;
//         while ("*" === i[0])
//             i.shift(),
//             void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
//         if (e)
//             for (g in h)
//                 if (h[g] && h[g].test(e)) {
//                     i.unshift(g);
//                     break
//                 }
//         if (i[0]in c)
//             f = i[0];
//         else {
//             for (g in c) {
//                 if (!i[0] || a.converters[g + " " + i[0]]) {
//                     f = g;
//                     break
//                 }
//                 d || (d = g)
//             }
//             f = f || d
//         }
//         return f ? (f !== i[0] && i.unshift(f),
//         c[f]) : void 0
//     }
//     function Qc(a, b, c, d) {
//         var e, f, g, h, i, j = {}, k = a.dataTypes.slice();
//         if (k[1])
//             for (g in a.converters)
//                 j[g.toLowerCase()] = a.converters[g];
//         f = k.shift();
//         while (f)
//             if (a.responseFields[f] && (c[a.responseFields[f]] = b),
//             !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)),
//             i = f,
//             f = k.shift())
//                 if ("*" === f)
//                     f = i;
//                 else if ("*" !== i && i !== f) {
//                     if (g = j[i + " " + f] || j["* " + f],
//                     !g)
//                         for (e in j)
//                             if (h = e.split(" "),
//                             h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
//                                 g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0],
//                                 k.unshift(h[1]));
//                                 break
//                             }
//                     if (g !== !0)
//                         if (g && a["throws"])
//                             b = g(b);
//                         else
//                             try {
//                                 b = g(b)
//                             } catch (l) {
//                                 return {
//                                     state: "parsererror",
//                                     error: g ? l : "No conversion from " + i + " to " + f
//                                 }
//                             }
//                 }
//         return {
//             state: "success",
//             data: b
//         }
//     }
//     n.extend({
//         active: 0,
//         lastModified: {},
//         etag: {},
//         ajaxSettings: {
//             url: Ac,
//             type: "GET",
//             isLocal: Ec.test(zc[1]),
//             global: !0,
//             processData: !0,
//             async: !0,
//             contentType: "application/x-www-form-urlencoded; charset=UTF-8",
//             accepts: {
//                 "*": Kc,
//                 text: "text/plain",
//                 html: "text/html",
//                 xml: "application/xml, text/xml",
//                 json: "application/json, text/javascript"
//             },
//             contents: {
//                 xml: /xml/,
//                 html: /html/,
//                 json: /json/
//             },
//             responseFields: {
//                 xml: "responseXML",
//                 text: "responseText",
//                 json: "responseJSON"
//             },
//             converters: {
//                 "* text": String,
//                 "text html": !0,
//                 "text json": n.parseJSON,
//                 "text xml": n.parseXML
//             },
//             flatOptions: {
//                 url: !0,
//                 context: !0
//             }
//         },
//         ajaxSetup: function(a, b) {
//             return b ? Oc(Oc(a, n.ajaxSettings), b) : Oc(n.ajaxSettings, a)
//         },
//         ajaxPrefilter: Mc(Ic),
//         ajaxTransport: Mc(Jc),
//         ajax: function(a, b) {
//             "object" == typeof a && (b = a,
//             a = void 0),
//             b = b || {};
//             var c, d, e, f, g, h, i, j, k = n.ajaxSetup({}, b), l = k.context || k, m = k.context && (l.nodeType || l.jquery) ? n(l) : n.event, o = n.Deferred(), p = n.Callbacks("once memory"), q = k.statusCode || {}, r = {}, s = {}, t = 0, u = "canceled", v = {
//                 readyState: 0,
//                 getResponseHeader: function(a) {
//                     var b;
//                     if (2 === t) {
//                         if (!j) {
//                             j = {};
//                             while (b = Dc.exec(f))
//                                 j[b[1].toLowerCase()] = b[2]
//                         }
//                         b = j[a.toLowerCase()]
//                     }
//                     return null == b ? null : b
//                 },
//                 getAllResponseHeaders: function() {
//                     return 2 === t ? f : null
//                 },
//                 setRequestHeader: function(a, b) {
//                     var c = a.toLowerCase();
//                     return t || (a = s[c] = s[c] || a,
//                     r[a] = b),
//                     this
//                 },
//                 overrideMimeType: function(a) {
//                     return t || (k.mimeType = a),
//                     this
//                 },
//                 statusCode: function(a) {
//                     var b;
//                     if (a)
//                         if (2 > t)
//                             for (b in a)
//                                 q[b] = [q[b], a[b]];
//                         else
//                             v.always(a[v.status]);
//                     return this
//                 },
//                 abort: function(a) {
//                     var b = a || u;
//                     return i && i.abort(b),
//                     x(0, b),
//                     this
//                 }
//             };
//             if (o.promise(v).complete = p.add,
//             v.success = v.done,
//             v.error = v.fail,
//             k.url = ((a || k.url || Ac) + "").replace(Bc, "").replace(Gc, zc[1] + "//"),
//             k.type = b.method || b.type || k.method || k.type,
//             k.dataTypes = n.trim(k.dataType || "*").toLowerCase().match(F) || [""],
//             null == k.crossDomain && (c = Hc.exec(k.url.toLowerCase()),
//             k.crossDomain = !(!c || c[1] === zc[1] && c[2] === zc[2] && (c[3] || ("http:" === c[1] ? "80" : "443")) === (zc[3] || ("http:" === zc[1] ? "80" : "443")))),
//             k.data && k.processData && "string" != typeof k.data && (k.data = n.param(k.data, k.traditional)),
//             Nc(Ic, k, b, v),
//             2 === t)
//                 return v;
//             h = k.global,
//             h && 0 === n.active++ && n.event.trigger("ajaxStart"),
//             k.type = k.type.toUpperCase(),
//             k.hasContent = !Fc.test(k.type),
//             e = k.url,
//             k.hasContent || (k.data && (e = k.url += (xc.test(e) ? "&" : "?") + k.data,
//             delete k.data),
//             k.cache === !1 && (k.url = Cc.test(e) ? e.replace(Cc, "$1_=" + wc++) : e + (xc.test(e) ? "&" : "?") + "_=" + wc++)),
//             k.ifModified && (n.lastModified[e] && v.setRequestHeader("If-Modified-Since", n.lastModified[e]),
//             n.etag[e] && v.setRequestHeader("If-None-Match", n.etag[e])),
//             (k.data && k.hasContent && k.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", k.contentType),
//             v.setRequestHeader("Accept", k.dataTypes[0] && k.accepts[k.dataTypes[0]] ? k.accepts[k.dataTypes[0]] + ("*" !== k.dataTypes[0] ? ", " + Kc + "; q=0.01" : "") : k.accepts["*"]);
//             for (d in k.headers)
//                 v.setRequestHeader(d, k.headers[d]);
//             if (k.beforeSend && (k.beforeSend.call(l, v, k) === !1 || 2 === t))
//                 return v.abort();
//             u = "abort";
//             for (d in {
//                 success: 1,
//                 error: 1,
//                 complete: 1
//             })
//                 v[d](k[d]);
//             if (i = Nc(Jc, k, b, v)) {
//                 v.readyState = 1,
//                 h && m.trigger("ajaxSend", [v, k]),
//                 k.async && k.timeout > 0 && (g = setTimeout(function() {
//                     v.abort("timeout")
//                 }, k.timeout));
//                 try {
//                     t = 1,
//                     i.send(r, x)
//                 } catch (w) {
//                     if (!(2 > t))
//                         throw w;
//                     x(-1, w)
//                 }
//             } else
//                 x(-1, "No Transport");
//             function x(a, b, c, d) {
//                 var j, r, s, u, w, x = b;
//                 2 !== t && (t = 2,
//                 g && clearTimeout(g),
//                 i = void 0,
//                 f = d || "",
//                 v.readyState = a > 0 ? 4 : 0,
//                 j = a >= 200 && 300 > a || 304 === a,
//                 c && (u = Pc(k, v, c)),
//                 u = Qc(k, u, v, j),
//                 j ? (k.ifModified && (w = v.getResponseHeader("Last-Modified"),
//                 w && (n.lastModified[e] = w),
//                 w = v.getResponseHeader("etag"),
//                 w && (n.etag[e] = w)),
//                 204 === a || "HEAD" === k.type ? x = "nocontent" : 304 === a ? x = "notmodified" : (x = u.state,
//                 r = u.data,
//                 s = u.error,
//                 j = !s)) : (s = x,
//                 (a || !x) && (x = "error",
//                 0 > a && (a = 0))),
//                 v.status = a,
//                 v.statusText = (b || x) + "",
//                 j ? o.resolveWith(l, [r, x, v]) : o.rejectWith(l, [v, x, s]),
//                 v.statusCode(q),
//                 q = void 0,
//                 h && m.trigger(j ? "ajaxSuccess" : "ajaxError", [v, k, j ? r : s]),
//                 p.fireWith(l, [v, x]),
//                 h && (m.trigger("ajaxComplete", [v, k]),
//                 --n.active || n.event.trigger("ajaxStop")))
//             }
//             return v
//         },
//         getJSON: function(a, b, c) {
//             return n.get(a, b, c, "json")
//         },
//         getScript: function(a, b) {
//             return n.get(a, void 0, b, "script")
//         }
//     }),
//     n.each(["get", "post"], function(a, b) {
//         n[b] = function(a, c, d, e) {
//             return n.isFunction(c) && (e = e || d,
//             d = c,
//             c = void 0),
//             n.ajax({
//                 url: a,
//                 type: b,
//                 dataType: e,
//                 data: c,
//                 success: d
//             })
//         }
//     }),
//     n.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(a, b) {
//         n.fn[b] = function(a) {
//             return this.on(b, a)
//         }
//     }),
//     n._evalUrl = function(a) {
//         return n.ajax({
//             url: a,
//             type: "GET",
//             dataType: "script",
//             async: !1,
//             global: !1,
//             "throws": !0
//         })
//     }
//     ,
//     n.fn.extend({
//         wrapAll: function(a) {
//             if (n.isFunction(a))
//                 return this.each(function(b) {
//                     n(this).wrapAll(a.call(this, b))
//                 });
//             if (this[0]) {
//                 var b = n(a, this[0].ownerDocument).eq(0).clone(!0);
//                 this[0].parentNode && b.insertBefore(this[0]),
//                 b.map(function() {
//                     var a = this;
//                     while (a.firstChild && 1 === a.firstChild.nodeType)
//                         a = a.firstChild;
//                     return a
//                 }).append(this)
//             }
//             return this
//         },
//         wrapInner: function(a) {
//             return this.each(n.isFunction(a) ? function(b) {
//                 n(this).wrapInner(a.call(this, b))
//             }
//             : function() {
//                 var b = n(this)
//                   , c = b.contents();
//                 c.length ? c.wrapAll(a) : b.append(a)
//             }
//             )
//         },
//         wrap: function(a) {
//             var b = n.isFunction(a);
//             return this.each(function(c) {
//                 n(this).wrapAll(b ? a.call(this, c) : a)
//             })
//         },
//         unwrap: function() {
//             return this.parent().each(function() {
//                 n.nodeName(this, "body") || n(this).replaceWith(this.childNodes)
//             }).end()
//         }
//     }),
//     n.expr.filters.hidden = function(a) {
//         return a.offsetWidth <= 0 && a.offsetHeight <= 0 || !l.reliableHiddenOffsets() && "none" === (a.style && a.style.display || n.css(a, "display"))
//     }
//     ,
//     n.expr.filters.visible = function(a) {
//         return !n.expr.filters.hidden(a)
//     }
//     ;
//     var Rc = /%20/g
//       , Sc = /\[\]$/
//       , Tc = /\r?\n/g
//       , Uc = /^(?:submit|button|image|reset|file)$/i
//       , Vc = /^(?:input|select|textarea|keygen)/i;
//     function Wc(a, b, c, d) {
//         var e;
//         if (n.isArray(b))
//             n.each(b, function(b, e) {
//                 c || Sc.test(a) ? d(a, e) : Wc(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
//             });
//         else if (c || "object" !== n.type(b))
//             d(a, b);
//         else
//             for (e in b)
//                 Wc(a + "[" + e + "]", b[e], c, d)
//     }
//     n.param = function(a, b) {
//         var c, d = [], e = function(a, b) {
//             b = n.isFunction(b) ? b() : null == b ? "" : b,
//             d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
//         }
//         ;
//         if (void 0 === b && (b = n.ajaxSettings && n.ajaxSettings.traditional),
//         n.isArray(a) || a.jquery && !n.isPlainObject(a))
//             n.each(a, function() {
//                 e(this.name, this.value)
//             });
//         else
//             for (c in a)
//                 Wc(c, a[c], b, e);
//         return d.join("&").replace(Rc, "+")
//     }
//     ,
//     n.fn.extend({
//         serialize: function() {
//             return n.param(this.serializeArray())
//         },
//         serializeArray: function() {
//             return this.map(function() {
//                 var a = n.prop(this, "elements");
//                 return a ? n.makeArray(a) : this
//             }).filter(function() {
//                 var a = this.type;
//                 return this.name && !n(this).is(":disabled") && Vc.test(this.nodeName) && !Uc.test(a) && (this.checked || !X.test(a))
//             }).map(function(a, b) {
//                 var c = n(this).val();
//                 return null == c ? null : n.isArray(c) ? n.map(c, function(a) {
//                     return {
//                         name: b.name,
//                         value: a.replace(Tc, "\r\n")
//                     }
//                 }) : {
//                     name: b.name,
//                     value: c.replace(Tc, "\r\n")
//                 }
//             }).get()
//         }
//     }),
//     n.ajaxSettings.xhr = void 0 !== a.ActiveXObject ? function() {
//         return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && $c() || _c()
//     }
//     : $c;
//     var Xc = 0
//       , Yc = {}
//       , Zc = n.ajaxSettings.xhr();
//     a.ActiveXObject && n(a).on("unload", function() {
//         for (var a in Yc)
//             Yc[a](void 0, !0)
//     }),
//     l.cors = !!Zc && "withCredentials"in Zc,
//     Zc = l.ajax = !!Zc,
//     Zc && n.ajaxTransport(function(a) {
//         if (!a.crossDomain || l.cors) {
//             var b;
//             return {
//                 send: function(c, d) {
//                     var e, f = a.xhr(), g = ++Xc;
//                     if (f.open(a.type, a.url, a.async, a.username, a.password),
//                     a.xhrFields)
//                         for (e in a.xhrFields)
//                             f[e] = a.xhrFields[e];
//                     a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType),
//                     a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
//                     for (e in c)
//                         void 0 !== c[e] && f.setRequestHeader(e, c[e] + "");
//                     f.send(a.hasContent && a.data || null ),
//                     b = function(c, e) {
//                         var h, i, j;
//                         if (b && (e || 4 === f.readyState))
//                             if (delete Yc[g],
//                             b = void 0,
//                             f.onreadystatechange = n.noop,
//                             e)
//                                 4 !== f.readyState && f.abort();
//                             else {
//                                 j = {},
//                                 h = f.status,
//                                 "string" == typeof f.responseText && (j.text = f.responseText);
//                                 try {
//                                     i = f.statusText
//                                 } catch (k) {
//                                     i = ""
//                                 }
//                                 h || !a.isLocal || a.crossDomain ? 1223 === h && (h = 204) : h = j.text ? 200 : 404
//                             }
//                         j && d(h, i, j, f.getAllResponseHeaders())
//                     }
//                     ,
//                     a.async ? 4 === f.readyState ? setTimeout(b) : f.onreadystatechange = Yc[g] = b : b()
//                 },
//                 abort: function() {
//                     b && b(void 0, !0)
//                 }
//             }
//         }
//     });
//     function $c() {
//         try {
//             return new a.XMLHttpRequest
//         } catch (b) {}
//     }
//     function _c() {
//         try {
//             return new a.ActiveXObject("Microsoft.XMLHTTP")
//         } catch (b) {}
//     }
//     n.ajaxSetup({
//         accepts: {
//             script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
//         },
//         contents: {
//             script: /(?:java|ecma)script/
//         },
//         converters: {
//             "text script": function(a) {
//                 return n.globalEval(a),
//                 a
//             }
//         }
//     }),
//     n.ajaxPrefilter("script", function(a) {
//         void 0 === a.cache && (a.cache = !1),
//         a.crossDomain && (a.type = "GET",
//         a.global = !1)
//     }),
//     n.ajaxTransport("script", function(a) {
//         if (a.crossDomain) {
//             var b, c = z.head || n("head")[0] || z.documentElement;
//             return {
//                 send: function(d, e) {
//                     b = z.createElement("script"),
//                     b.async = !0,
//                     a.scriptCharset && (b.charset = a.scriptCharset),
//                     b.src = a.url,
//                     b.onload = b.onreadystatechange = function(a, c) {
//                         (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null ,
//                         b.parentNode && b.parentNode.removeChild(b),
//                         b = null ,
//                         c || e(200, "success"))
//                     }
//                     ,
//                     c.insertBefore(b, c.firstChild)
//                 },
//                 abort: function() {
//                     b && b.onload(void 0, !0)
//                 }
//             }
//         }
//     });
//     var ad = []
//       , bd = /(=)\?(?=&|$)|\?\?/;
//     n.ajaxSetup({
//         jsonp: "callback",
//         jsonpCallback: function() {
//             var a = ad.pop() || n.expando + "_" + wc++;
//             return this[a] = !0,
//             a
//         }
//     }),
//     n.ajaxPrefilter("json jsonp", function(b, c, d) {
//         var e, f, g, h = b.jsonp !== !1 && (bd.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && bd.test(b.data) && "data");
//         return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = n.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback,
//         h ? b[h] = b[h].replace(bd, "$1" + e) : b.jsonp !== !1 && (b.url += (xc.test(b.url) ? "&" : "?") + b.jsonp + "=" + e),
//         b.converters["script json"] = function() {
//             return g || n.error(e + " was not called"),
//             g[0]
//         }
//         ,
//         b.dataTypes[0] = "json",
//         f = a[e],
//         a[e] = function() {
//             g = arguments
//         }
//         ,
//         d.always(function() {
//             a[e] = f,
//             b[e] && (b.jsonpCallback = c.jsonpCallback,
//             ad.push(e)),
//             g && n.isFunction(f) && f(g[0]),
//             g = f = void 0
//         }),
//         "script") : void 0
//     }),
//     n.parseHTML = function(a, b, c) {
//         if (!a || "string" != typeof a)
//             return null ;
//         "boolean" == typeof b && (c = b,
//         b = !1),
//         b = b || z;
//         var d = v.exec(a)
//           , e = !c && [];
//         return d ? [b.createElement(d[1])] : (d = n.buildFragment([a], b, e),
//         e && e.length && n(e).remove(),
//         n.merge([], d.childNodes))
//     }
//     ;
//     var cd = n.fn.load;
//     n.fn.load = function(a, b, c) {
//         if ("string" != typeof a && cd)
//             return cd.apply(this, arguments);
//         var d, e, f, g = this, h = a.indexOf(" ");
//         return h >= 0 && (d = a.slice(h, a.length),
//         a = a.slice(0, h)),
//         n.isFunction(b) ? (c = b,
//         b = void 0) : b && "object" == typeof b && (f = "POST"),
//         g.length > 0 && n.ajax({
//             url: a,
//             type: f,
//             dataType: "html",
//             data: b
//         }).done(function(a) {
//             e = arguments,
//             g.html(d ? n("<div>").append(n.parseHTML(a)).find(d) : a)
//         }).complete(c && function(a, b) {
//             g.each(c, e || [a.responseText, b, a])
//         }
//         ),
//         this
//     }
//     ,
//     n.expr.filters.animated = function(a) {
//         return n.grep(n.timers, function(b) {
//             return a === b.elem
//         }).length
//     }
//     ;
//     var dd = a.document.documentElement;
//     function ed(a) {
//         return n.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1
//     }
//     n.offset = {
//         setOffset: function(a, b, c) {
//             var d, e, f, g, h, i, j, k = n.css(a, "position"), l = n(a), m = {};
//             "static" === k && (a.style.position = "relative"),
//             h = l.offset(),
//             f = n.css(a, "top"),
//             i = n.css(a, "left"),
//             j = ("absolute" === k || "fixed" === k) && n.inArray("auto", [f, i]) > -1,
//             j ? (d = l.position(),
//             g = d.top,
//             e = d.left) : (g = parseFloat(f) || 0,
//             e = parseFloat(i) || 0),
//             n.isFunction(b) && (b = b.call(a, c, h)),
//             null != b.top && (m.top = b.top - h.top + g),
//             null != b.left && (m.left = b.left - h.left + e),
//             "using"in b ? b.using.call(a, m) : l.css(m)
//         }
//     },
//     n.fn.extend({
//         offset: function(a) {
//             if (arguments.length)
//                 return void 0 === a ? this : this.each(function(b) {
//                     n.offset.setOffset(this, a, b)
//                 });
//             var b, c, d = {
//                 top: 0,
//                 left: 0
//             }, e = this[0], f = e && e.ownerDocument;
//             if (f)
//                 return b = f.documentElement,
//                 n.contains(b, e) ? (typeof e.getBoundingClientRect !== L && (d = e.getBoundingClientRect()),
//                 c = ed(f),
//                 {
//                     top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
//                     left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
//                 }) : d
//         },
//         position: function() {
//             if (this[0]) {
//                 var a, b, c = {
//                     top: 0,
//                     left: 0
//                 }, d = this[0];
//                 return "fixed" === n.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(),
//                 b = this.offset(),
//                 n.nodeName(a[0], "html") || (c = a.offset()),
//                 c.top += n.css(a[0], "borderTopWidth", !0),
//                 c.left += n.css(a[0], "borderLeftWidth", !0)),
//                 {
//                     top: b.top - c.top - n.css(d, "marginTop", !0),
//                     left: b.left - c.left - n.css(d, "marginLeft", !0)
//                 }
//             }
//         },
//         offsetParent: function() {
//             return this.map(function() {
//                 var a = this.offsetParent || dd;
//                 while (a && !n.nodeName(a, "html") && "static" === n.css(a, "position"))
//                     a = a.offsetParent;
//                 return a || dd
//             })
//         }
//     }),
//     n.each({
//         scrollLeft: "pageXOffset",
//         scrollTop: "pageYOffset"
//     }, function(a, b) {
//         var c = /Y/.test(b);
//         n.fn[a] = function(d) {
//             return W(this, function(a, d, e) {
//                 var f = ed(a);
//                 return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void (f ? f.scrollTo(c ? n(f).scrollLeft() : e, c ? e : n(f).scrollTop()) : a[d] = e)
//             }, a, d, arguments.length, null )
//         }
//     }),
//     n.each(["top", "left"], function(a, b) {
//         n.cssHooks[b] = Mb(l.pixelPosition, function(a, c) {
//             return c ? (c = Kb(a, b),
//             Ib.test(c) ? n(a).position()[b] + "px" : c) : void 0
//         })
//     }),
//     n.each({
//         Height: "height",
//         Width: "width"
//     }, function(a, b) {
//         n.each({
//             padding: "inner" + a,
//             content: b,
//             "": "outer" + a
//         }, function(c, d) {
//             n.fn[d] = function(d, e) {
//                 var f = arguments.length && (c || "boolean" != typeof d)
//                   , g = c || (d === !0 || e === !0 ? "margin" : "border");
//                 return W(this, function(b, c, d) {
//                     var e;
//                     return n.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement,
//                     Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? n.css(b, c, g) : n.style(b, c, d, g)
//                 }, b, f ? d : void 0, f, null )
//             }
//         })
//     }),
//     n.fn.size = function() {
//         return this.length
//     }
//     ,
//     n.fn.andSelf = n.fn.addBack,
//     "function" == typeof define && define.amd && define("jquery", [], function() {
//         return n
//     });
//     var fd = a.jQuery
//       , gd = a.$;
//     return n.noConflict = function(b) {
//         return a.$ === n && (a.$ = gd),
//         b && a.jQuery === n && (a.jQuery = fd),
//         n
//     }
//     ,
//     typeof b === L && (a.jQuery = a.$ = n),
//     n
// });
// ;/* Chosen v1.4.2 | (c) 2011-2015 by Harvest | MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md */
// (function() {
//     var a, AbstractChosen, Chosen, SelectParser, b, c = {}.hasOwnProperty, d = function(a, b) {
//         function d() {
//             this.constructor = a
//         }
//         for (var e in b)
//             c.call(b, e) && (a[e] = b[e]);
//         return d.prototype = b.prototype,
//         a.prototype = new d,
//         a.__super__ = b.prototype,
//         a
//     }
//     ;
//     SelectParser = function() {
//         function SelectParser() {
//             this.options_index = 0,
//             this.parsed = []
//         }
//         return SelectParser.prototype.add_node = function(a) {
//             return "OPTGROUP" === a.nodeName.toUpperCase() ? this.add_group(a) : this.add_option(a)
//         }
//         ,
//         SelectParser.prototype.add_group = function(a) {
//             var b, c, d, e, f, g;
//             for (b = this.parsed.length,
//             this.parsed.push({
//                 array_index: b,
//                 group: !0,
//                 label: this.escapeExpression(a.label),
//                 title: a.title ? a.title : void 0,
//                 children: 0,
//                 disabled: a.disabled,
//                 classes: a.className
//             }),
//             f = a.childNodes,
//             g = [],
//             d = 0,
//             e = f.length; e > d; d++)
//                 c = f[d],
//                 g.push(this.add_option(c, b, a.disabled));
//             return g
//         }
//         ,
//         SelectParser.prototype.add_option = function(a, b, c) {
//             return "OPTION" === a.nodeName.toUpperCase() ? ("" !== a.text ? (null != b && (this.parsed[b].children += 1),
//             this.parsed.push({
//                 array_index: this.parsed.length,
//                 options_index: this.options_index,
//                 value: a.value,
//                 text: a.text,
//                 html: a.innerHTML,
//                 title: a.title ? a.title : void 0,
//                 selected: a.selected,
//                 disabled: c === !0 ? c : a.disabled,
//                 group_array_index: b,
//                 group_label: null != b ? this.parsed[b].label : null ,
//                 classes: a.className,
//                 style: a.style.cssText
//             })) : this.parsed.push({
//                 array_index: this.parsed.length,
//                 options_index: this.options_index,
//                 empty: !0
//             }),
//             this.options_index += 1) : void 0
//         }
//         ,
//         SelectParser.prototype.escapeExpression = function(a) {
//             var b, c;
//             return null == a || a === !1 ? "" : /[\&\<\>\"\'\`]/.test(a) ? (b = {
//                 "<": "&lt;",
//                 ">": "&gt;",
//                 '"': "&quot;",
//                 "'": "&#x27;",
//                 "`": "&#x60;"
//             },
//             c = /&(?!\w+;)|[\<\>\"\'\`]/g,
//             a.replace(c, function(a) {
//                 return b[a] || "&amp;"
//             })) : a
//         }
//         ,
//         SelectParser
//     }(),
//     SelectParser.select_to_array = function(a) {
//         var b, c, d, e, f;
//         for (c = new SelectParser,
//         f = a.childNodes,
//         d = 0,
//         e = f.length; e > d; d++)
//             b = f[d],
//             c.add_node(b);
//         return c.parsed
//     }
//     ,
//     AbstractChosen = function() {
//         function AbstractChosen(a, b) {
//             this.form_field = a,
//             this.options = null != b ? b : {},
//             AbstractChosen.browser_is_supported() && (this.is_multiple = this.form_field.multiple,
//             this.set_default_text(),
//             this.set_default_values(),
//             this.setup(),
//             this.set_up_html(),
//             this.register_observers(),
//             this.on_ready())
//         }
//         return AbstractChosen.prototype.set_default_values = function() {
//             var a = this;
//             return this.click_test_action = function(b) {
//                 return a.test_active_click(b)
//             }
//             ,
//             this.activate_action = function(b) {
//                 return a.activate_field(b)
//             }
//             ,
//             this.active_field = !1,
//             this.mouse_on_container = !1,
//             this.results_showing = !1,
//             this.result_highlighted = null ,
//             this.allow_single_deselect = null != this.options.allow_single_deselect && null != this.form_field.options[0] && "" === this.form_field.options[0].text ? this.options.allow_single_deselect : !1,
//             this.disable_search_threshold = this.options.disable_search_threshold || 0,
//             this.disable_search = this.options.disable_search || !1,
//             this.enable_split_word_search = null != this.options.enable_split_word_search ? this.options.enable_split_word_search : !0,
//             this.group_search = null != this.options.group_search ? this.options.group_search : !0,
//             this.search_contains = this.options.search_contains || !1,
//             this.single_backstroke_delete = null != this.options.single_backstroke_delete ? this.options.single_backstroke_delete : !0,
//             this.max_selected_options = this.options.max_selected_options || 1 / 0,
//             this.inherit_select_classes = this.options.inherit_select_classes || !1,
//             this.display_selected_options = null != this.options.display_selected_options ? this.options.display_selected_options : !0,
//             this.display_disabled_options = null != this.options.display_disabled_options ? this.options.display_disabled_options : !0,
//             this.include_group_label_in_selected = this.options.include_group_label_in_selected || !1
//         }
//         ,
//         AbstractChosen.prototype.set_default_text = function() {
//             return this.default_text = this.form_field.getAttribute("data-placeholder") ? this.form_field.getAttribute("data-placeholder") : this.is_multiple ? this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text : this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text,
//             this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text
//         }
//         ,
//         AbstractChosen.prototype.choice_label = function(a) {
//             return this.include_group_label_in_selected && null != a.group_label ? "<b class='group-name'>" + a.group_label + "</b>" + a.html : a.html
//         }
//         ,
//         AbstractChosen.prototype.mouse_enter = function() {
//             return this.mouse_on_container = !0
//         }
//         ,
//         AbstractChosen.prototype.mouse_leave = function() {
//             return this.mouse_on_container = !1
//         }
//         ,
//         AbstractChosen.prototype.input_focus = function() {
//             var a = this;
//             if (this.is_multiple) {
//                 if (!this.active_field)
//                     return setTimeout(function() {
//                         return a.container_mousedown()
//                     }, 50)
//             } else if (!this.active_field)
//                 return this.activate_field()
//         }
//         ,
//         AbstractChosen.prototype.input_blur = function() {
//             var a = this;
//             return this.mouse_on_container ? void 0 : (this.active_field = !1,
//             setTimeout(function() {
//                 return a.blur_test()
//             }, 100))
//         }
//         ,
//         AbstractChosen.prototype.results_option_build = function(a) {
//             var b, c, d, e, f;
//             for (b = "",
//             f = this.results_data,
//             d = 0,
//             e = f.length; e > d; d++)
//                 c = f[d],
//                 b += c.group ? this.result_add_group(c) : this.result_add_option(c),
//                 (null != a ? a.first : void 0) && (c.selected && this.is_multiple ? this.choice_build(c) : c.selected && !this.is_multiple && this.single_set_selected_text(this.choice_label(c)));
//             return b
//         }
//         ,
//         AbstractChosen.prototype.result_add_option = function(a) {
//             var b, c;
//             return a.search_match ? this.include_option_in_results(a) ? (b = [],
//             a.disabled || a.selected && this.is_multiple || b.push("active-result"),
//             !a.disabled || a.selected && this.is_multiple || b.push("disabled-result"),
//             a.selected && b.push("result-selected"),
//             null != a.group_array_index && b.push("group-option"),
//             "" !== a.classes && b.push(a.classes),
//             c = document.createElement("li"),
//             c.className = b.join(" "),
//             c.style.cssText = a.style,
//             c.setAttribute("data-option-array-index", a.array_index),
//             c.innerHTML = a.search_text,
//             a.title && (c.title = a.title),
//             this.outerHTML(c)) : "" : ""
//         }
//         ,
//         AbstractChosen.prototype.result_add_group = function(a) {
//             var b, c;
//             return a.search_match || a.group_match ? a.active_options > 0 ? (b = [],
//             b.push("group-result"),
//             a.classes && b.push(a.classes),
//             c = document.createElement("li"),
//             c.className = b.join(" "),
//             c.innerHTML = a.search_text,
//             a.title && (c.title = a.title),
//             this.outerHTML(c)) : "" : ""
//         }
//         ,
//         AbstractChosen.prototype.results_update_field = function() {
//             return this.set_default_text(),
//             this.is_multiple || this.results_reset_cleanup(),
//             this.result_clear_highlight(),
//             this.results_build(),
//             this.results_showing ? this.winnow_results() : void 0
//         }
//         ,
//         AbstractChosen.prototype.reset_single_select_options = function() {
//             var a, b, c, d, e;
//             for (d = this.results_data,
//             e = [],
//             b = 0,
//             c = d.length; c > b; b++)
//                 a = d[b],
//                 a.selected ? e.push(a.selected = !1) : e.push(void 0);
//             return e
//         }
//         ,
//         AbstractChosen.prototype.results_toggle = function() {
//             return this.results_showing ? this.results_hide() : this.results_show()
//         }
//         ,
//         AbstractChosen.prototype.results_search = function() {
//             return this.results_showing ? this.winnow_results() : this.results_show()
//         }
//         ,
//         AbstractChosen.prototype.winnow_results = function() {
//             var a, b, c, d, e, f, g, h, i, j, k, l;
//             for (this.no_results_clear(),
//             d = 0,
//             f = this.get_search_text(),
//             a = f.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
//             i = new RegExp(a,"i"),
//             c = this.get_search_regex(a),
//             l = this.results_data,
//             j = 0,
//             k = l.length; k > j; j++)
//                 b = l[j],
//                 b.search_match = !1,
//                 e = null ,
//                 this.include_option_in_results(b) && (b.group && (b.group_match = !1,
//                 b.active_options = 0),
//                 null != b.group_array_index && this.results_data[b.group_array_index] && (e = this.results_data[b.group_array_index],
//                 0 === e.active_options && e.search_match && (d += 1),
//                 e.active_options += 1),
//                 b.search_text = b.group ? b.label : b.html,
//                 (!b.group || this.group_search) && (b.search_match = this.search_string_match(b.search_text, c),
//                 b.search_match && !b.group && (d += 1),
//                 b.search_match ? (f.length && (g = b.search_text.search(i),
//                 h = b.search_text.substr(0, g + f.length) + "</em>" + b.search_text.substr(g + f.length),
//                 b.search_text = h.substr(0, g) + "<em>" + h.substr(g)),
//                 null != e && (e.group_match = !0)) : null != b.group_array_index && this.results_data[b.group_array_index].search_match && (b.search_match = !0)));
//             return this.result_clear_highlight(),
//             1 > d && f.length ? (this.update_results_content(""),
//             this.no_results(f)) : (this.update_results_content(this.results_option_build()),
//             this.winnow_results_set_highlight())
//         }
//         ,
//         AbstractChosen.prototype.get_search_regex = function(a) {
//             var b;
//             return b = this.search_contains ? "" : "^",
//             new RegExp(b + a,"i")
//         }
//         ,
//         AbstractChosen.prototype.search_string_match = function(a, b) {
//             var c, d, e, f;
//             if (b.test(a))
//                 return !0;
//             if (this.enable_split_word_search && (a.indexOf(" ") >= 0 || 0 === a.indexOf("[")) && (d = a.replace(/\[|\]/g, "").split(" "),
//             d.length))
//                 for (e = 0,
//                 f = d.length; f > e; e++)
//                     if (c = d[e],
//                     b.test(c))
//                         return !0
//         }
//         ,
//         AbstractChosen.prototype.choices_count = function() {
//             var a, b, c, d;
//             if (null != this.selected_option_count)
//                 return this.selected_option_count;
//             for (this.selected_option_count = 0,
//             d = this.form_field.options,
//             b = 0,
//             c = d.length; c > b; b++)
//                 a = d[b],
//                 a.selected && (this.selected_option_count += 1);
//             return this.selected_option_count
//         }
//         ,
//         AbstractChosen.prototype.choices_click = function(a) {
//             return a.preventDefault(),
//             this.results_showing || this.is_disabled ? void 0 : this.results_show()
//         }
//         ,
//         AbstractChosen.prototype.keyup_checker = function(a) {
//             var b, c;
//             switch (b = null != (c = a.which) ? c : a.keyCode,
//             this.search_field_scale(),
//             b) {
//             case 8:
//                 if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0)
//                     return this.keydown_backstroke();
//                 if (!this.pending_backstroke)
//                     return this.result_clear_highlight(),
//                     this.results_search();
//                 break;
//             case 13:
//                 if (a.preventDefault(),
//                 this.results_showing)
//                     return this.result_select(a);
//                 break;
//             case 27:
//                 return this.results_showing && this.results_hide(),
//                 !0;
//             case 9:
//             case 38:
//             case 40:
//             case 16:
//             case 91:
//             case 17:
//                 break;
//             default:
//                 return this.results_search()
//             }
//         }
//         ,
//         AbstractChosen.prototype.clipboard_event_checker = function() {
//             var a = this;
//             return setTimeout(function() {
//                 return a.results_search()
//             }, 50)
//         }
//         ,
//         AbstractChosen.prototype.container_width = function() {
//             return null != this.options.width ? this.options.width : "" + this.form_field.offsetWidth + "px"
//         }
//         ,
//         AbstractChosen.prototype.include_option_in_results = function(a) {
//             return this.is_multiple && !this.display_selected_options && a.selected ? !1 : !this.display_disabled_options && a.disabled ? !1 : a.empty ? !1 : !0
//         }
//         ,
//         AbstractChosen.prototype.search_results_touchstart = function(a) {
//             return this.touch_started = !0,
//             this.search_results_mouseover(a)
//         }
//         ,
//         AbstractChosen.prototype.search_results_touchmove = function(a) {
//             return this.touch_started = !1,
//             this.search_results_mouseout(a)
//         }
//         ,
//         AbstractChosen.prototype.search_results_touchend = function(a) {
//             return this.touch_started ? this.search_results_mouseup(a) : void 0
//         }
//         ,
//         AbstractChosen.prototype.outerHTML = function(a) {
//             var b;
//             return a.outerHTML ? a.outerHTML : (b = document.createElement("div"),
//             b.appendChild(a),
//             b.innerHTML)
//         }
//         ,
//         AbstractChosen.browser_is_supported = function() {
//             return "Microsoft Internet Explorer" === window.navigator.appName ? document.documentMode >= 8 : /iP(od|hone)/i.test(window.navigator.userAgent) ? !1 : /Android/i.test(window.navigator.userAgent) && /Mobile/i.test(window.navigator.userAgent) ? !1 : !0
//         }
//         ,
//         AbstractChosen.default_multiple_text = "Select Some Options",
//         AbstractChosen.default_single_text = "Select an Option",
//         AbstractChosen.default_no_result_text = "No results match",
//         AbstractChosen
//     }(),
//     a = jQuery,
//     a.fn.extend({
//         chosen: function(b) {
//             return AbstractChosen.browser_is_supported() ? this.each(function() {
//                 var c, d;
//                 c = a(this),
//                 d = c.data("chosen"),
//                 "destroy" === b && d instanceof Chosen ? d.destroy() : d instanceof Chosen || c.data("chosen", new Chosen(this,b))
//             }) : this
//         }
//     }),
//     Chosen = function(c) {
//         function Chosen() {
//             return b = Chosen.__super__.constructor.apply(this, arguments)
//         }
//         return d(Chosen, c),
//         Chosen.prototype.setup = function() {
//             return this.form_field_jq = a(this.form_field),
//             this.current_selectedIndex = this.form_field.selectedIndex,
//             this.is_rtl = this.form_field_jq.hasClass("chosen-rtl")
//         }
//         ,
//         Chosen.prototype.set_up_html = function() {
//             var b, c;
//             return b = ["chosen-container"],
//             b.push("chosen-container-" + (this.is_multiple ? "multi" : "single")),
//             this.inherit_select_classes && this.form_field.className && b.push(this.form_field.className),
//             this.is_rtl && b.push("chosen-rtl"),
//             c = {
//                 "class": b.join(" "),
//                 style: "width: " + this.container_width() + ";",
//                 title: this.form_field.title
//             },
//             this.form_field.id.length && (c.id = this.form_field.id.replace(/[^\w]/g, "_") + "_chosen"),
//             this.container = a("<div />", c),
//             this.is_multiple ? this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>') : this.container.html('<a class="chosen-single chosen-default" tabindex="-1"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>'),
//             this.form_field_jq.hide().after(this.container),
//             this.dropdown = this.container.find("div.chosen-drop").first(),
//             this.search_field = this.container.find("input").first(),
//             this.search_results = this.container.find("ul.chosen-results").first(),
//             this.search_field_scale(),
//             this.search_no_results = this.container.find("li.no-results").first(),
//             this.is_multiple ? (this.search_choices = this.container.find("ul.chosen-choices").first(),
//             this.search_container = this.container.find("li.search-field").first()) : (this.search_container = this.container.find("div.chosen-search").first(),
//             this.selected_item = this.container.find(".chosen-single").first()),
//             this.results_build(),
//             this.set_tab_index(),
//             this.set_label_behavior()
//         }
//         ,
//         Chosen.prototype.on_ready = function() {
//             return this.form_field_jq.trigger("chosen:ready", {
//                 chosen: this
//             })
//         }
//         ,
//         Chosen.prototype.register_observers = function() {
//             var a = this;
//             return this.container.bind("touchstart.chosen", function(b) {
//                 return a.container_mousedown(b),
//                 b.preventDefault()
//             }),
//             this.container.bind("touchend.chosen", function(b) {
//                 return a.container_mouseup(b),
//                 b.preventDefault()
//             }),
//             this.container.bind("mousedown.chosen", function(b) {
//                 a.container_mousedown(b)
//             }),
//             this.container.bind("mouseup.chosen", function(b) {
//                 a.container_mouseup(b)
//             }),
//             this.container.bind("mouseenter.chosen", function(b) {
//                 a.mouse_enter(b)
//             }),
//             this.container.bind("mouseleave.chosen", function(b) {
//                 a.mouse_leave(b)
//             }),
//             this.search_results.bind("mouseup.chosen", function(b) {
//                 a.search_results_mouseup(b)
//             }),
//             this.search_results.bind("mouseover.chosen", function(b) {
//                 a.search_results_mouseover(b)
//             }),
//             this.search_results.bind("mouseout.chosen", function(b) {
//                 a.search_results_mouseout(b)
//             }),
//             this.search_results.bind("mousewheel.chosen DOMMouseScroll.chosen", function(b) {
//                 a.search_results_mousewheel(b)
//             }),
//             this.search_results.bind("touchstart.chosen", function(b) {
//                 a.search_results_touchstart(b)
//             }),
//             this.search_results.bind("touchmove.chosen", function(b) {
//                 a.search_results_touchmove(b)
//             }),
//             this.search_results.bind("touchend.chosen", function(b) {
//                 a.search_results_touchend(b)
//             }),
//             this.form_field_jq.bind("chosen:updated.chosen", function(b) {
//                 a.results_update_field(b)
//             }),
//             this.form_field_jq.bind("chosen:activate.chosen", function(b) {
//                 a.activate_field(b)
//             }),
//             this.form_field_jq.bind("chosen:open.chosen", function(b) {
//                 a.container_mousedown(b)
//             }),
//             this.form_field_jq.bind("chosen:close.chosen", function(b) {
//                 a.input_blur(b)
//             }),
//             this.search_field.bind("blur.chosen", function(b) {
//                 a.input_blur(b)
//             }),
//             this.search_field.bind("keyup.chosen", function(b) {
//                 a.keyup_checker(b)
//             }),
//             this.search_field.bind("keydown.chosen", function(b) {
//                 a.keydown_checker(b)
//             }),
//             this.search_field.bind("focus.chosen", function(b) {
//                 a.input_focus(b)
//             }),
//             this.search_field.bind("cut.chosen", function(b) {
//                 a.clipboard_event_checker(b)
//             }),
//             this.search_field.bind("paste.chosen", function(b) {
//                 a.clipboard_event_checker(b)
//             }),
//             this.is_multiple ? this.search_choices.bind("click.chosen", function(b) {
//                 a.choices_click(b)
//             }) : this.container.bind("click.chosen", function(a) {
//                 a.preventDefault()
//             })
//         }
//         ,
//         Chosen.prototype.destroy = function() {
//             return a(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action),
//             this.search_field[0].tabIndex && (this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex),
//             this.container.remove(),
//             this.form_field_jq.removeData("chosen"),
//             this.form_field_jq.show()
//         }
//         ,
//         Chosen.prototype.search_field_disabled = function() {
//             return this.is_disabled = this.form_field_jq[0].disabled,
//             this.is_disabled ? (this.container.addClass("chosen-disabled"),
//             this.search_field[0].disabled = !0,
//             this.is_multiple || this.selected_item.unbind("focus.chosen", this.activate_action),
//             this.close_field()) : (this.container.removeClass("chosen-disabled"),
//             this.search_field[0].disabled = !1,
//             this.is_multiple ? void 0 : this.selected_item.bind("focus.chosen", this.activate_action))
//         }
//         ,
//         Chosen.prototype.container_mousedown = function(b) {
//             return this.is_disabled || (b && "mousedown" === b.type && !this.results_showing && b.preventDefault(),
//             null != b && a(b.target).hasClass("search-choice-close")) ? void 0 : (this.active_field ? this.is_multiple || !b || a(b.target)[0] !== this.selected_item[0] && !a(b.target).parents("a.chosen-single").length || (b.preventDefault(),
//             this.results_toggle()) : (this.is_multiple && this.search_field.val(""),
//             a(this.container[0].ownerDocument).bind("click.chosen", this.click_test_action),
//             this.results_show()),
//             this.activate_field())
//         }
//         ,
//         Chosen.prototype.container_mouseup = function(a) {
//             return "ABBR" !== a.target.nodeName || this.is_disabled ? void 0 : this.results_reset(a)
//         }
//         ,
//         Chosen.prototype.search_results_mousewheel = function(a) {
//             var b;
//             return a.originalEvent && (b = a.originalEvent.deltaY || -a.originalEvent.wheelDelta || a.originalEvent.detail),
//             null != b ? (a.preventDefault(),
//             "DOMMouseScroll" === a.type && (b = 40 * b),
//             this.search_results.scrollTop(b + this.search_results.scrollTop())) : void 0
//         }
//         ,
//         Chosen.prototype.blur_test = function() {
//             return !this.active_field && this.container.hasClass("chosen-container-active") ? this.close_field() : void 0
//         }
//         ,
//         Chosen.prototype.close_field = function() {
//             return a(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action),
//             this.active_field = !1,
//             this.results_hide(),
//             this.container.removeClass("chosen-container-active"),
//             this.clear_backstroke(),
//             this.show_search_field_default(),
//             this.search_field_scale()
//         }
//         ,
//         Chosen.prototype.activate_field = function() {
//             return this.container.addClass("chosen-container-active"),
//             this.active_field = !0,
//             this.search_field.val(this.search_field.val()),
//             this.search_field.focus()
//         }
//         ,
//         Chosen.prototype.test_active_click = function(b) {
//             var c;
//             return c = a(b.target).closest(".chosen-container"),
//             c.length && this.container[0] === c[0] ? this.active_field = !0 : this.close_field()
//         }
//         ,
//         Chosen.prototype.results_build = function() {
//             return this.parsing = !0,
//             this.selected_option_count = null ,
//             this.results_data = SelectParser.select_to_array(this.form_field),
//             this.is_multiple ? this.search_choices.find("li.search-choice").remove() : this.is_multiple || (this.single_set_selected_text(),
//             this.disable_search || this.form_field.options.length <= this.disable_search_threshold ? (this.search_field[0].readOnly = !0,
//             this.container.addClass("chosen-container-single-nosearch")) : (this.search_field[0].readOnly = !1,
//             this.container.removeClass("chosen-container-single-nosearch"))),
//             this.update_results_content(this.results_option_build({
//                 first: !0
//             })),
//             this.search_field_disabled(),
//             this.show_search_field_default(),
//             this.search_field_scale(),
//             this.parsing = !1
//         }
//         ,
//         Chosen.prototype.result_do_highlight = function(a) {
//             var b, c, d, e, f;
//             if (a.length) {
//                 if (this.result_clear_highlight(),
//                 this.result_highlight = a,
//                 this.result_highlight.addClass("highlighted"),
//                 d = parseInt(this.search_results.css("maxHeight"), 10),
//                 f = this.search_results.scrollTop(),
//                 e = d + f,
//                 c = this.result_highlight.position().top + this.search_results.scrollTop(),
//                 b = c + this.result_highlight.outerHeight(),
//                 b >= e)
//                     return this.search_results.scrollTop(b - d > 0 ? b - d : 0);
//                 if (f > c)
//                     return this.search_results.scrollTop(c)
//             }
//         }
//         ,
//         Chosen.prototype.result_clear_highlight = function() {
//             return this.result_highlight && this.result_highlight.removeClass("highlighted"),
//             this.result_highlight = null
//         }
//         ,
//         Chosen.prototype.results_show = function() {
//             return this.is_multiple && this.max_selected_options <= this.choices_count() ? (this.form_field_jq.trigger("chosen:maxselected", {
//                 chosen: this
//             }),
//             !1) : (this.container.addClass("chosen-with-drop"),
//             this.results_showing = !0,
//             this.search_field.focus(),
//             this.search_field.val(this.search_field.val()),
//             this.winnow_results(),
//             this.form_field_jq.trigger("chosen:showing_dropdown", {
//                 chosen: this
//             }))
//         }
//         ,
//         Chosen.prototype.update_results_content = function(a) {
//             return this.search_results.html(a)
//         }
//         ,
//         Chosen.prototype.results_hide = function() {
//             return this.results_showing && (this.result_clear_highlight(),
//             this.container.removeClass("chosen-with-drop"),
//             this.form_field_jq.trigger("chosen:hiding_dropdown", {
//                 chosen: this
//             })),
//             this.results_showing = !1
//         }
//         ,
//         Chosen.prototype.set_tab_index = function() {
//             var a;
//             return this.form_field.tabIndex ? (a = this.form_field.tabIndex,
//             this.form_field.tabIndex = -1,
//             this.search_field[0].tabIndex = a) : void 0
//         }
//         ,
//         Chosen.prototype.set_label_behavior = function() {
//             var b = this;
//             return this.form_field_label = this.form_field_jq.parents("label"),
//             !this.form_field_label.length && this.form_field.id.length && (this.form_field_label = a("label[for='" + this.form_field.id + "']")),
//             this.form_field_label.length > 0 ? this.form_field_label.bind("click.chosen", function(a) {
//                 return b.is_multiple ? b.container_mousedown(a) : b.activate_field()
//             }) : void 0
//         }
//         ,
//         Chosen.prototype.show_search_field_default = function() {
//             return this.is_multiple && this.choices_count() < 1 && !this.active_field ? (this.search_field.val(this.default_text),
//             this.search_field.addClass("default")) : (this.search_field.val(""),
//             this.search_field.removeClass("default"))
//         }
//         ,
//         Chosen.prototype.search_results_mouseup = function(b) {
//             var c;
//             return c = a(b.target).hasClass("active-result") ? a(b.target) : a(b.target).parents(".active-result").first(),
//             c.length ? (this.result_highlight = c,
//             this.result_select(b),
//             this.search_field.focus()) : void 0
//         }
//         ,
//         Chosen.prototype.search_results_mouseover = function(b) {
//             var c;
//             return c = a(b.target).hasClass("active-result") ? a(b.target) : a(b.target).parents(".active-result").first(),
//             c ? this.result_do_highlight(c) : void 0
//         }
//         ,
//         Chosen.prototype.search_results_mouseout = function(b) {
//             return a(b.target).hasClass("active-result") ? this.result_clear_highlight() : void 0
//         }
//         ,
//         Chosen.prototype.choice_build = function(b) {
//             var c, d, e = this;
//             return c = a("<li />", {
//                 "class": "search-choice"
//             }).html("<span>" + this.choice_label(b) + "</span>"),
//             b.disabled ? c.addClass("search-choice-disabled") : (d = a("<a />", {
//                 "class": "search-choice-close",
//                 "data-option-array-index": b.array_index
//             }),
//             d.bind("click.chosen", function(a) {
//                 return e.choice_destroy_link_click(a)
//             }),
//             c.append(d)),
//             this.search_container.before(c)
//         }
//         ,
//         Chosen.prototype.choice_destroy_link_click = function(b) {
//             return b.preventDefault(),
//             b.stopPropagation(),
//             this.is_disabled ? void 0 : this.choice_destroy(a(b.target))
//         }
//         ,
//         Chosen.prototype.choice_destroy = function(a) {
//             return this.result_deselect(a[0].getAttribute("data-option-array-index")) ? (this.show_search_field_default(),
//             this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1 && this.results_hide(),
//             a.parents("li").first().remove(),
//             this.search_field_scale()) : void 0
//         }
//         ,
//         Chosen.prototype.results_reset = function() {
//             return this.reset_single_select_options(),
//             this.form_field.options[0].selected = !0,
//             this.single_set_selected_text(),
//             this.show_search_field_default(),
//             this.results_reset_cleanup(),
//             this.form_field_jq.trigger("change"),
//             this.active_field ? this.results_hide() : void 0
//         }
//         ,
//         Chosen.prototype.results_reset_cleanup = function() {
//             return this.current_selectedIndex = this.form_field.selectedIndex,
//             this.selected_item.find("abbr").remove()
//         }
//         ,
//         Chosen.prototype.result_select = function(a) {
//             var b, c;
//             return this.result_highlight ? (b = this.result_highlight,
//             this.result_clear_highlight(),
//             this.is_multiple && this.max_selected_options <= this.choices_count() ? (this.form_field_jq.trigger("chosen:maxselected", {
//                 chosen: this
//             }),
//             !1) : (this.is_multiple ? b.removeClass("active-result") : this.reset_single_select_options(),
//             b.addClass("result-selected"),
//             c = this.results_data[b[0].getAttribute("data-option-array-index")],
//             c.selected = !0,
//             this.form_field.options[c.options_index].selected = !0,
//             this.selected_option_count = null ,
//             this.is_multiple ? this.choice_build(c) : this.single_set_selected_text(this.choice_label(c)),
//             (a.metaKey || a.ctrlKey) && this.is_multiple || this.results_hide(),
//             this.search_field.val(""),
//             (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) && this.form_field_jq.trigger("change", {
//                 selected: this.form_field.options[c.options_index].value
//             }),
//             this.current_selectedIndex = this.form_field.selectedIndex,
//             a.preventDefault(),
//             this.search_field_scale())) : void 0
//         }
//         ,
//         Chosen.prototype.single_set_selected_text = function(a) {
//             return null == a && (a = this.default_text),
//             a === this.default_text ? this.selected_item.addClass("chosen-default") : (this.single_deselect_control_build(),
//             this.selected_item.removeClass("chosen-default")),
//             this.selected_item.find("span").html(a)
//         }
//         ,
//         Chosen.prototype.result_deselect = function(a) {
//             var b;
//             return b = this.results_data[a],
//             this.form_field.options[b.options_index].disabled ? !1 : (b.selected = !1,
//             this.form_field.options[b.options_index].selected = !1,
//             this.selected_option_count = null ,
//             this.result_clear_highlight(),
//             this.results_showing && this.winnow_results(),
//             this.form_field_jq.trigger("change", {
//                 deselected: this.form_field.options[b.options_index].value
//             }),
//             this.search_field_scale(),
//             !0)
//         }
//         ,
//         Chosen.prototype.single_deselect_control_build = function() {
//             return this.allow_single_deselect ? (this.selected_item.find("abbr").length || this.selected_item.find("span").first().after('<abbr class="search-choice-close"></abbr>'),
//             this.selected_item.addClass("chosen-single-with-deselect")) : void 0
//         }
//         ,
//         Chosen.prototype.get_search_text = function() {
//             return a("<div/>").text(a.trim(this.search_field.val())).html()
//         }
//         ,
//         Chosen.prototype.winnow_results_set_highlight = function() {
//             var a, b;
//             return b = this.is_multiple ? [] : this.search_results.find(".result-selected.active-result"),
//             a = b.length ? b.first() : this.search_results.find(".active-result").first(),
//             null != a ? this.result_do_highlight(a) : void 0
//         }
//         ,
//         Chosen.prototype.no_results = function(b) {
//             var c;
//             return c = a('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>'),
//             c.find("span").first().html(b),
//             this.search_results.append(c),
//             this.form_field_jq.trigger("chosen:no_results", {
//                 chosen: this
//             })
//         }
//         ,
//         Chosen.prototype.no_results_clear = function() {
//             return this.search_results.find(".no-results").remove()
//         }
//         ,
//         Chosen.prototype.keydown_arrow = function() {
//             var a;
//             return this.results_showing && this.result_highlight ? (a = this.result_highlight.nextAll("li.active-result").first()) ? this.result_do_highlight(a) : void 0 : this.results_show()
//         }
//         ,
//         Chosen.prototype.keyup_arrow = function() {
//             var a;
//             return this.results_showing || this.is_multiple ? this.result_highlight ? (a = this.result_highlight.prevAll("li.active-result"),
//             a.length ? this.result_do_highlight(a.first()) : (this.choices_count() > 0 && this.results_hide(),
//             this.result_clear_highlight())) : void 0 : this.results_show()
//         }
//         ,
//         Chosen.prototype.keydown_backstroke = function() {
//             var a;
//             return this.pending_backstroke ? (this.choice_destroy(this.pending_backstroke.find("a").first()),
//             this.clear_backstroke()) : (a = this.search_container.siblings("li.search-choice").last(),
//             a.length && !a.hasClass("search-choice-disabled") ? (this.pending_backstroke = a,
//             this.single_backstroke_delete ? this.keydown_backstroke() : this.pending_backstroke.addClass("search-choice-focus")) : void 0)
//         }
//         ,
//         Chosen.prototype.clear_backstroke = function() {
//             return this.pending_backstroke && this.pending_backstroke.removeClass("search-choice-focus"),
//             this.pending_backstroke = null
//         }
//         ,
//         Chosen.prototype.keydown_checker = function(a) {
//             var b, c;
//             switch (b = null != (c = a.which) ? c : a.keyCode,
//             this.search_field_scale(),
//             8 !== b && this.pending_backstroke && this.clear_backstroke(),
//             b) {
//             case 8:
//                 this.backstroke_length = this.search_field.val().length;
//                 break;
//             case 9:
//                 this.results_showing && !this.is_multiple && this.result_select(a),
//                 this.mouse_on_container = !1;
//                 break;
//             case 13:
//                 this.results_showing && a.preventDefault();
//                 break;
//             case 32:
//                 this.disable_search && a.preventDefault();
//                 break;
//             case 38:
//                 a.preventDefault(),
//                 this.keyup_arrow();
//                 break;
//             case 40:
//                 a.preventDefault(),
//                 this.keydown_arrow()
//             }
//         }
//         ,
//         Chosen.prototype.search_field_scale = function() {
//             var b, c, d, e, f, g, h, i, j;
//             if (this.is_multiple) {
//                 for (d = 0,
//                 h = 0,
//                 f = "position:absolute; left: -1000px; top: -1000px; display:none;",
//                 g = ["font-size", "font-style", "font-weight", "font-family", "line-height", "text-transform", "letter-spacing"],
//                 i = 0,
//                 j = g.length; j > i; i++)
//                     e = g[i],
//                     f += e + ":" + this.search_field.css(e) + ";";
//                 return b = a("<div />", {
//                     style: f
//                 }),
//                 b.text(this.search_field.val()),
//                 a("body").append(b),
//                 h = b.width() + 25,
//                 b.remove(),
//                 c = this.container.outerWidth(),
//                 h > c - 10 && (h = c - 10),
//                 this.search_field.css({
//                     width: h + "px"
//                 })
//             }
//         }
//         ,
//         Chosen
//     }(AbstractChosen)
// }
// ).call(this);
// ;/* Chosen v1.4.2 | (c) 2011-2015 by Harvest | MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md */
// (function() {
//     var AbstractChosen, SelectParser, a, b = {}.hasOwnProperty, c = function(a, c) {
//         function d() {
//             this.constructor = a
//         }
//         for (var e in c)
//             b.call(c, e) && (a[e] = c[e]);
//         return d.prototype = c.prototype,
//         a.prototype = new d,
//         a.__super__ = c.prototype,
//         a
//     }
//     ;
//     SelectParser = function() {
//         function SelectParser() {
//             this.options_index = 0,
//             this.parsed = []
//         }
//         return SelectParser.prototype.add_node = function(a) {
//             return "OPTGROUP" === a.nodeName.toUpperCase() ? this.add_group(a) : this.add_option(a)
//         }
//         ,
//         SelectParser.prototype.add_group = function(a) {
//             var b, c, d, e, f, g;
//             for (b = this.parsed.length,
//             this.parsed.push({
//                 array_index: b,
//                 group: !0,
//                 label: this.escapeExpression(a.label),
//                 title: a.title ? a.title : void 0,
//                 children: 0,
//                 disabled: a.disabled,
//                 classes: a.className
//             }),
//             f = a.childNodes,
//             g = [],
//             d = 0,
//             e = f.length; e > d; d++)
//                 c = f[d],
//                 g.push(this.add_option(c, b, a.disabled));
//             return g
//         }
//         ,
//         SelectParser.prototype.add_option = function(a, b, c) {
//             return "OPTION" === a.nodeName.toUpperCase() ? ("" !== a.text ? (null != b && (this.parsed[b].children += 1),
//             this.parsed.push({
//                 array_index: this.parsed.length,
//                 options_index: this.options_index,
//                 value: a.value,
//                 text: a.text,
//                 html: a.innerHTML,
//                 title: a.title ? a.title : void 0,
//                 selected: a.selected,
//                 disabled: c === !0 ? c : a.disabled,
//                 group_array_index: b,
//                 group_label: null != b ? this.parsed[b].label : null ,
//                 classes: a.className,
//                 style: a.style.cssText
//             })) : this.parsed.push({
//                 array_index: this.parsed.length,
//                 options_index: this.options_index,
//                 empty: !0
//             }),
//             this.options_index += 1) : void 0
//         }
//         ,
//         SelectParser.prototype.escapeExpression = function(a) {
//             var b, c;
//             return null == a || a === !1 ? "" : /[\&\<\>\"\'\`]/.test(a) ? (b = {
//                 "<": "&lt;",
//                 ">": "&gt;",
//                 '"': "&quot;",
//                 "'": "&#x27;",
//                 "`": "&#x60;"
//             },
//             c = /&(?!\w+;)|[\<\>\"\'\`]/g,
//             a.replace(c, function(a) {
//                 return b[a] || "&amp;"
//             })) : a
//         }
//         ,
//         SelectParser
//     }(),
//     SelectParser.select_to_array = function(a) {
//         var b, c, d, e, f;
//         for (c = new SelectParser,
//         f = a.childNodes,
//         d = 0,
//         e = f.length; e > d; d++)
//             b = f[d],
//             c.add_node(b);
//         return c.parsed
//     }
//     ,
//     AbstractChosen = function() {
//         function AbstractChosen(a, b) {
//             this.form_field = a,
//             this.options = null != b ? b : {},
//             AbstractChosen.browser_is_supported() && (this.is_multiple = this.form_field.multiple,
//             this.set_default_text(),
//             this.set_default_values(),
//             this.setup(),
//             this.set_up_html(),
//             this.register_observers(),
//             this.on_ready())
//         }
//         return AbstractChosen.prototype.set_default_values = function() {
//             var a = this;
//             return this.click_test_action = function(b) {
//                 return a.test_active_click(b)
//             }
//             ,
//             this.activate_action = function(b) {
//                 return a.activate_field(b)
//             }
//             ,
//             this.active_field = !1,
//             this.mouse_on_container = !1,
//             this.results_showing = !1,
//             this.result_highlighted = null ,
//             this.allow_single_deselect = null != this.options.allow_single_deselect && null != this.form_field.options[0] && "" === this.form_field.options[0].text ? this.options.allow_single_deselect : !1,
//             this.disable_search_threshold = this.options.disable_search_threshold || 0,
//             this.disable_search = this.options.disable_search || !1,
//             this.enable_split_word_search = null != this.options.enable_split_word_search ? this.options.enable_split_word_search : !0,
//             this.group_search = null != this.options.group_search ? this.options.group_search : !0,
//             this.search_contains = this.options.search_contains || !1,
//             this.single_backstroke_delete = null != this.options.single_backstroke_delete ? this.options.single_backstroke_delete : !0,
//             this.max_selected_options = this.options.max_selected_options || 1 / 0,
//             this.inherit_select_classes = this.options.inherit_select_classes || !1,
//             this.display_selected_options = null != this.options.display_selected_options ? this.options.display_selected_options : !0,
//             this.display_disabled_options = null != this.options.display_disabled_options ? this.options.display_disabled_options : !0,
//             this.include_group_label_in_selected = this.options.include_group_label_in_selected || !1
//         }
//         ,
//         AbstractChosen.prototype.set_default_text = function() {
//             return this.default_text = this.form_field.getAttribute("data-placeholder") ? this.form_field.getAttribute("data-placeholder") : this.is_multiple ? this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text : this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text,
//             this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text
//         }
//         ,
//         AbstractChosen.prototype.choice_label = function(a) {
//             return this.include_group_label_in_selected && null != a.group_label ? "<b class='group-name'>" + a.group_label + "</b>" + a.html : a.html
//         }
//         ,
//         AbstractChosen.prototype.mouse_enter = function() {
//             return this.mouse_on_container = !0
//         }
//         ,
//         AbstractChosen.prototype.mouse_leave = function() {
//             return this.mouse_on_container = !1
//         }
//         ,
//         AbstractChosen.prototype.input_focus = function() {
//             var a = this;
//             if (this.is_multiple) {
//                 if (!this.active_field)
//                     return setTimeout(function() {
//                         return a.container_mousedown()
//                     }, 50)
//             } else if (!this.active_field)
//                 return this.activate_field()
//         }
//         ,
//         AbstractChosen.prototype.input_blur = function() {
//             var a = this;
//             return this.mouse_on_container ? void 0 : (this.active_field = !1,
//             setTimeout(function() {
//                 return a.blur_test()
//             }, 100))
//         }
//         ,
//         AbstractChosen.prototype.results_option_build = function(a) {
//             var b, c, d, e, f;
//             for (b = "",
//             f = this.results_data,
//             d = 0,
//             e = f.length; e > d; d++)
//                 c = f[d],
//                 b += c.group ? this.result_add_group(c) : this.result_add_option(c),
//                 (null != a ? a.first : void 0) && (c.selected && this.is_multiple ? this.choice_build(c) : c.selected && !this.is_multiple && this.single_set_selected_text(this.choice_label(c)));
//             return b
//         }
//         ,
//         AbstractChosen.prototype.result_add_option = function(a) {
//             var b, c;
//             return a.search_match ? this.include_option_in_results(a) ? (b = [],
//             a.disabled || a.selected && this.is_multiple || b.push("active-result"),
//             !a.disabled || a.selected && this.is_multiple || b.push("disabled-result"),
//             a.selected && b.push("result-selected"),
//             null != a.group_array_index && b.push("group-option"),
//             "" !== a.classes && b.push(a.classes),
//             c = document.createElement("li"),
//             c.className = b.join(" "),
//             c.style.cssText = a.style,
//             c.setAttribute("data-option-array-index", a.array_index),
//             c.innerHTML = a.search_text,
//             a.title && (c.title = a.title),
//             this.outerHTML(c)) : "" : ""
//         }
//         ,
//         AbstractChosen.prototype.result_add_group = function(a) {
//             var b, c;
//             return a.search_match || a.group_match ? a.active_options > 0 ? (b = [],
//             b.push("group-result"),
//             a.classes && b.push(a.classes),
//             c = document.createElement("li"),
//             c.className = b.join(" "),
//             c.innerHTML = a.search_text,
//             a.title && (c.title = a.title),
//             this.outerHTML(c)) : "" : ""
//         }
//         ,
//         AbstractChosen.prototype.results_update_field = function() {
//             return this.set_default_text(),
//             this.is_multiple || this.results_reset_cleanup(),
//             this.result_clear_highlight(),
//             this.results_build(),
//             this.results_showing ? this.winnow_results() : void 0
//         }
//         ,
//         AbstractChosen.prototype.reset_single_select_options = function() {
//             var a, b, c, d, e;
//             for (d = this.results_data,
//             e = [],
//             b = 0,
//             c = d.length; c > b; b++)
//                 a = d[b],
//                 a.selected ? e.push(a.selected = !1) : e.push(void 0);
//             return e
//         }
//         ,
//         AbstractChosen.prototype.results_toggle = function() {
//             return this.results_showing ? this.results_hide() : this.results_show()
//         }
//         ,
//         AbstractChosen.prototype.results_search = function() {
//             return this.results_showing ? this.winnow_results() : this.results_show()
//         }
//         ,
//         AbstractChosen.prototype.winnow_results = function() {
//             var a, b, c, d, e, f, g, h, i, j, k, l;
//             for (this.no_results_clear(),
//             d = 0,
//             f = this.get_search_text(),
//             a = f.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
//             i = new RegExp(a,"i"),
//             c = this.get_search_regex(a),
//             l = this.results_data,
//             j = 0,
//             k = l.length; k > j; j++)
//                 b = l[j],
//                 b.search_match = !1,
//                 e = null ,
//                 this.include_option_in_results(b) && (b.group && (b.group_match = !1,
//                 b.active_options = 0),
//                 null != b.group_array_index && this.results_data[b.group_array_index] && (e = this.results_data[b.group_array_index],
//                 0 === e.active_options && e.search_match && (d += 1),
//                 e.active_options += 1),
//                 b.search_text = b.group ? b.label : b.html,
//                 (!b.group || this.group_search) && (b.search_match = this.search_string_match(b.search_text, c),
//                 b.search_match && !b.group && (d += 1),
//                 b.search_match ? (f.length && (g = b.search_text.search(i),
//                 h = b.search_text.substr(0, g + f.length) + "</em>" + b.search_text.substr(g + f.length),
//                 b.search_text = h.substr(0, g) + "<em>" + h.substr(g)),
//                 null != e && (e.group_match = !0)) : null != b.group_array_index && this.results_data[b.group_array_index].search_match && (b.search_match = !0)));
//             return this.result_clear_highlight(),
//             1 > d && f.length ? (this.update_results_content(""),
//             this.no_results(f)) : (this.update_results_content(this.results_option_build()),
//             this.winnow_results_set_highlight())
//         }
//         ,
//         AbstractChosen.prototype.get_search_regex = function(a) {
//             var b;
//             return b = this.search_contains ? "" : "^",
//             new RegExp(b + a,"i")
//         }
//         ,
//         AbstractChosen.prototype.search_string_match = function(a, b) {
//             var c, d, e, f;
//             if (b.test(a))
//                 return !0;
//             if (this.enable_split_word_search && (a.indexOf(" ") >= 0 || 0 === a.indexOf("[")) && (d = a.replace(/\[|\]/g, "").split(" "),
//             d.length))
//                 for (e = 0,
//                 f = d.length; f > e; e++)
//                     if (c = d[e],
//                     b.test(c))
//                         return !0
//         }
//         ,
//         AbstractChosen.prototype.choices_count = function() {
//             var a, b, c, d;
//             if (null != this.selected_option_count)
//                 return this.selected_option_count;
//             for (this.selected_option_count = 0,
//             d = this.form_field.options,
//             b = 0,
//             c = d.length; c > b; b++)
//                 a = d[b],
//                 a.selected && (this.selected_option_count += 1);
//             return this.selected_option_count
//         }
//         ,
//         AbstractChosen.prototype.choices_click = function(a) {
//             return a.preventDefault(),
//             this.results_showing || this.is_disabled ? void 0 : this.results_show()
//         }
//         ,
//         AbstractChosen.prototype.keyup_checker = function(a) {
//             var b, c;
//             switch (b = null != (c = a.which) ? c : a.keyCode,
//             this.search_field_scale(),
//             b) {
//             case 8:
//                 if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0)
//                     return this.keydown_backstroke();
//                 if (!this.pending_backstroke)
//                     return this.result_clear_highlight(),
//                     this.results_search();
//                 break;
//             case 13:
//                 if (a.preventDefault(),
//                 this.results_showing)
//                     return this.result_select(a);
//                 break;
//             case 27:
//                 return this.results_showing && this.results_hide(),
//                 !0;
//             case 9:
//             case 38:
//             case 40:
//             case 16:
//             case 91:
//             case 17:
//                 break;
//             default:
//                 return this.results_search()
//             }
//         }
//         ,
//         AbstractChosen.prototype.clipboard_event_checker = function() {
//             var a = this;
//             return setTimeout(function() {
//                 return a.results_search()
//             }, 50)
//         }
//         ,
//         AbstractChosen.prototype.container_width = function() {
//             return null != this.options.width ? this.options.width : "" + this.form_field.offsetWidth + "px"
//         }
//         ,
//         AbstractChosen.prototype.include_option_in_results = function(a) {
//             return this.is_multiple && !this.display_selected_options && a.selected ? !1 : !this.display_disabled_options && a.disabled ? !1 : a.empty ? !1 : !0
//         }
//         ,
//         AbstractChosen.prototype.search_results_touchstart = function(a) {
//             return this.touch_started = !0,
//             this.search_results_mouseover(a)
//         }
//         ,
//         AbstractChosen.prototype.search_results_touchmove = function(a) {
//             return this.touch_started = !1,
//             this.search_results_mouseout(a)
//         }
//         ,
//         AbstractChosen.prototype.search_results_touchend = function(a) {
//             return this.touch_started ? this.search_results_mouseup(a) : void 0
//         }
//         ,
//         AbstractChosen.prototype.outerHTML = function(a) {
//             var b;
//             return a.outerHTML ? a.outerHTML : (b = document.createElement("div"),
//             b.appendChild(a),
//             b.innerHTML)
//         }
//         ,
//         AbstractChosen.browser_is_supported = function() {
//             return "Microsoft Internet Explorer" === window.navigator.appName ? document.documentMode >= 8 : /iP(od|hone)/i.test(window.navigator.userAgent) ? !1 : /Android/i.test(window.navigator.userAgent) && /Mobile/i.test(window.navigator.userAgent) ? !1 : !0
//         }
//         ,
//         AbstractChosen.default_multiple_text = "Select Some Options",
//         AbstractChosen.default_single_text = "Select an Option",
//         AbstractChosen.default_no_result_text = "No results match",
//         AbstractChosen
//     }(),
//     this.Chosen = function(b) {
//         function Chosen() {
//             return a = Chosen.__super__.constructor.apply(this, arguments)
//         }
//         return c(Chosen, b),
//         Chosen.prototype.setup = function() {
//             return this.current_selectedIndex = this.form_field.selectedIndex,
//             this.is_rtl = this.form_field.hasClassName("chosen-rtl")
//         }
//         ,
//         Chosen.prototype.set_default_values = function() {
//             return Chosen.__super__.set_default_values.call(this),
//             this.single_temp = new Template('<a class="chosen-single chosen-default" tabindex="-1"><span>#{default}</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>'),
//             this.multi_temp = new Template('<ul class="chosen-choices"><li class="search-field"><input type="text" value="#{default}" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>'),
//             this.no_results_temp = new Template('<li class="no-results">' + this.results_none_found + ' "<span>#{terms}</span>"</li>')
//         }
//         ,
//         Chosen.prototype.set_up_html = function() {
//             var a, b;
//             return a = ["chosen-container"],
//             a.push("chosen-container-" + (this.is_multiple ? "multi" : "single")),
//             this.inherit_select_classes && this.form_field.className && a.push(this.form_field.className),
//             this.is_rtl && a.push("chosen-rtl"),
//             b = {
//                 "class": a.join(" "),
//                 style: "width: " + this.container_width() + ";",
//                 title: this.form_field.title
//             },
//             this.form_field.id.length && (b.id = this.form_field.id.replace(/[^\w]/g, "_") + "_chosen"),
//             this.container = this.is_multiple ? new Element("div",b).update(this.multi_temp.evaluate({
//                 "default": this.default_text
//             })) : new Element("div",b).update(this.single_temp.evaluate({
//                 "default": this.default_text
//             })),
//             this.form_field.hide().insert({
//                 after: this.container
//             }),
//             this.dropdown = this.container.down("div.chosen-drop"),
//             this.search_field = this.container.down("input"),
//             this.search_results = this.container.down("ul.chosen-results"),
//             this.search_field_scale(),
//             this.search_no_results = this.container.down("li.no-results"),
//             this.is_multiple ? (this.search_choices = this.container.down("ul.chosen-choices"),
//             this.search_container = this.container.down("li.search-field")) : (this.search_container = this.container.down("div.chosen-search"),
//             this.selected_item = this.container.down(".chosen-single")),
//             this.results_build(),
//             this.set_tab_index(),
//             this.set_label_behavior()
//         }
//         ,
//         Chosen.prototype.on_ready = function() {
//             return this.form_field.fire("chosen:ready", {
//                 chosen: this
//             })
//         }
//         ,
//         Chosen.prototype.register_observers = function() {
//             var a = this;
//             return this.container.observe("touchstart", function(b) {
//                 return a.container_mousedown(b),
//                 b.preventDefault()
//             }),
//             this.container.observe("touchend", function(b) {
//                 return a.container_mouseup(b),
//                 b.preventDefault()
//             }),
//             this.container.observe("mousedown", function(b) {
//                 return a.container_mousedown(b)
//             }),
//             this.container.observe("mouseup", function(b) {
//                 return a.container_mouseup(b)
//             }),
//             this.container.observe("mouseenter", function(b) {
//                 return a.mouse_enter(b)
//             }),
//             this.container.observe("mouseleave", function(b) {
//                 return a.mouse_leave(b)
//             }),
//             this.search_results.observe("mouseup", function(b) {
//                 return a.search_results_mouseup(b)
//             }),
//             this.search_results.observe("mouseover", function(b) {
//                 return a.search_results_mouseover(b)
//             }),
//             this.search_results.observe("mouseout", function(b) {
//                 return a.search_results_mouseout(b)
//             }),
//             this.search_results.observe("mousewheel", function(b) {
//                 return a.search_results_mousewheel(b)
//             }),
//             this.search_results.observe("DOMMouseScroll", function(b) {
//                 return a.search_results_mousewheel(b)
//             }),
//             this.search_results.observe("touchstart", function(b) {
//                 return a.search_results_touchstart(b)
//             }),
//             this.search_results.observe("touchmove", function(b) {
//                 return a.search_results_touchmove(b)
//             }),
//             this.search_results.observe("touchend", function(b) {
//                 return a.search_results_touchend(b)
//             }),
//             this.form_field.observe("chosen:updated", function(b) {
//                 return a.results_update_field(b)
//             }),
//             this.form_field.observe("chosen:activate", function(b) {
//                 return a.activate_field(b)
//             }),
//             this.form_field.observe("chosen:open", function(b) {
//                 return a.container_mousedown(b)
//             }),
//             this.form_field.observe("chosen:close", function(b) {
//                 return a.input_blur(b)
//             }),
//             this.search_field.observe("blur", function(b) {
//                 return a.input_blur(b)
//             }),
//             this.search_field.observe("keyup", function(b) {
//                 return a.keyup_checker(b)
//             }),
//             this.search_field.observe("keydown", function(b) {
//                 return a.keydown_checker(b)
//             }),
//             this.search_field.observe("focus", function(b) {
//                 return a.input_focus(b)
//             }),
//             this.search_field.observe("cut", function(b) {
//                 return a.clipboard_event_checker(b)
//             }),
//             this.search_field.observe("paste", function(b) {
//                 return a.clipboard_event_checker(b)
//             }),
//             this.is_multiple ? this.search_choices.observe("click", function(b) {
//                 return a.choices_click(b)
//             }) : this.container.observe("click", function(a) {
//                 return a.preventDefault()
//             })
//         }
//         ,
//         Chosen.prototype.destroy = function() {
//             return this.container.ownerDocument.stopObserving("click", this.click_test_action),
//             this.form_field.stopObserving(),
//             this.container.stopObserving(),
//             this.search_results.stopObserving(),
//             this.search_field.stopObserving(),
//             null != this.form_field_label && this.form_field_label.stopObserving(),
//             this.is_multiple ? (this.search_choices.stopObserving(),
//             this.container.select(".search-choice-close").each(function(a) {
//                 return a.stopObserving()
//             })) : this.selected_item.stopObserving(),
//             this.search_field.tabIndex && (this.form_field.tabIndex = this.search_field.tabIndex),
//             this.container.remove(),
//             this.form_field.show()
//         }
//         ,
//         Chosen.prototype.search_field_disabled = function() {
//             return this.is_disabled = this.form_field.disabled,
//             this.is_disabled ? (this.container.addClassName("chosen-disabled"),
//             this.search_field.disabled = !0,
//             this.is_multiple || this.selected_item.stopObserving("focus", this.activate_action),
//             this.close_field()) : (this.container.removeClassName("chosen-disabled"),
//             this.search_field.disabled = !1,
//             this.is_multiple ? void 0 : this.selected_item.observe("focus", this.activate_action))
//         }
//         ,
//         Chosen.prototype.container_mousedown = function(a) {
//             return this.is_disabled || (a && "mousedown" === a.type && !this.results_showing && a.stop(),
//             null != a && a.target.hasClassName("search-choice-close")) ? void 0 : (this.active_field ? this.is_multiple || !a || a.target !== this.selected_item && !a.target.up("a.chosen-single") || this.results_toggle() : (this.is_multiple && this.search_field.clear(),
//             this.container.ownerDocument.observe("click", this.click_test_action),
//             this.results_show()),
//             this.activate_field())
//         }
//         ,
//         Chosen.prototype.container_mouseup = function(a) {
//             return "ABBR" !== a.target.nodeName || this.is_disabled ? void 0 : this.results_reset(a)
//         }
//         ,
//         Chosen.prototype.search_results_mousewheel = function(a) {
//             var b;
//             return b = a.deltaY || -a.wheelDelta || a.detail,
//             null != b ? (a.preventDefault(),
//             "DOMMouseScroll" === a.type && (b = 40 * b),
//             this.search_results.scrollTop = b + this.search_results.scrollTop) : void 0
//         }
//         ,
//         Chosen.prototype.blur_test = function() {
//             return !this.active_field && this.container.hasClassName("chosen-container-active") ? this.close_field() : void 0
//         }
//         ,
//         Chosen.prototype.close_field = function() {
//             return this.container.ownerDocument.stopObserving("click", this.click_test_action),
//             this.active_field = !1,
//             this.results_hide(),
//             this.container.removeClassName("chosen-container-active"),
//             this.clear_backstroke(),
//             this.show_search_field_default(),
//             this.search_field_scale()
//         }
//         ,
//         Chosen.prototype.activate_field = function() {
//             return this.container.addClassName("chosen-container-active"),
//             this.active_field = !0,
//             this.search_field.value = this.search_field.value,
//             this.search_field.focus()
//         }
//         ,
//         Chosen.prototype.test_active_click = function(a) {
//             return a.target.up(".chosen-container") === this.container ? this.active_field = !0 : this.close_field()
//         }
//         ,
//         Chosen.prototype.results_build = function() {
//             return this.parsing = !0,
//             this.selected_option_count = null ,
//             this.results_data = SelectParser.select_to_array(this.form_field),
//             this.is_multiple ? this.search_choices.select("li.search-choice").invoke("remove") : this.is_multiple || (this.single_set_selected_text(),
//             this.disable_search || this.form_field.options.length <= this.disable_search_threshold ? (this.search_field.readOnly = !0,
//             this.container.addClassName("chosen-container-single-nosearch")) : (this.search_field.readOnly = !1,
//             this.container.removeClassName("chosen-container-single-nosearch"))),
//             this.update_results_content(this.results_option_build({
//                 first: !0
//             })),
//             this.search_field_disabled(),
//             this.show_search_field_default(),
//             this.search_field_scale(),
//             this.parsing = !1
//         }
//         ,
//         Chosen.prototype.result_do_highlight = function(a) {
//             var b, c, d, e, f;
//             return this.result_clear_highlight(),
//             this.result_highlight = a,
//             this.result_highlight.addClassName("highlighted"),
//             d = parseInt(this.search_results.getStyle("maxHeight"), 10),
//             f = this.search_results.scrollTop,
//             e = d + f,
//             c = this.result_highlight.positionedOffset().top,
//             b = c + this.result_highlight.getHeight(),
//             b >= e ? this.search_results.scrollTop = b - d > 0 ? b - d : 0 : f > c ? this.search_results.scrollTop = c : void 0
//         }
//         ,
//         Chosen.prototype.result_clear_highlight = function() {
//             return this.result_highlight && this.result_highlight.removeClassName("highlighted"),
//             this.result_highlight = null
//         }
//         ,
//         Chosen.prototype.results_show = function() {
//             return this.is_multiple && this.max_selected_options <= this.choices_count() ? (this.form_field.fire("chosen:maxselected", {
//                 chosen: this
//             }),
//             !1) : (this.container.addClassName("chosen-with-drop"),
//             this.results_showing = !0,
//             this.search_field.focus(),
//             this.search_field.value = this.search_field.value,
//             this.winnow_results(),
//             this.form_field.fire("chosen:showing_dropdown", {
//                 chosen: this
//             }))
//         }
//         ,
//         Chosen.prototype.update_results_content = function(a) {
//             return this.search_results.update(a)
//         }
//         ,
//         Chosen.prototype.results_hide = function() {
//             return this.results_showing && (this.result_clear_highlight(),
//             this.container.removeClassName("chosen-with-drop"),
//             this.form_field.fire("chosen:hiding_dropdown", {
//                 chosen: this
//             })),
//             this.results_showing = !1
//         }
//         ,
//         Chosen.prototype.set_tab_index = function() {
//             var a;
//             return this.form_field.tabIndex ? (a = this.form_field.tabIndex,
//             this.form_field.tabIndex = -1,
//             this.search_field.tabIndex = a) : void 0
//         }
//         ,
//         Chosen.prototype.set_label_behavior = function() {
//             var a = this;
//             return this.form_field_label = this.form_field.up("label"),
//             null == this.form_field_label && (this.form_field_label = $$("label[for='" + this.form_field.id + "']").first()),
//             null != this.form_field_label ? this.form_field_label.observe("click", function(b) {
//                 return a.is_multiple ? a.container_mousedown(b) : a.activate_field()
//             }) : void 0
//         }
//         ,
//         Chosen.prototype.show_search_field_default = function() {
//             return this.is_multiple && this.choices_count() < 1 && !this.active_field ? (this.search_field.value = this.default_text,
//             this.search_field.addClassName("default")) : (this.search_field.value = "",
//             this.search_field.removeClassName("default"))
//         }
//         ,
//         Chosen.prototype.search_results_mouseup = function(a) {
//             var b;
//             return b = a.target.hasClassName("active-result") ? a.target : a.target.up(".active-result"),
//             b ? (this.result_highlight = b,
//             this.result_select(a),
//             this.search_field.focus()) : void 0
//         }
//         ,
//         Chosen.prototype.search_results_mouseover = function(a) {
//             var b;
//             return b = a.target.hasClassName("active-result") ? a.target : a.target.up(".active-result"),
//             b ? this.result_do_highlight(b) : void 0
//         }
//         ,
//         Chosen.prototype.search_results_mouseout = function(a) {
//             return a.target.hasClassName("active-result") || a.target.up(".active-result") ? this.result_clear_highlight() : void 0
//         }
//         ,
//         Chosen.prototype.choice_build = function(a) {
//             var b, c, d = this;
//             return b = new Element("li",{
//                 "class": "search-choice"
//             }).update("<span>" + this.choice_label(a) + "</span>"),
//             a.disabled ? b.addClassName("search-choice-disabled") : (c = new Element("a",{
//                 href: "#",
//                 "class": "search-choice-close",
//                 rel: a.array_index
//             }),
//             c.observe("click", function(a) {
//                 return d.choice_destroy_link_click(a)
//             }),
//             b.insert(c)),
//             this.search_container.insert({
//                 before: b
//             })
//         }
//         ,
//         Chosen.prototype.choice_destroy_link_click = function(a) {
//             return a.preventDefault(),
//             a.stopPropagation(),
//             this.is_disabled ? void 0 : this.choice_destroy(a.target)
//         }
//         ,
//         Chosen.prototype.choice_destroy = function(a) {
//             return this.result_deselect(a.readAttribute("rel")) ? (this.show_search_field_default(),
//             this.is_multiple && this.choices_count() > 0 && this.search_field.value.length < 1 && this.results_hide(),
//             a.up("li").remove(),
//             this.search_field_scale()) : void 0
//         }
//         ,
//         Chosen.prototype.results_reset = function() {
//             return this.reset_single_select_options(),
//             this.form_field.options[0].selected = !0,
//             this.single_set_selected_text(),
//             this.show_search_field_default(),
//             this.results_reset_cleanup(),
//             "function" == typeof Event.simulate && this.form_field.simulate("change"),
//             this.active_field ? this.results_hide() : void 0
//         }
//         ,
//         Chosen.prototype.results_reset_cleanup = function() {
//             var a;
//             return this.current_selectedIndex = this.form_field.selectedIndex,
//             a = this.selected_item.down("abbr"),
//             a ? a.remove() : void 0
//         }
//         ,
//         Chosen.prototype.result_select = function(a) {
//             var b, c;
//             return this.result_highlight ? (b = this.result_highlight,
//             this.result_clear_highlight(),
//             this.is_multiple && this.max_selected_options <= this.choices_count() ? (this.form_field.fire("chosen:maxselected", {
//                 chosen: this
//             }),
//             !1) : (this.is_multiple ? b.removeClassName("active-result") : this.reset_single_select_options(),
//             b.addClassName("result-selected"),
//             c = this.results_data[b.getAttribute("data-option-array-index")],
//             c.selected = !0,
//             this.form_field.options[c.options_index].selected = !0,
//             this.selected_option_count = null ,
//             this.is_multiple ? this.choice_build(c) : this.single_set_selected_text(this.choice_label(c)),
//             (a.metaKey || a.ctrlKey) && this.is_multiple || this.results_hide(),
//             this.search_field.value = "",
//             "function" != typeof Event.simulate || !this.is_multiple && this.form_field.selectedIndex === this.current_selectedIndex || this.form_field.simulate("change"),
//             this.current_selectedIndex = this.form_field.selectedIndex,
//             a.preventDefault(),
//             this.search_field_scale())) : void 0
//         }
//         ,
//         Chosen.prototype.single_set_selected_text = function(a) {
//             return null == a && (a = this.default_text),
//             a === this.default_text ? this.selected_item.addClassName("chosen-default") : (this.single_deselect_control_build(),
//             this.selected_item.removeClassName("chosen-default")),
//             this.selected_item.down("span").update(a)
//         }
//         ,
//         Chosen.prototype.result_deselect = function(a) {
//             var b;
//             return b = this.results_data[a],
//             this.form_field.options[b.options_index].disabled ? !1 : (b.selected = !1,
//             this.form_field.options[b.options_index].selected = !1,
//             this.selected_option_count = null ,
//             this.result_clear_highlight(),
//             this.results_showing && this.winnow_results(),
//             "function" == typeof Event.simulate && this.form_field.simulate("change"),
//             this.search_field_scale(),
//             !0)
//         }
//         ,
//         Chosen.prototype.single_deselect_control_build = function() {
//             return this.allow_single_deselect ? (this.selected_item.down("abbr") || this.selected_item.down("span").insert({
//                 after: '<abbr class="search-choice-close"></abbr>'
//             }),
//             this.selected_item.addClassName("chosen-single-with-deselect")) : void 0
//         }
//         ,
//         Chosen.prototype.get_search_text = function() {
//             return this.search_field.value.strip().escapeHTML()
//         }
//         ,
//         Chosen.prototype.winnow_results_set_highlight = function() {
//             var a;
//             return this.is_multiple || (a = this.search_results.down(".result-selected.active-result")),
//             null == a && (a = this.search_results.down(".active-result")),
//             null != a ? this.result_do_highlight(a) : void 0
//         }
//         ,
//         Chosen.prototype.no_results = function(a) {
//             return this.search_results.insert(this.no_results_temp.evaluate({
//                 terms: a
//             })),
//             this.form_field.fire("chosen:no_results", {
//                 chosen: this
//             })
//         }
//         ,
//         Chosen.prototype.no_results_clear = function() {
//             var a, b;
//             for (a = null ,
//             b = []; a = this.search_results.down(".no-results"); )
//                 b.push(a.remove());
//             return b
//         }
//         ,
//         Chosen.prototype.keydown_arrow = function() {
//             var a;
//             return this.results_showing && this.result_highlight ? (a = this.result_highlight.next(".active-result")) ? this.result_do_highlight(a) : void 0 : this.results_show()
//         }
//         ,
//         Chosen.prototype.keyup_arrow = function() {
//             var a, b, c;
//             return this.results_showing || this.is_multiple ? this.result_highlight ? (c = this.result_highlight.previousSiblings(),
//             a = this.search_results.select("li.active-result"),
//             b = c.intersect(a),
//             b.length ? this.result_do_highlight(b.first()) : (this.choices_count() > 0 && this.results_hide(),
//             this.result_clear_highlight())) : void 0 : this.results_show()
//         }
//         ,
//         Chosen.prototype.keydown_backstroke = function() {
//             var a;
//             return this.pending_backstroke ? (this.choice_destroy(this.pending_backstroke.down("a")),
//             this.clear_backstroke()) : (a = this.search_container.siblings().last(),
//             a && a.hasClassName("search-choice") && !a.hasClassName("search-choice-disabled") ? (this.pending_backstroke = a,
//             this.pending_backstroke && this.pending_backstroke.addClassName("search-choice-focus"),
//             this.single_backstroke_delete ? this.keydown_backstroke() : this.pending_backstroke.addClassName("search-choice-focus")) : void 0)
//         }
//         ,
//         Chosen.prototype.clear_backstroke = function() {
//             return this.pending_backstroke && this.pending_backstroke.removeClassName("search-choice-focus"),
//             this.pending_backstroke = null
//         }
//         ,
//         Chosen.prototype.keydown_checker = function(a) {
//             var b, c;
//             switch (b = null != (c = a.which) ? c : a.keyCode,
//             this.search_field_scale(),
//             8 !== b && this.pending_backstroke && this.clear_backstroke(),
//             b) {
//             case 8:
//                 this.backstroke_length = this.search_field.value.length;
//                 break;
//             case 9:
//                 this.results_showing && !this.is_multiple && this.result_select(a),
//                 this.mouse_on_container = !1;
//                 break;
//             case 13:
//                 this.results_showing && a.preventDefault();
//                 break;
//             case 32:
//                 this.disable_search && a.preventDefault();
//                 break;
//             case 38:
//                 a.preventDefault(),
//                 this.keyup_arrow();
//                 break;
//             case 40:
//                 a.preventDefault(),
//                 this.keydown_arrow()
//             }
//         }
//         ,
//         Chosen.prototype.search_field_scale = function() {
//             var a, b, c, d, e, f, g, h, i;
//             if (this.is_multiple) {
//                 for (c = 0,
//                 g = 0,
//                 e = "position:absolute; left: -1000px; top: -1000px; display:none;",
//                 f = ["font-size", "font-style", "font-weight", "font-family", "line-height", "text-transform", "letter-spacing"],
//                 h = 0,
//                 i = f.length; i > h; h++)
//                     d = f[h],
//                     e += d + ":" + this.search_field.getStyle(d) + ";";
//                 return a = new Element("div",{
//                     style: e
//                 }).update(this.search_field.value.escapeHTML()),
//                 document.body.appendChild(a),
//                 g = Element.measure(a, "width") + 25,
//                 a.remove(),
//                 b = this.container.getWidth(),
//                 g > b - 10 && (g = b - 10),
//                 this.search_field.setStyle({
//                     width: g + "px"
//                 })
//             }
//         }
//         ,
//         Chosen
//     }(AbstractChosen)
// }
// ).call(this);
// ;/*
//   Masked Input plugin for jQuery
//   Copyright (c) 2007-2013 Josh Bush (digitalbush.com)
//   Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
//   Version: 1.3.1
// */
// (function(e) {
//     function t() {
//         var e = document.createElement("input")
//           , t = "onpaste";
//         return e.setAttribute(t, ""),
//         "function" == typeof e[t] ? "paste" : "input"
//     }
//     var n, a = t() + ".mask", r = navigator.userAgent, i = /iphone/i.test(r), o = /android/i.test(r);
//     e.mask = {
//         definitions: {
//             9: "[0-9]",
//             a: "[A-Za-z]",
//             "*": "[A-Za-z0-9]"
//         },
//         dataName: "rawMaskFn",
//         placeholder: "_"
//     },
//     e.fn.extend({
//         caret: function(e, t) {
//             var n;
//             if (0 !== this.length && !this.is(":hidden"))
//                 return "number" == typeof e ? (t = "number" == typeof t ? t : e,
//                 this.each(function() {
//                     this.setSelectionRange ? this.setSelectionRange(e, t) : this.createTextRange && (n = this.createTextRange(),
//                     n.collapse(!0),
//                     n.moveEnd("character", t),
//                     n.moveStart("character", e),
//                     n.select())
//                 })) : (this[0].setSelectionRange ? (e = this[0].selectionStart,
//                 t = this[0].selectionEnd) : document.selection && document.selection.createRange && (n = document.selection.createRange(),
//                 e = 0 - n.duplicate().moveStart("character", -1e5),
//                 t = e + n.text.length),
//                 {
//                     begin: e,
//                     end: t
//                 })
//         },
//         unmask: function() {
//             return this.trigger("unmask")
//         },
//         mask: function(t, r) {
//             var c, l, s, u, f, h;
//             return !t && this.length > 0 ? (c = e(this[0]),
//             c.data(e.mask.dataName)()) : (r = e.extend({
//                 placeholder: e.mask.placeholder,
//                 completed: null
//             }, r),
//             l = e.mask.definitions,
//             s = [],
//             u = h = t.length,
//             f = null ,
//             e.each(t.split(""), function(e, t) {
//                 "?" == t ? (h--,
//                 u = e) : l[t] ? (s.push(RegExp(l[t])),
//                 null === f && (f = s.length - 1)) : s.push(null )
//             }),
//             this.trigger("unmask").each(function() {
//                 function c(e) {
//                     for (; h > ++e && !s[e]; )
//                         ;
//                     return e
//                 }
//                 function d(e) {
//                     for (; --e >= 0 && !s[e]; )
//                         ;
//                     return e
//                 }
//                 function m(e, t) {
//                     var n, a;
//                     if (!(0 > e)) {
//                         for (n = e,
//                         a = c(t); h > n; n++)
//                             if (s[n]) {
//                                 if (!(h > a && s[n].test(R[a])))
//                                     break;
//                                 R[n] = R[a],
//                                 R[a] = r.placeholder,
//                                 a = c(a)
//                             }
//                         b(),
//                         x.caret(Math.max(f, e))
//                     }
//                 }
//                 function p(e) {
//                     var t, n, a, i;
//                     for (t = e,
//                     n = r.placeholder; h > t; t++)
//                         if (s[t]) {
//                             if (a = c(t),
//                             i = R[t],
//                             R[t] = n,
//                             !(h > a && s[a].test(i)))
//                                 break;
//                             n = i
//                         }
//                 }
//                 function g(e) {
//                     var t, n, a, r = e.which;
//                     8 === r || 46 === r || i && 127 === r ? (t = x.caret(),
//                     n = t.begin,
//                     a = t.end,
//                     0 === a - n && (n = 46 !== r ? d(n) : a = c(n - 1),
//                     a = 46 === r ? c(a) : a),
//                     k(n, a),
//                     m(n, a - 1),
//                     e.preventDefault()) : 27 == r && (x.val(S),
//                     x.caret(0, y()),
//                     e.preventDefault())
//                 }
//                 function v(t) {
//                     var n, a, i, l = t.which, u = x.caret();
//                     t.ctrlKey || t.altKey || t.metaKey || 32 > l || l && (0 !== u.end - u.begin && (k(u.begin, u.end),
//                     m(u.begin, u.end - 1)),
//                     n = c(u.begin - 1),
//                     h > n && (a = String.fromCharCode(l),
//                     s[n].test(a) && (p(n),
//                     R[n] = a,
//                     b(),
//                     i = c(n),
//                     o ? setTimeout(e.proxy(e.fn.caret, x, i), 0) : x.caret(i),
//                     r.completed && i >= h && r.completed.call(x))),
//                     t.preventDefault())
//                 }
//                 function k(e, t) {
//                     var n;
//                     for (n = e; t > n && h > n; n++)
//                         s[n] && (R[n] = r.placeholder)
//                 }
//                 function b() {
//                     x.val(R.join(""))
//                 }
//                 function y(e) {
//                     var t, n, a = x.val(), i = -1;
//                     for (t = 0,
//                     pos = 0; h > t; t++)
//                         if (s[t]) {
//                             for (R[t] = r.placeholder; pos++ < a.length; )
//                                 if (n = a.charAt(pos - 1),
//                                 s[t].test(n)) {
//                                     R[t] = n,
//                                     i = t;
//                                     break
//                                 }
//                             if (pos > a.length)
//                                 break
//                         } else
//                             R[t] === a.charAt(pos) && t !== u && (pos++,
//                             i = t);
//                     return e ? b() : u > i + 1 ? (x.val(""),
//                     k(0, h)) : (b(),
//                     x.val(x.val().substring(0, i + 1))),
//                     u ? t : f
//                 }
//                 var x = e(this)
//                   , R = e.map(t.split(""), function(e) {
//                     return "?" != e ? l[e] ? r.placeholder : e : void 0
//                 })
//                   , S = x.val();
//                 x.data(e.mask.dataName, function() {
//                     return e.map(R, function(e, t) {
//                         return s[t] && e != r.placeholder ? e : null
//                     }).join("")
//                 }),
//                 x.attr("readonly") || x.one("unmask", function() {
//                     x.unbind(".mask").removeData(e.mask.dataName)
//                 }).bind("focus.mask", function() {
//                     clearTimeout(n);
//                     var e;
//                     S = x.val(),
//                     e = y(),
//                     n = setTimeout(function() {
//                         b(),
//                         e == t.length ? x.caret(0, e) : x.caret(e)
//                     }, 10)
//                 }).bind("blur.mask", function() {
//                     y(),
//                     x.val() != S && x.change()
//                 }).bind("keydown.mask", g).bind("keypress.mask", v).bind(a, function() {
//                     setTimeout(function() {
//                         var e = y(!0);
//                         x.caret(e),
//                         r.completed && e == x.val().length && r.completed.call(x)
//                     }, 0)
//                 }),
//                 y()
//             }))
//         }
//     })
// })(jQuery);
// ;(function() {
//     var root = this
//       , previousUnderscore = root._
//       , ArrayProto = Array.prototype
//       , ObjProto = Object.prototype
//       , FuncProto = Function.prototype
//       , push = ArrayProto.push
//       , slice = ArrayProto.slice
//       , toString = ObjProto.toString
//       , hasOwnProperty = ObjProto.hasOwnProperty
//       , nativeIsArray = Array.isArray
//       , nativeKeys = Object.keys
//       , nativeBind = FuncProto.bind
//       , nativeCreate = Object.create
//       , Ctor = function() {}
//       , _ = function(obj) {
//         if (obj instanceof _)
//             return obj;
//         if (!(this instanceof _))
//             return new _(obj);
//         this._wrapped = obj
//     }
//     ;
//     if (typeof exports !== 'undefined') {
//         if (typeof module !== 'undefined' && module.exports)
//             exports = module.exports = _;
//         exports._ = _
//     } else
//         root._ = _;
//     _.VERSION = '1.8.3';
//     var optimizeCb = function(func, context, argCount) {
//         if (context === void (0))
//             return func;
//         switch (argCount == null ? 3 : argCount) {
//         case 1:
//             return function(value) {
//                 return func.call(context, value)
//             }
//             ;
//         case 2:
//             return function(value, other) {
//                 return func.call(context, value, other)
//             }
//             ;
//         case 3:
//             return function(value, index, collection) {
//                 return func.call(context, value, index, collection)
//             }
//             ;
//         case 4:
//             return function(accumulator, value, index, collection) {
//                 return func.call(context, accumulator, value, index, collection)
//             }
//         }
//         ;return function() {
//             return func.apply(context, arguments)
//         }
//     }
//       , cb = function(value, context, argCount) {
//         if (value == null )
//             return _.identity;
//         if (_.isFunction(value))
//             return optimizeCb(value, context, argCount);
//         if (_.isObject(value))
//             return _.matcher(value);
//         return _.property(value)
//     }
//     ;
//     _.iteratee = function(value, context) {
//         return cb(value, context, Infinity)
//     }
//     ;
//     var createAssigner = function(keysFunc, undefinedOnly) {
//         return function(obj) {
//             var length = arguments.length;
//             if (length < 2 || obj == null )
//                 return obj;
//             for (var index = 1; index < length; index++) {
//                 var source = arguments[index]
//                   , keys = keysFunc(source)
//                   , l = keys.length;
//                 for (var i = 0; i < l; i++) {
//                     var key = keys[i];
//                     if (!undefinedOnly || obj[key] === void (0))
//                         obj[key] = source[key]
//                 }
//             }
//             ;return obj
//         }
//     }
//       , baseCreate = function(prototype) {
//         if (!_.isObject(prototype))
//             return {};
//         if (nativeCreate)
//             return nativeCreate(prototype);
//         Ctor.prototype = prototype;
//         var result = new Ctor();
//         Ctor.prototype = null ;
//         return result
//     }
//       , property = function(key) {
//         return function(obj) {
//             return obj == null ? void (0) : obj[key]
//         }
//     }
//       , MAX_ARRAY_INDEX = Math.pow(2, 53) - 1
//       , getLength = property('length')
//       , isArrayLike = function(collection) {
//         var length = getLength(collection);
//         return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX
//     }
//     ;
//     _.each = _.forEach = function(obj, iteratee, context) {
//         iteratee = optimizeCb(iteratee, context);
//         var i, length;
//         if (isArrayLike(obj)) {
//             for (i = 0,
//             length = obj.length; i < length; i++)
//                 iteratee(obj[i], i, obj)
//         } else {
//             var keys = _.keys(obj);
//             for (i = 0,
//             length = keys.length; i < length; i++)
//                 iteratee(obj[keys[i]], keys[i], obj)
//         }
//         ;return obj
//     }
//     ;
//     _.map = _.collect = function(obj, iteratee, context) {
//         iteratee = cb(iteratee, context);
//         var keys = !isArrayLike(obj) && _.keys(obj)
//           , length = (keys || obj).length
//           , results = Array(length);
//         for (var index = 0; index < length; index++) {
//             var currentKey = keys ? keys[index] : index;
//             results[index] = iteratee(obj[currentKey], currentKey, obj)
//         }
//         ;return results
//     }
//     function createReduce(dir) {
//         function iterator(obj, iteratee, memo, keys, index, length) {
//             for (; index >= 0 && index < length; index += dir) {
//                 var currentKey = keys ? keys[index] : index;
//                 memo = iteratee(memo, obj[currentKey], currentKey, obj)
//             }
//             ;return memo
//         }
//         ;return function(obj, iteratee, memo, context) {
//             iteratee = optimizeCb(iteratee, context, 4);
//             var keys = !isArrayLike(obj) && _.keys(obj)
//               , length = (keys || obj).length
//               , index = dir > 0 ? 0 : length - 1;
//             if (arguments.length < 3) {
//                 memo = obj[keys ? keys[index] : index];
//                 index += dir
//             }
//             ;return iterator(obj, iteratee, memo, keys, index, length)
//         }
//     }
//     ;_.reduce = _.foldl = _.inject = createReduce(1);
//     _.reduceRight = _.foldr = createReduce(-1);
//     _.find = _.detect = function(obj, predicate, context) {
//         var key;
//         if (isArrayLike(obj)) {
//             key = _.findIndex(obj, predicate, context)
//         } else
//             key = _.findKey(obj, predicate, context);
//         if (key !== void (0) && key !== -1)
//             return obj[key]
//     }
//     ;
//     _.filter = _.select = function(obj, predicate, context) {
//         var results = [];
//         predicate = cb(predicate, context);
//         _.each(obj, function(value, index, list) {
//             if (predicate(value, index, list))
//                 results.push(value)
//         });
//         return results
//     }
//     ;
//     _.reject = function(obj, predicate, context) {
//         return _.filter(obj, _.negate(cb(predicate)), context)
//     }
//     ;
//     _.every = _.all = function(obj, predicate, context) {
//         predicate = cb(predicate, context);
//         var keys = !isArrayLike(obj) && _.keys(obj)
//           , length = (keys || obj).length;
//         for (var index = 0; index < length; index++) {
//             var currentKey = keys ? keys[index] : index;
//             if (!predicate(obj[currentKey], currentKey, obj))
//                 return false
//         }
//         ;return true
//     }
//     ;
//     _.some = _.any = function(obj, predicate, context) {
//         predicate = cb(predicate, context);
//         var keys = !isArrayLike(obj) && _.keys(obj)
//           , length = (keys || obj).length;
//         for (var index = 0; index < length; index++) {
//             var currentKey = keys ? keys[index] : index;
//             if (predicate(obj[currentKey], currentKey, obj))
//                 return true
//         }
//         ;return false
//     }
//     ;
//     _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
//         if (!isArrayLike(obj))
//             obj = _.values(obj);
//         if (typeof fromIndex != 'number' || guard)
//             fromIndex = 0;
//         return _.indexOf(obj, item, fromIndex) >= 0
//     }
//     ;
//     _.invoke = function(obj, method) {
//         var args = slice.call(arguments, 2)
//           , isFunc = _.isFunction(method);
//         return _.map(obj, function(value) {
//             var func = isFunc ? method : value[method];
//             return func == null ? func : func.apply(value, args)
//         })
//     }
//     ;
//     _.pluck = function(obj, key) {
//         return _.map(obj, _.property(key))
//     }
//     ;
//     _.where = function(obj, attrs) {
//         return _.filter(obj, _.matcher(attrs))
//     }
//     ;
//     _.findWhere = function(obj, attrs) {
//         return _.find(obj, _.matcher(attrs))
//     }
//     ;
//     _.max = function(obj, iteratee, context) {
//         var result = -Infinity, lastComputed = -Infinity, value, computed;
//         if (iteratee == null && obj != null ) {
//             obj = isArrayLike(obj) ? obj : _.values(obj);
//             for (var i = 0, length = obj.length; i < length; i++) {
//                 value = obj[i];
//                 if (value > result)
//                     result = value
//             }
//         } else {
//             iteratee = cb(iteratee, context);
//             _.each(obj, function(value, index, list) {
//                 computed = iteratee(value, index, list);
//                 if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
//                     result = value;
//                     lastComputed = computed
//                 }
//             })
//         }
//         ;return result
//     }
//     ;
//     _.min = function(obj, iteratee, context) {
//         var result = Infinity, lastComputed = Infinity, value, computed;
//         if (iteratee == null && obj != null ) {
//             obj = isArrayLike(obj) ? obj : _.values(obj);
//             for (var i = 0, length = obj.length; i < length; i++) {
//                 value = obj[i];
//                 if (value < result)
//                     result = value
//             }
//         } else {
//             iteratee = cb(iteratee, context);
//             _.each(obj, function(value, index, list) {
//                 computed = iteratee(value, index, list);
//                 if (computed < lastComputed || computed === Infinity && result === Infinity) {
//                     result = value;
//                     lastComputed = computed
//                 }
//             })
//         }
//         ;return result
//     }
//     ;
//     _.shuffle = function(obj) {
//         var set = isArrayLike(obj) ? obj : _.values(obj)
//           , length = set.length
//           , shuffled = Array(length);
//         for (var index = 0, rand; index < length; index++) {
//             rand = _.random(0, index);
//             if (rand !== index)
//                 shuffled[index] = shuffled[rand];
//             shuffled[rand] = set[index]
//         }
//         ;return shuffled
//     }
//     ;
//     _.sample = function(obj, n, guard) {
//         if (n == null || guard) {
//             if (!isArrayLike(obj))
//                 obj = _.values(obj);
//             return obj[_.random(obj.length - 1)]
//         }
//         ;return _.shuffle(obj).slice(0, Math.max(0, n))
//     }
//     ;
//     _.sortBy = function(obj, iteratee, context) {
//         iteratee = cb(iteratee, context);
//         return _.pluck(_.map(obj, function(value, index, list) {
//             return {
//                 value: value,
//                 index: index,
//                 criteria: iteratee(value, index, list)
//             }
//         }).sort(function(left, right) {
//             var a = left.criteria
//               , b = right.criteria;
//             if (a !== b) {
//                 if (a > b || a === void (0))
//                     return 1;
//                 if (a < b || b === void (0))
//                     return -1
//             }
//             ;return left.index - right.index
//         }), 'value')
//     }
//     ;
//     var group = function(behavior) {
//         return function(obj, iteratee, context) {
//             var result = {};
//             iteratee = cb(iteratee, context);
//             _.each(obj, function(value, index) {
//                 var key = iteratee(value, index, obj);
//                 behavior(result, value, key)
//             });
//             return result
//         }
//     }
//     ;
//     _.groupBy = group(function(result, value, key) {
//         if (_.has(result, key)) {
//             result[key].push(value)
//         } else
//             result[key] = [value]
//     });
//     _.indexBy = group(function(result, value, key) {
//         result[key] = value
//     });
//     _.countBy = group(function(result, value, key) {
//         if (_.has(result, key)) {
//             result[key]++
//         } else
//             result[key] = 1
//     });
//     _.toArray = function(obj) {
//         if (!obj)
//             return [];
//         if (_.isArray(obj))
//             return slice.call(obj);
//         if (isArrayLike(obj))
//             return _.map(obj, _.identity);
//         return _.values(obj)
//     }
//     ;
//     _.size = function(obj) {
//         if (obj == null )
//             return 0;
//         return isArrayLike(obj) ? obj.length : _.keys(obj).length
//     }
//     ;
//     _.partition = function(obj, predicate, context) {
//         predicate = cb(predicate, context);
//         var pass = []
//           , fail = [];
//         _.each(obj, function(value, key, obj) {
//             (predicate(value, key, obj) ? pass : fail).push(value)
//         });
//         return [pass, fail]
//     }
//     ;
//     _.first = _.head = _.take = function(array, n, guard) {
//         if (array == null )
//             return void (0);
//         if (n == null || guard)
//             return array[0];
//         return _.initial(array, array.length - n)
//     }
//     ;
//     _.initial = function(array, n, guard) {
//         return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)))
//     }
//     ;
//     _.last = function(array, n, guard) {
//         if (array == null )
//             return void (0);
//         if (n == null || guard)
//             return array[array.length - 1];
//         return _.rest(array, Math.max(0, array.length - n))
//     }
//     ;
//     _.rest = _.tail = _.drop = function(array, n, guard) {
//         return slice.call(array, n == null || guard ? 1 : n)
//     }
//     ;
//     _.compact = function(array) {
//         return _.filter(array, _.identity)
//     }
//     ;
//     var flatten = function(input, shallow, strict, startIndex) {
//         var output = []
//           , idx = 0;
//         for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
//             var value = input[i];
//             if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
//                 if (!shallow)
//                     value = flatten(value, shallow, strict);
//                 var j = 0
//                   , len = value.length;
//                 output.length += len;
//                 while (j < len)
//                     output[idx++] = value[j++]
//             } else if (!strict)
//                 output[idx++] = value
//         }
//         ;return output
//     }
//     ;
//     _.flatten = function(array, shallow) {
//         return flatten(array, shallow, false)
//     }
//     ;
//     _.without = function(array) {
//         return _.difference(array, slice.call(arguments, 1))
//     }
//     ;
//     _.uniq = _.unique = function(array, isSorted, iteratee, context) {
//         if (!_.isBoolean(isSorted)) {
//             context = iteratee;
//             iteratee = isSorted;
//             isSorted = false
//         }
//         ;if (iteratee != null )
//             iteratee = cb(iteratee, context);
//         var result = []
//           , seen = [];
//         for (var i = 0, length = getLength(array); i < length; i++) {
//             var value = array[i]
//               , computed = iteratee ? iteratee(value, i, array) : value;
//             if (isSorted) {
//                 if (!i || seen !== computed)
//                     result.push(value);
//                 seen = computed
//             } else if (iteratee) {
//                 if (!_.contains(seen, computed)) {
//                     seen.push(computed);
//                     result.push(value)
//                 }
//             } else if (!_.contains(result, value))
//                 result.push(value)
//         }
//         ;return result
//     }
//     ;
//     _.union = function() {
//         return _.uniq(flatten(arguments, true, true))
//     }
//     ;
//     _.intersection = function(array) {
//         var result = []
//           , argsLength = arguments.length;
//         for (var i = 0, length = getLength(array); i < length; i++) {
//             var item = array[i];
//             if (_.contains(result, item))
//                 continue;for (var j = 1; j < argsLength; j++)
//                 if (!_.contains(arguments[j], item))
//                     break;
//             if (j === argsLength)
//                 result.push(item)
//         }
//         ;return result
//     }
//     ;
//     _.difference = function(array) {
//         var rest = flatten(arguments, true, true, 1);
//         return _.filter(array, function(value) {
//             return !_.contains(rest, value)
//         })
//     }
//     ;
//     _.zip = function() {
//         return _.unzip(arguments)
//     }
//     ;
//     _.unzip = function(array) {
//         var length = array && _.max(array, getLength).length || 0
//           , result = Array(length);
//         for (var index = 0; index < length; index++)
//             result[index] = _.pluck(array, index);
//         return result
//     }
//     ;
//     _.object = function(list, values) {
//         var result = {};
//         for (var i = 0, length = getLength(list); i < length; i++)
//             if (values) {
//                 result[list[i]] = values[i]
//             } else
//                 result[list[i][0]] = list[i][1];
//         return result
//     }
//     function createPredicateIndexFinder(dir) {
//         return function(array, predicate, context) {
//             predicate = cb(predicate, context);
//             var length = getLength(array)
//               , index = dir > 0 ? 0 : length - 1;
//             for (; index >= 0 && index < length; index += dir)
//                 if (predicate(array[index], index, array))
//                     return index;
//             return -1
//         }
//     }
//     ;_.findIndex = createPredicateIndexFinder(1);
//     _.findLastIndex = createPredicateIndexFinder(-1);
//     _.sortedIndex = function(array, obj, iteratee, context) {
//         iteratee = cb(iteratee, context, 1);
//         var value = iteratee(obj)
//           , low = 0
//           , high = getLength(array);
//         while (low < high) {
//             var mid = Math.floor((low + high) / 2);
//             if (iteratee(array[mid]) < value) {
//                 low = mid + 1
//             } else
//                 high = mid
//         }
//         ;return low
//     }
//     function createIndexFinder(dir, predicateFind, sortedIndex) {
//         return function(array, item, idx) {
//             var i = 0
//               , length = getLength(array);
//             if (typeof idx == 'number') {
//                 if (dir > 0) {
//                     i = idx >= 0 ? idx : Math.max(idx + length, i)
//                 } else
//                     length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1
//             } else if (sortedIndex && idx && length) {
//                 idx = sortedIndex(array, item);
//                 return array[idx] === item ? idx : -1
//             }
//             ;if (item !== item) {
//                 idx = predicateFind(slice.call(array, i, length), _.isNaN);
//                 return idx >= 0 ? idx + i : -1
//             }
//             ;for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir)
//                 if (array[idx] === item)
//                     return idx;
//             return -1
//         }
//     }
//     ;_.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
//     _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
//     _.range = function(start, stop, step) {
//         if (stop == null ) {
//             stop = start || 0;
//             start = 0
//         }
//         ;step = step || 1;
//         var length = Math.max(Math.ceil((stop - start) / step), 0)
//           , range = Array(length);
//         for (var idx = 0; idx < length; idx++,
//         start += step)
//             range[idx] = start;
//         return range
//     }
//     ;
//     var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
//         if (!(callingContext instanceof boundFunc))
//             return sourceFunc.apply(context, args);
//         var self = baseCreate(sourceFunc.prototype)
//           , result = sourceFunc.apply(self, args);
//         if (_.isObject(result))
//             return result;
//         return self
//     }
//     ;
//     _.bind = function(func, context) {
//         if (nativeBind && func.bind === nativeBind)
//             return nativeBind.apply(func, slice.call(arguments, 1));
//         if (!_.isFunction(func))
//             throw new TypeError('Bind must be called on a function');
//         var args = slice.call(arguments, 2)
//           , bound = function() {
//             return executeBound(func, bound, context, this, args.concat(slice.call(arguments)))
//         }
//         ;
//         return bound
//     }
//     ;
//     _.partial = function(func) {
//         var boundArgs = slice.call(arguments, 1)
//           , bound = function() {
//             var position = 0
//               , length = boundArgs.length
//               , args = Array(length);
//             for (var i = 0; i < length; i++)
//                 args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
//             while (position < arguments.length)
//                 args.push(arguments[position++]);
//             return executeBound(func, bound, this, this, args)
//         }
//         ;
//         return bound
//     }
//     ;
//     _.bindAll = function(obj) {
//         var i, length = arguments.length, key;
//         if (length <= 1)
//             throw new Error('bindAll must be passed function names');
//         for (i = 1; i < length; i++) {
//             key = arguments[i];
//             obj[key] = _.bind(obj[key], obj)
//         }
//         ;return obj
//     }
//     ;
//     _.memoize = function(func, hasher) {
//         var memoize = function(key) {
//             var cache = memoize.cache
//               , address = '' + (hasher ? hasher.apply(this, arguments) : key);
//             if (!_.has(cache, address))
//                 cache[address] = func.apply(this, arguments);
//             return cache[address]
//         }
//         ;
//         memoize.cache = {};
//         return memoize
//     }
//     ;
//     _.delay = function(func, wait) {
//         var args = slice.call(arguments, 2);
//         return setTimeout(function() {
//             return func.apply(null , args)
//         }, wait)
//     }
//     ;
//     _.defer = _.partial(_.delay, _, 1);
//     _.throttle = function(func, wait, options) {
//         var context, args, result, timeout = null , previous = 0;
//         if (!options)
//             options = {};
//         var later = function() {
//             previous = options.leading === false ? 0 : _.now();
//             timeout = null ;
//             result = func.apply(context, args);
//             if (!timeout)
//                 context = args = null
//         }
//         ;
//         return function() {
//             var now = _.now();
//             if (!previous && options.leading === false)
//                 previous = now;
//             var remaining = wait - (now - previous);
//             context = this;
//             args = arguments;
//             if (remaining <= 0 || remaining > wait) {
//                 if (timeout) {
//                     clearTimeout(timeout);
//                     timeout = null
//                 }
//                 ;previous = now;
//                 result = func.apply(context, args);
//                 if (!timeout)
//                     context = args = null
//             } else if (!timeout && options.trailing !== false)
//                 timeout = setTimeout(later, remaining);
//             return result
//         }
//     }
//     ;
//     _.debounce = function(func, wait, immediate) {
//         var timeout, args, context, timestamp, result, later = function() {
//             var last = _.now() - timestamp;
//             if (last < wait && last >= 0) {
//                 timeout = setTimeout(later, wait - last)
//             } else {
//                 timeout = null ;
//                 if (!immediate) {
//                     result = func.apply(context, args);
//                     if (!timeout)
//                         context = args = null
//                 }
//             }
//         }
//         ;
//         return function() {
//             context = this;
//             args = arguments;
//             timestamp = _.now();
//             var callNow = immediate && !timeout;
//             if (!timeout)
//                 timeout = setTimeout(later, wait);
//             if (callNow) {
//                 result = func.apply(context, args);
//                 context = args = null
//             }
//             ;return result
//         }
//     }
//     ;
//     _.wrap = function(func, wrapper) {
//         return _.partial(wrapper, func)
//     }
//     ;
//     _.negate = function(predicate) {
//         return function() {
//             return !predicate.apply(this, arguments)
//         }
//     }
//     ;
//     _.compose = function() {
//         var args = arguments
//           , start = args.length - 1;
//         return function() {
//             var i = start
//               , result = args[start].apply(this, arguments);
//             while (i--)
//                 result = args[i].call(this, result);
//             return result
//         }
//     }
//     ;
//     _.after = function(times, func) {
//         return function() {
//             if (--times < 1)
//                 return func.apply(this, arguments)
//         }
//     }
//     ;
//     _.before = function(times, func) {
//         var memo;
//         return function() {
//             if (--times > 0)
//                 memo = func.apply(this, arguments);
//             if (times <= 1)
//                 func = null ;
//             return memo
//         }
//     }
//     ;
//     _.once = _.partial(_.before, 2);
//     var hasEnumBug = !{
//         toString: null
//     }.propertyIsEnumerable('toString')
//       , nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString']
//     function collectNonEnumProps(obj, keys) {
//         var nonEnumIdx = nonEnumerableProps.length
//           , constructor = obj.constructor
//           , proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto
//           , prop = 'constructor';
//         if (_.has(obj, prop) && !_.contains(keys, prop))
//             keys.push(prop);
//         while (nonEnumIdx--) {
//             prop = nonEnumerableProps[nonEnumIdx];
//             if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop))
//                 keys.push(prop)
//         }
//     }
//     ;_.keys = function(obj) {
//         if (!_.isObject(obj))
//             return [];
//         if (nativeKeys)
//             return nativeKeys(obj);
//         var keys = [];
//         for (var key in obj)
//             if (_.has(obj, key))
//                 keys.push(key);
//         if (hasEnumBug)
//             collectNonEnumProps(obj, keys);
//         return keys
//     }
//     ;
//     _.allKeys = function(obj) {
//         if (!_.isObject(obj))
//             return [];
//         var keys = [];
//         for (var key in obj)
//             keys.push(key);
//         if (hasEnumBug)
//             collectNonEnumProps(obj, keys);
//         return keys
//     }
//     ;
//     _.values = function(obj) {
//         var keys = _.keys(obj)
//           , length = keys.length
//           , values = Array(length);
//         for (var i = 0; i < length; i++)
//             values[i] = obj[keys[i]];
//         return values
//     }
//     ;
//     _.mapObject = function(obj, iteratee, context) {
//         iteratee = cb(iteratee, context);
//         var keys = _.keys(obj), length = keys.length, results = {}, currentKey;
//         for (var index = 0; index < length; index++) {
//             currentKey = keys[index];
//             results[currentKey] = iteratee(obj[currentKey], currentKey, obj)
//         }
//         ;return results
//     }
//     ;
//     _.pairs = function(obj) {
//         var keys = _.keys(obj)
//           , length = keys.length
//           , pairs = Array(length);
//         for (var i = 0; i < length; i++)
//             pairs[i] = [keys[i], obj[keys[i]]];
//         return pairs
//     }
//     ;
//     _.invert = function(obj) {
//         var result = {}
//           , keys = _.keys(obj);
//         for (var i = 0, length = keys.length; i < length; i++)
//             result[obj[keys[i]]] = keys[i];
//         return result
//     }
//     ;
//     _.functions = _.methods = function(obj) {
//         var names = [];
//         for (var key in obj)
//             if (_.isFunction(obj[key]))
//                 names.push(key);
//         return names.sort()
//     }
//     ;
//     _.extend = createAssigner(_.allKeys);
//     _.extendOwn = _.assign = createAssigner(_.keys);
//     _.findKey = function(obj, predicate, context) {
//         predicate = cb(predicate, context);
//         var keys = _.keys(obj), key;
//         for (var i = 0, length = keys.length; i < length; i++) {
//             key = keys[i];
//             if (predicate(obj[key], key, obj))
//                 return key
//         }
//     }
//     ;
//     _.pick = function(object, oiteratee, context) {
//         var result = {}, obj = object, iteratee, keys;
//         if (obj == null )
//             return result;
//         if (_.isFunction(oiteratee)) {
//             keys = _.allKeys(obj);
//             iteratee = optimizeCb(oiteratee, context)
//         } else {
//             keys = flatten(arguments, false, false, 1);
//             iteratee = function(value, key, obj) {
//                 return key in obj
//             }
//             ;
//             obj = Object(obj)
//         }
//         ;for (var i = 0, length = keys.length; i < length; i++) {
//             var key = keys[i]
//               , value = obj[key];
//             if (iteratee(value, key, obj))
//                 result[key] = value
//         }
//         ;return result
//     }
//     ;
//     _.omit = function(obj, iteratee, context) {
//         if (_.isFunction(iteratee)) {
//             iteratee = _.negate(iteratee)
//         } else {
//             var keys = _.map(flatten(arguments, false, false, 1), String);
//             iteratee = function(value, key) {
//                 return !_.contains(keys, key)
//             }
//         }
//         ;return _.pick(obj, iteratee, context)
//     }
//     ;
//     _.defaults = createAssigner(_.allKeys, true);
//     _.create = function(prototype, props) {
//         var result = baseCreate(prototype);
//         if (props)
//             _.extendOwn(result, props);
//         return result
//     }
//     ;
//     _.clone = function(obj) {
//         if (!_.isObject(obj))
//             return obj;
//         return _.isArray(obj) ? obj.slice() : _.extend({}, obj)
//     }
//     ;
//     _.tap = function(obj, interceptor) {
//         interceptor(obj);
//         return obj
//     }
//     ;
//     _.isMatch = function(object, attrs) {
//         var keys = _.keys(attrs)
//           , length = keys.length;
//         if (object == null )
//             return !length;
//         var obj = Object(object);
//         for (var i = 0; i < length; i++) {
//             var key = keys[i];
//             if (attrs[key] !== obj[key] || !(key in obj))
//                 return false
//         }
//         ;return true
//     }
//     ;
//     var eq = function(a, b, aStack, bStack) {
//         if (a === b)
//             return a !== 0 || 1 / a === 1 / b;
//         if (a == null || b == null )
//             return a === b;
//         if (a instanceof _)
//             a = a._wrapped;
//         if (b instanceof _)
//             b = b._wrapped;
//         var className = toString.call(a);
//         if (className !== toString.call(b))
//             return false;
//         switch (className) {
//         case '[object RegExp]':
//         case '[object String]':
//             return '' + a === '' + b;
//         case '[object Number]':
//             if (+a !== +a)
//                 return +b !== +b;
//             return +a === 0 ? 1 / +a === 1 / b : +a === +b;
//         case '[object Date]':
//         case '[object Boolean]':
//             return +a === +b
//         }
//         ;var areArrays = className === '[object Array]';
//         if (!areArrays) {
//             if (typeof a != 'object' || typeof b != 'object')
//                 return false;
//             var aCtor = a.constructor
//               , bCtor = b.constructor;
//             if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor'in a && 'constructor'in b))
//                 return false
//         }
//         ;aStack = aStack || [];
//         bStack = bStack || [];
//         var length = aStack.length;
//         while (length--)
//             if (aStack[length] === a)
//                 return bStack[length] === b;
//         aStack.push(a);
//         bStack.push(b);
//         if (areArrays) {
//             length = a.length;
//             if (length !== b.length)
//                 return false;
//             while (length--)
//                 if (!eq(a[length], b[length], aStack, bStack))
//                     return false
//         } else {
//             var keys = _.keys(a), key;
//             length = keys.length;
//             if (_.keys(b).length !== length)
//                 return false;
//             while (length--) {
//                 key = keys[length];
//                 if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack)))
//                     return false
//             }
//         }
//         ;aStack.pop();
//         bStack.pop();
//         return true
//     }
//     ;
//     _.isEqual = function(a, b) {
//         return eq(a, b)
//     }
//     ;
//     _.isEmpty = function(obj) {
//         if (obj == null )
//             return true;
//         if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)))
//             return obj.length === 0;
//         return _.keys(obj).length === 0
//     }
//     ;
//     _.isElement = function(obj) {
//         return !!(obj && obj.nodeType === 1)
//     }
//     ;
//     _.isArray = nativeIsArray || function(obj) {
//         return toString.call(obj) === '[object Array]'
//     }
//     ;
//     _.isObject = function(obj) {
//         var type = typeof obj;
//         return type === 'function' || type === 'object' && !!obj
//     }
//     ;
//     _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
//         _['is' + name] = function(obj) {
//             return toString.call(obj) === '[object ' + name + ']'
//         }
//     });
//     if (!_.isArguments(arguments))
//         _.isArguments = function(obj) {
//             return _.has(obj, 'callee')
//         }
//         ;
//     if (typeof /./ != 'function' && typeof Int8Array != 'object')
//         _.isFunction = function(obj) {
//             return typeof obj == 'function' || false
//         }
//         ;
//     _.isFinite = function(obj) {
//         return isFinite(obj) && !isNaN(parseFloat(obj))
//     }
//     ;
//     _.isNaN = function(obj) {
//         return _.isNumber(obj) && obj !== +obj
//     }
//     ;
//     _.isBoolean = function(obj) {
//         return obj === true || obj === false || toString.call(obj) === '[object Boolean]'
//     }
//     ;
//     _.isNull = function(obj) {
//         return obj === null
//     }
//     ;
//     _.isUndefined = function(obj) {
//         return obj === void (0)
//     }
//     ;
//     _.has = function(obj, key) {
//         return obj != null && hasOwnProperty.call(obj, key)
//     }
//     ;
//     _.noConflict = function() {
//         root._ = previousUnderscore;
//         return this
//     }
//     ;
//     _.identity = function(value) {
//         return value
//     }
//     ;
//     _.constant = function(value) {
//         return function() {
//             return value
//         }
//     }
//     ;
//     _.noop = function() {}
//     ;
//     _.property = property;
//     _.propertyOf = function(obj) {
//         return obj == null ? function() {}
//         : function(key) {
//             return obj[key]
//         }
//     }
//     ;
//     _.matcher = _.matches = function(attrs) {
//         attrs = _.extendOwn({}, attrs);
//         return function(obj) {
//             return _.isMatch(obj, attrs)
//         }
//     }
//     ;
//     _.times = function(n, iteratee, context) {
//         var accum = Array(Math.max(0, n));
//         iteratee = optimizeCb(iteratee, context, 1);
//         for (var i = 0; i < n; i++)
//             accum[i] = iteratee(i);
//         return accum
//     }
//     ;
//     _.random = function(min, max) {
//         if (max == null ) {
//             max = min;
//             min = 0
//         }
//         ;return min + Math.floor(Math.random() * (max - min + 1))
//     }
//     ;
//     _.now = Date.now || function() {
//         return new Date().getTime()
//     }
//     ;
//     var escapeMap = {
//         '&': '&amp;',
//         '<': '&lt;',
//         '>': '&gt;',
//         '"': '&quot;',
//         "'": '&#x27;',
//         '`': '&#x60;'
//     }
//       , unescapeMap = _.invert(escapeMap)
//       , createEscaper = function(map) {
//         var escaper = function(match) {
//             return map[match]
//         }
//           , source = '(?:' + _.keys(map).join('|') + ')'
//           , testRegexp = RegExp(source)
//           , replaceRegexp = RegExp(source, 'g');
//         return function(string) {
//             string = string == null ? '' : '' + string;
//             return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string
//         }
//     }
//     ;
//     _.escape = createEscaper(escapeMap);
//     _.unescape = createEscaper(unescapeMap);
//     _.result = function(object, property, fallback) {
//         var value = object == null ? void (0) : object[property];
//         if (value === void (0))
//             value = fallback;
//         return _.isFunction(value) ? value.call(object) : value
//     }
//     ;
//     var idCounter = 0;
//     _.uniqueId = function(prefix) {
//         var id = ++idCounter + '';
//         return prefix ? prefix + id : id
//     }
//     ;
//     _.templateSettings = {
//         evaluate: /<%([\s\S]+?)%>/g,
//         interpolate: /<%=([\s\S]+?)%>/g,
//         escape: /<%-([\s\S]+?)%>/g
//     };
//     var noMatch = /(.)^/
//       , escapes = {
//         "'": "'",
//         '\\': '\\',
//         '\r': 'r',
//         '\n': 'n',
//         '\u2028': 'u2028',
//         '\u2029': 'u2029'
//     }
//       , escaper = /\\|'|\r|\n|\u2028|\u2029/g
//       , escapeChar = function(match) {
//         return '\\' + escapes[match]
//     }
//     ;
//     _.template = function(text, settings, oldSettings) {
//         if (!settings && oldSettings)
//             settings = oldSettings;
//         settings = _.defaults({}, settings, _.templateSettings);
//         var matcher = RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g')
//           , index = 0
//           , source = "__p+='";
//         text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
//             source += text.slice(index, offset).replace(escaper, escapeChar);
//             index = offset + match.length;
//             if (escape) {
//                 source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'"
//             } else if (interpolate) {
//                 source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'"
//             } else if (evaluate)
//                 source += "';\n" + evaluate + "\n__p+='";
//             return match
//         });
//         source += "';\n";
//         if (!settings.variable)
//             source = 'with(obj||{}){\n' + source + '}\n';
//         source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';
//         try {
//             var render = new Function(settings.variable || 'obj','_',source)
//         } catch (e) {
//             e.source = source;
//             throw e
//         }
//         ;var template = function(data) {
//             return render.call(this, data, _)
//         }
//           , argument = settings.variable || 'obj';
//         template.source = 'function(' + argument + '){\n' + source + '}';
//         return template
//     }
//     ;
//     _.chain = function(obj) {
//         var instance = _(obj);
//         instance._chain = true;
//         return instance
//     }
//     ;
//     var result = function(instance, obj) {
//         return instance._chain ? _(obj).chain() : obj
//     }
//     ;
//     _.mixin = function(obj) {
//         _.each(_.functions(obj), function(name) {
//             var func = _[name] = obj[name];
//             _.prototype[name] = function() {
//                 var args = [this._wrapped];
//                 push.apply(args, arguments);
//                 return result(this, func.apply(_, args))
//             }
//         })
//     }
//     ;
//     _.mixin(_);
//     _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
//         var method = ArrayProto[name];
//         _.prototype[name] = function() {
//             var obj = this._wrapped;
//             method.apply(obj, arguments);
//             if ((name === 'shift' || name === 'splice') && obj.length === 0)
//                 delete obj[0];
//             return result(this, obj)
//         }
//     });
//     _.each(['concat', 'join', 'slice'], function(name) {
//         var method = ArrayProto[name];
//         _.prototype[name] = function() {
//             return result(this, method.apply(this._wrapped, arguments))
//         }
//     });
//     _.prototype.value = function() {
//         return this._wrapped
//     }
//     ;
//     _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
//     _.prototype.toString = function() {
//         return '' + this._wrapped
//     }
//     ;
//     if (typeof define === 'function' && define.amd)
//         define('underscore', [], function() {
//             return _
//         })
// }
// .call(this));
// ;//! moment.js
// //! version : 2.8.1
// //! authors : Tim Wood, Iskren Chernev, Moment.js contributors
// //! license : MIT
// //! momentjs.com
// (function(a) {
//     function b(a, b, c) {
//         switch (arguments.length) {
//         case 2:
//             return null != a ? a : b;
//         case 3:
//             return null != a ? a : null != b ? b : c;
//         default:
//             throw new Error("Implement me")
//         }
//     }
//     function c() {
//         return {
//             empty: !1,
//             unusedTokens: [],
//             unusedInput: [],
//             overflow: -2,
//             charsLeftOver: 0,
//             nullInput: !1,
//             invalidMonth: null ,
//             invalidFormat: !1,
//             userInvalidated: !1,
//             iso: !1
//         }
//     }
//     function d(a) {
//         rb.suppressDeprecationWarnings === !1 && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + a)
//     }
//     function e(a, b) {
//         var c = !0;
//         return l(function() {
//             return c && (d(a),
//             c = !1),
//             b.apply(this, arguments)
//         }, b)
//     }
//     function f(a, b) {
//         nc[a] || (d(b),
//         nc[a] = !0)
//     }
//     function g(a, b) {
//         return function(c) {
//             return o(a.call(this, c), b)
//         }
//     }
//     function h(a, b) {
//         return function(c) {
//             return this.localeData().ordinal(a.call(this, c), b)
//         }
//     }
//     function i() {}
//     function j(a, b) {
//         b !== !1 && E(a),
//         m(this, a),
//         this._d = new Date(+a._d)
//     }
//     function k(a) {
//         var b = x(a)
//           , c = b.year || 0
//           , d = b.quarter || 0
//           , e = b.month || 0
//           , f = b.week || 0
//           , g = b.day || 0
//           , h = b.hour || 0
//           , i = b.minute || 0
//           , j = b.second || 0
//           , k = b.millisecond || 0;
//         this._milliseconds = +k + 1e3 * j + 6e4 * i + 36e5 * h,
//         this._days = +g + 7 * f,
//         this._months = +e + 3 * d + 12 * c,
//         this._data = {},
//         this._locale = rb.localeData(),
//         this._bubble()
//     }
//     function l(a, b) {
//         for (var c in b)
//             b.hasOwnProperty(c) && (a[c] = b[c]);
//         return b.hasOwnProperty("toString") && (a.toString = b.toString),
//         b.hasOwnProperty("valueOf") && (a.valueOf = b.valueOf),
//         a
//     }
//     function m(a, b) {
//         var c, d, e;
//         if ("undefined" != typeof b._isAMomentObject && (a._isAMomentObject = b._isAMomentObject),
//         "undefined" != typeof b._i && (a._i = b._i),
//         "undefined" != typeof b._f && (a._f = b._f),
//         "undefined" != typeof b._l && (a._l = b._l),
//         "undefined" != typeof b._strict && (a._strict = b._strict),
//         "undefined" != typeof b._tzm && (a._tzm = b._tzm),
//         "undefined" != typeof b._isUTC && (a._isUTC = b._isUTC),
//         "undefined" != typeof b._offset && (a._offset = b._offset),
//         "undefined" != typeof b._pf && (a._pf = b._pf),
//         "undefined" != typeof b._locale && (a._locale = b._locale),
//         Fb.length > 0)
//             for (c in Fb)
//                 d = Fb[c],
//                 e = b[d],
//                 "undefined" != typeof e && (a[d] = e);
//         return a
//     }
//     function n(a) {
//         return 0 > a ? Math.ceil(a) : Math.floor(a)
//     }
//     function o(a, b, c) {
//         for (var d = "" + Math.abs(a), e = a >= 0; d.length < b; )
//             d = "0" + d;
//         return (e ? c ? "+" : "" : "-") + d
//     }
//     function p(a, b) {
//         var c = {
//             milliseconds: 0,
//             months: 0
//         };
//         return c.months = b.month() - a.month() + 12 * (b.year() - a.year()),
//         a.clone().add(c.months, "M").isAfter(b) && --c.months,
//         c.milliseconds = +b - +a.clone().add(c.months, "M"),
//         c
//     }
//     function q(a, b) {
//         var c;
//         return b = J(b, a),
//         a.isBefore(b) ? c = p(a, b) : (c = p(b, a),
//         c.milliseconds = -c.milliseconds,
//         c.months = -c.months),
//         c
//     }
//     function r(a, b) {
//         return function(c, d) {
//             var e, g;
//             return null === d || isNaN(+d) || (f(b, "moment()." + b + "(period, number) is deprecated. Please use moment()." + b + "(number, period)."),
//             g = c,
//             c = d,
//             d = g),
//             c = "string" == typeof c ? +c : c,
//             e = rb.duration(c, d),
//             s(this, e, a),
//             this
//         }
//     }
//     function s(a, b, c, d) {
//         var e = b._milliseconds
//           , f = b._days
//           , g = b._months;
//         d = null == d ? !0 : d,
//         e && a._d.setTime(+a._d + e * c),
//         f && lb(a, "Date", kb(a, "Date") + f * c),
//         g && jb(a, kb(a, "Month") + g * c),
//         d && rb.updateOffset(a, f || g)
//     }
//     function t(a) {
//         return "[object Array]" === Object.prototype.toString.call(a)
//     }
//     function u(a) {
//         return "[object Date]" === Object.prototype.toString.call(a) || a instanceof Date
//     }
//     function v(a, b, c) {
//         var d, e = Math.min(a.length, b.length), f = Math.abs(a.length - b.length), g = 0;
//         for (d = 0; e > d; d++)
//             (c && a[d] !== b[d] || !c && z(a[d]) !== z(b[d])) && g++;
//         return g + f
//     }
//     function w(a) {
//         if (a) {
//             var b = a.toLowerCase().replace(/(.)s$/, "$1");
//             a = gc[a] || hc[b] || b
//         }
//         return a
//     }
//     function x(a) {
//         var b, c, d = {};
//         for (c in a)
//             a.hasOwnProperty(c) && (b = w(c),
//             b && (d[b] = a[c]));
//         return d
//     }
//     function y(b) {
//         var c, d;
//         if (0 === b.indexOf("week"))
//             c = 7,
//             d = "day";
//         else {
//             if (0 !== b.indexOf("month"))
//                 return;
//             c = 12,
//             d = "month"
//         }
//         rb[b] = function(e, f) {
//             var g, h, i = rb._locale[b], j = [];
//             if ("number" == typeof e && (f = e,
//             e = a),
//             h = function(a) {
//                 var b = rb().utc().set(d, a);
//                 return i.call(rb._locale, b, e || "")
//             }
//             ,
//             null != f)
//                 return h(f);
//             for (g = 0; c > g; g++)
//                 j.push(h(g));
//             return j
//         }
//     }
//     function z(a) {
//         var b = +a
//           , c = 0;
//         return 0 !== b && isFinite(b) && (c = b >= 0 ? Math.floor(b) : Math.ceil(b)),
//         c
//     }
//     function A(a, b) {
//         return new Date(Date.UTC(a, b + 1, 0)).getUTCDate()
//     }
//     function B(a, b, c) {
//         return fb(rb([a, 11, 31 + b - c]), b, c).week
//     }
//     function C(a) {
//         return D(a) ? 366 : 365
//     }
//     function D(a) {
//         return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0
//     }
//     function E(a) {
//         var b;
//         a._a && -2 === a._pf.overflow && (b = a._a[yb] < 0 || a._a[yb] > 11 ? yb : a._a[zb] < 1 || a._a[zb] > A(a._a[xb], a._a[yb]) ? zb : a._a[Ab] < 0 || a._a[Ab] > 23 ? Ab : a._a[Bb] < 0 || a._a[Bb] > 59 ? Bb : a._a[Cb] < 0 || a._a[Cb] > 59 ? Cb : a._a[Db] < 0 || a._a[Db] > 999 ? Db : -1,
//         a._pf._overflowDayOfYear && (xb > b || b > zb) && (b = zb),
//         a._pf.overflow = b)
//     }
//     function F(a) {
//         return null == a._isValid && (a._isValid = !isNaN(a._d.getTime()) && a._pf.overflow < 0 && !a._pf.empty && !a._pf.invalidMonth && !a._pf.nullInput && !a._pf.invalidFormat && !a._pf.userInvalidated,
//         a._strict && (a._isValid = a._isValid && 0 === a._pf.charsLeftOver && 0 === a._pf.unusedTokens.length)),
//         a._isValid
//     }
//     function G(a) {
//         return a ? a.toLowerCase().replace("_", "-") : a
//     }
//     function H(a) {
//         for (var b, c, d, e, f = 0; f < a.length; ) {
//             for (e = G(a[f]).split("-"),
//             b = e.length,
//             c = G(a[f + 1]),
//             c = c ? c.split("-") : null ; b > 0; ) {
//                 if (d = I(e.slice(0, b).join("-")))
//                     return d;
//                 if (c && c.length >= b && v(e, c, !0) >= b - 1)
//                     break;
//                 b--
//             }
//             f++
//         }
//         return null
//     }
//     function I(a) {
//         var b = null ;
//         if (!Eb[a] && Gb)
//             try {
//                 b = rb.locale(),
//                 require("./locale/" + a),
//                 rb.locale(b)
//             } catch (c) {}
//         return Eb[a]
//     }
//     function J(a, b) {
//         return b._isUTC ? rb(a).zone(b._offset || 0) : rb(a).local()
//     }
//     function K(a) {
//         return a.match(/\[[\s\S]/) ? a.replace(/^\[|\]$/g, "") : a.replace(/\\/g, "")
//     }
//     function L(a) {
//         var b, c, d = a.match(Kb);
//         for (b = 0,
//         c = d.length; c > b; b++)
//             d[b] = mc[d[b]] ? mc[d[b]] : K(d[b]);
//         return function(e) {
//             var f = "";
//             for (b = 0; c > b; b++)
//                 f += d[b]instanceof Function ? d[b].call(e, a) : d[b];
//             return f
//         }
//     }
//     function M(a, b) {
//         return a.isValid() ? (b = N(b, a.localeData()),
//         ic[b] || (ic[b] = L(b)),
//         ic[b](a)) : a.localeData().invalidDate()
//     }
//     function N(a, b) {
//         function c(a) {
//             return b.longDateFormat(a) || a
//         }
//         var d = 5;
//         for (Lb.lastIndex = 0; d >= 0 && Lb.test(a); )
//             a = a.replace(Lb, c),
//             Lb.lastIndex = 0,
//             d -= 1;
//         return a
//     }
//     function O(a, b) {
//         var c, d = b._strict;
//         switch (a) {
//         case "Q":
//             return Wb;
//         case "DDDD":
//             return Yb;
//         case "YYYY":
//         case "GGGG":
//         case "gggg":
//             return d ? Zb : Ob;
//         case "Y":
//         case "G":
//         case "g":
//             return _b;
//         case "YYYYYY":
//         case "YYYYY":
//         case "GGGGG":
//         case "ggggg":
//             return d ? $b : Pb;
//         case "S":
//             if (d)
//                 return Wb;
//         case "SS":
//             if (d)
//                 return Xb;
//         case "SSS":
//             if (d)
//                 return Yb;
//         case "DDD":
//             return Nb;
//         case "MMM":
//         case "MMMM":
//         case "dd":
//         case "ddd":
//         case "dddd":
//             return Rb;
//         case "a":
//         case "A":
//             return b._locale._meridiemParse;
//         case "X":
//             return Ub;
//         case "Z":
//         case "ZZ":
//             return Sb;
//         case "T":
//             return Tb;
//         case "SSSS":
//             return Qb;
//         case "MM":
//         case "DD":
//         case "YY":
//         case "GG":
//         case "gg":
//         case "HH":
//         case "hh":
//         case "mm":
//         case "ss":
//         case "ww":
//         case "WW":
//             return d ? Xb : Mb;
//         case "M":
//         case "D":
//         case "d":
//         case "H":
//         case "h":
//         case "m":
//         case "s":
//         case "w":
//         case "W":
//         case "e":
//         case "E":
//             return Mb;
//         case "Do":
//             return Vb;
//         default:
//             return c = new RegExp(X(W(a.replace("\\", "")), "i"))
//         }
//     }
//     function P(a) {
//         a = a || "";
//         var b = a.match(Sb) || []
//           , c = b[b.length - 1] || []
//           , d = (c + "").match(ec) || ["-", 0, 0]
//           , e = +(60 * d[1]) + z(d[2]);
//         return "+" === d[0] ? -e : e
//     }
//     function Q(a, b, c) {
//         var d, e = c._a;
//         switch (a) {
//         case "Q":
//             null != b && (e[yb] = 3 * (z(b) - 1));
//             break;
//         case "M":
//         case "MM":
//             null != b && (e[yb] = z(b) - 1);
//             break;
//         case "MMM":
//         case "MMMM":
//             d = c._locale.monthsParse(b),
//             null != d ? e[yb] = d : c._pf.invalidMonth = b;
//             break;
//         case "D":
//         case "DD":
//             null != b && (e[zb] = z(b));
//             break;
//         case "Do":
//             null != b && (e[zb] = z(parseInt(b, 10)));
//             break;
//         case "DDD":
//         case "DDDD":
//             null != b && (c._dayOfYear = z(b));
//             break;
//         case "YY":
//             e[xb] = rb.parseTwoDigitYear(b);
//             break;
//         case "YYYY":
//         case "YYYYY":
//         case "YYYYYY":
//             e[xb] = z(b);
//             break;
//         case "a":
//         case "A":
//             c._isPm = c._locale.isPM(b);
//             break;
//         case "H":
//         case "HH":
//         case "h":
//         case "hh":
//             e[Ab] = z(b);
//             break;
//         case "m":
//         case "mm":
//             e[Bb] = z(b);
//             break;
//         case "s":
//         case "ss":
//             e[Cb] = z(b);
//             break;
//         case "S":
//         case "SS":
//         case "SSS":
//         case "SSSS":
//             e[Db] = z(1e3 * ("0." + b));
//             break;
//         case "X":
//             c._d = new Date(1e3 * parseFloat(b));
//             break;
//         case "Z":
//         case "ZZ":
//             c._useUTC = !0,
//             c._tzm = P(b);
//             break;
//         case "dd":
//         case "ddd":
//         case "dddd":
//             d = c._locale.weekdaysParse(b),
//             null != d ? (c._w = c._w || {},
//             c._w.d = d) : c._pf.invalidWeekday = b;
//             break;
//         case "w":
//         case "ww":
//         case "W":
//         case "WW":
//         case "d":
//         case "e":
//         case "E":
//             a = a.substr(0, 1);
//         case "gggg":
//         case "GGGG":
//         case "GGGGG":
//             a = a.substr(0, 2),
//             b && (c._w = c._w || {},
//             c._w[a] = z(b));
//             break;
//         case "gg":
//         case "GG":
//             c._w = c._w || {},
//             c._w[a] = rb.parseTwoDigitYear(b)
//         }
//     }
//     function R(a) {
//         var c, d, e, f, g, h, i;
//         c = a._w,
//         null != c.GG || null != c.W || null != c.E ? (g = 1,
//         h = 4,
//         d = b(c.GG, a._a[xb], fb(rb(), 1, 4).year),
//         e = b(c.W, 1),
//         f = b(c.E, 1)) : (g = a._locale._week.dow,
//         h = a._locale._week.doy,
//         d = b(c.gg, a._a[xb], fb(rb(), g, h).year),
//         e = b(c.w, 1),
//         null != c.d ? (f = c.d,
//         g > f && ++e) : f = null != c.e ? c.e + g : g),
//         i = gb(d, e, f, h, g),
//         a._a[xb] = i.year,
//         a._dayOfYear = i.dayOfYear
//     }
//     function S(a) {
//         var c, d, e, f, g = [];
//         if (!a._d) {
//             for (e = U(a),
//             a._w && null == a._a[zb] && null == a._a[yb] && R(a),
//             a._dayOfYear && (f = b(a._a[xb], e[xb]),
//             a._dayOfYear > C(f) && (a._pf._overflowDayOfYear = !0),
//             d = bb(f, 0, a._dayOfYear),
//             a._a[yb] = d.getUTCMonth(),
//             a._a[zb] = d.getUTCDate()),
//             c = 0; 3 > c && null == a._a[c]; ++c)
//                 a._a[c] = g[c] = e[c];
//             for (; 7 > c; c++)
//                 a._a[c] = g[c] = null == a._a[c] ? 2 === c ? 1 : 0 : a._a[c];
//             a._d = (a._useUTC ? bb : ab).apply(null , g),
//             null != a._tzm && a._d.setUTCMinutes(a._d.getUTCMinutes() + a._tzm)
//         }
//     }
//     function T(a) {
//         var b;
//         a._d || (b = x(a._i),
//         a._a = [b.year, b.month, b.day, b.hour, b.minute, b.second, b.millisecond],
//         S(a))
//     }
//     function U(a) {
//         var b = new Date;
//         return a._useUTC ? [b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()] : [b.getFullYear(), b.getMonth(), b.getDate()]
//     }
//     function V(a) {
//         if (a._f === rb.ISO_8601)
//             return void Z(a);
//         a._a = [],
//         a._pf.empty = !0;
//         var b, c, d, e, f, g = "" + a._i, h = g.length, i = 0;
//         for (d = N(a._f, a._locale).match(Kb) || [],
//         b = 0; b < d.length; b++)
//             e = d[b],
//             c = (g.match(O(e, a)) || [])[0],
//             c && (f = g.substr(0, g.indexOf(c)),
//             f.length > 0 && a._pf.unusedInput.push(f),
//             g = g.slice(g.indexOf(c) + c.length),
//             i += c.length),
//             mc[e] ? (c ? a._pf.empty = !1 : a._pf.unusedTokens.push(e),
//             Q(e, c, a)) : a._strict && !c && a._pf.unusedTokens.push(e);
//         a._pf.charsLeftOver = h - i,
//         g.length > 0 && a._pf.unusedInput.push(g),
//         a._isPm && a._a[Ab] < 12 && (a._a[Ab] += 12),
//         a._isPm === !1 && 12 === a._a[Ab] && (a._a[Ab] = 0),
//         S(a),
//         E(a)
//     }
//     function W(a) {
//         return a.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(a, b, c, d, e) {
//             return b || c || d || e
//         })
//     }
//     function X(a) {
//         return a.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
//     }
//     function Y(a) {
//         var b, d, e, f, g;
//         if (0 === a._f.length)
//             return a._pf.invalidFormat = !0,
//             void (a._d = new Date(0 / 0));
//         for (f = 0; f < a._f.length; f++)
//             g = 0,
//             b = m({}, a),
//             b._pf = c(),
//             b._f = a._f[f],
//             V(b),
//             F(b) && (g += b._pf.charsLeftOver,
//             g += 10 * b._pf.unusedTokens.length,
//             b._pf.score = g,
//             (null == e || e > g) && (e = g,
//             d = b));
//         l(a, d || b)
//     }
//     function Z(a) {
//         var b, c, d = a._i, e = ac.exec(d);
//         if (e) {
//             for (a._pf.iso = !0,
//             b = 0,
//             c = cc.length; c > b; b++)
//                 if (cc[b][1].exec(d)) {
//                     a._f = cc[b][0] + (e[6] || " ");
//                     break
//                 }
//             for (b = 0,
//             c = dc.length; c > b; b++)
//                 if (dc[b][1].exec(d)) {
//                     a._f += dc[b][0];
//                     break
//                 }
//             d.match(Sb) && (a._f += "Z"),
//             V(a)
//         } else
//             a._isValid = !1
//     }
//     function $(a) {
//         Z(a),
//         a._isValid === !1 && (delete a._isValid,
//         rb.createFromInputFallback(a))
//     }
//     function _(b) {
//         var c, d = b._i;
//         d === a ? b._d = new Date : u(d) ? b._d = new Date(+d) : null !== (c = Hb.exec(d)) ? b._d = new Date(+c[1]) : "string" == typeof d ? $(b) : t(d) ? (b._a = d.slice(0),
//         S(b)) : "object" == typeof d ? T(b) : "number" == typeof d ? b._d = new Date(d) : rb.createFromInputFallback(b)
//     }
//     function ab(a, b, c, d, e, f, g) {
//         var h = new Date(a,b,c,d,e,f,g);
//         return 1970 > a && h.setFullYear(a),
//         h
//     }
//     function bb(a) {
//         var b = new Date(Date.UTC.apply(null , arguments));
//         return 1970 > a && b.setUTCFullYear(a),
//         b
//     }
//     function cb(a, b) {
//         if ("string" == typeof a)
//             if (isNaN(a)) {
//                 if (a = b.weekdaysParse(a),
//                 "number" != typeof a)
//                     return null
//             } else
//                 a = parseInt(a, 10);
//         return a
//     }
//     function db(a, b, c, d, e) {
//         return e.relativeTime(b || 1, !!c, a, d)
//     }
//     function eb(a, b, c) {
//         var d = rb.duration(a).abs()
//           , e = wb(d.as("s"))
//           , f = wb(d.as("m"))
//           , g = wb(d.as("h"))
//           , h = wb(d.as("d"))
//           , i = wb(d.as("M"))
//           , j = wb(d.as("y"))
//           , k = e < jc.s && ["s", e] || 1 === f && ["m"] || f < jc.m && ["mm", f] || 1 === g && ["h"] || g < jc.h && ["hh", g] || 1 === h && ["d"] || h < jc.d && ["dd", h] || 1 === i && ["M"] || i < jc.M && ["MM", i] || 1 === j && ["y"] || ["yy", j];
//         return k[2] = b,
//         k[3] = +a > 0,
//         k[4] = c,
//         db.apply({}, k)
//     }
//     function fb(a, b, c) {
//         var d, e = c - b, f = c - a.day();
//         return f > e && (f -= 7),
//         e - 7 > f && (f += 7),
//         d = rb(a).add(f, "d"),
//         {
//             week: Math.ceil(d.dayOfYear() / 7),
//             year: d.year()
//         }
//     }
//     function gb(a, b, c, d, e) {
//         var f, g, h = bb(a, 0, 1).getUTCDay();
//         return h = 0 === h ? 7 : h,
//         c = null != c ? c : e,
//         f = e - h + (h > d ? 7 : 0) - (e > h ? 7 : 0),
//         g = 7 * (b - 1) + (c - e) + f + 1,
//         {
//             year: g > 0 ? a : a - 1,
//             dayOfYear: g > 0 ? g : C(a - 1) + g
//         }
//     }
//     function hb(b) {
//         var c = b._i
//           , d = b._f;
//         return b._locale = b._locale || rb.localeData(b._l),
//         null === c || d === a && "" === c ? rb.invalid({
//             nullInput: !0
//         }) : ("string" == typeof c && (b._i = c = b._locale.preparse(c)),
//         rb.isMoment(c) ? new j(c,!0) : (d ? t(d) ? Y(b) : V(b) : _(b),
//         new j(b)))
//     }
//     function ib(a, b) {
//         var c, d;
//         if (1 === b.length && t(b[0]) && (b = b[0]),
//         !b.length)
//             return rb();
//         for (c = b[0],
//         d = 1; d < b.length; ++d)
//             b[d][a](c) && (c = b[d]);
//         return c
//     }
//     function jb(a, b) {
//         var c;
//         return "string" == typeof b && (b = a.localeData().monthsParse(b),
//         "number" != typeof b) ? a : (c = Math.min(a.date(), A(a.year(), b)),
//         a._d["set" + (a._isUTC ? "UTC" : "") + "Month"](b, c),
//         a)
//     }
//     function kb(a, b) {
//         return a._d["get" + (a._isUTC ? "UTC" : "") + b]()
//     }
//     function lb(a, b, c) {
//         return "Month" === b ? jb(a, c) : a._d["set" + (a._isUTC ? "UTC" : "") + b](c)
//     }
//     function mb(a, b) {
//         return function(c) {
//             return null != c ? (lb(this, a, c),
//             rb.updateOffset(this, b),
//             this) : kb(this, a)
//         }
//     }
//     function nb(a) {
//         return 400 * a / 146097
//     }
//     function ob(a) {
//         return 146097 * a / 400
//     }
//     function pb(a) {
//         rb.duration.fn[a] = function() {
//             return this._data[a]
//         }
//     }
//     function qb(a) {
//         "undefined" == typeof ender && (sb = vb.moment,
//         vb.moment = a ? e("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.", rb) : rb)
//     }
//     for (var rb, sb, tb, ub = "2.8.1", vb = "undefined" != typeof global ? global : this, wb = Math.round, xb = 0, yb = 1, zb = 2, Ab = 3, Bb = 4, Cb = 5, Db = 6, Eb = {}, Fb = [], Gb = "undefined" != typeof module && module.exports, Hb = /^\/?Date\((\-?\d+)/i, Ib = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/, Jb = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/, Kb = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g, Lb = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g, Mb = /\d\d?/, Nb = /\d{1,3}/, Ob = /\d{1,4}/, Pb = /[+\-]?\d{1,6}/, Qb = /\d+/, Rb = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, Sb = /Z|[\+\-]\d\d:?\d\d/gi, Tb = /T/i, Ub = /[\+\-]?\d+(\.\d{1,3})?/, Vb = /\d{1,2}/, Wb = /\d/, Xb = /\d\d/, Yb = /\d{3}/, Zb = /\d{4}/, $b = /[+-]?\d{6}/, _b = /[+-]?\d+/, ac = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, bc = "YYYY-MM-DDTHH:mm:ssZ", cc = [["YYYYYY-MM-DD", /[+-]\d{6}-\d{2}-\d{2}/], ["YYYY-MM-DD", /\d{4}-\d{2}-\d{2}/], ["GGGG-[W]WW-E", /\d{4}-W\d{2}-\d/], ["GGGG-[W]WW", /\d{4}-W\d{2}/], ["YYYY-DDD", /\d{4}-\d{3}/]], dc = [["HH:mm:ss.SSSS", /(T| )\d\d:\d\d:\d\d\.\d+/], ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/], ["HH:mm", /(T| )\d\d:\d\d/], ["HH", /(T| )\d\d/]], ec = /([\+\-]|\d\d)/gi, fc = ("Date|Hours|Minutes|Seconds|Milliseconds".split("|"),
//     {
//         Milliseconds: 1,
//         Seconds: 1e3,
//         Minutes: 6e4,
//         Hours: 36e5,
//         Days: 864e5,
//         Months: 2592e6,
//         Years: 31536e6
//     }), gc = {
//         ms: "millisecond",
//         s: "second",
//         m: "minute",
//         h: "hour",
//         d: "day",
//         D: "date",
//         w: "week",
//         W: "isoWeek",
//         M: "month",
//         Q: "quarter",
//         y: "year",
//         DDD: "dayOfYear",
//         e: "weekday",
//         E: "isoWeekday",
//         gg: "weekYear",
//         GG: "isoWeekYear"
//     }, hc = {
//         dayofyear: "dayOfYear",
//         isoweekday: "isoWeekday",
//         isoweek: "isoWeek",
//         weekyear: "weekYear",
//         isoweekyear: "isoWeekYear"
//     }, ic = {}, jc = {
//         s: 45,
//         m: 45,
//         h: 22,
//         d: 26,
//         M: 11
//     }, kc = "DDD w W M D d".split(" "), lc = "M D H h m s w W".split(" "), mc = {
//         M: function() {
//             return this.month() + 1
//         },
//         MMM: function(a) {
//             return this.localeData().monthsShort(this, a)
//         },
//         MMMM: function(a) {
//             return this.localeData().months(this, a)
//         },
//         D: function() {
//             return this.date()
//         },
//         DDD: function() {
//             return this.dayOfYear()
//         },
//         d: function() {
//             return this.day()
//         },
//         dd: function(a) {
//             return this.localeData().weekdaysMin(this, a)
//         },
//         ddd: function(a) {
//             return this.localeData().weekdaysShort(this, a)
//         },
//         dddd: function(a) {
//             return this.localeData().weekdays(this, a)
//         },
//         w: function() {
//             return this.week()
//         },
//         W: function() {
//             return this.isoWeek()
//         },
//         YY: function() {
//             return o(this.year() % 100, 2)
//         },
//         YYYY: function() {
//             return o(this.year(), 4)
//         },
//         YYYYY: function() {
//             return o(this.year(), 5)
//         },
//         YYYYYY: function() {
//             var a = this.year()
//               , b = a >= 0 ? "+" : "-";
//             return b + o(Math.abs(a), 6)
//         },
//         gg: function() {
//             return o(this.weekYear() % 100, 2)
//         },
//         gggg: function() {
//             return o(this.weekYear(), 4)
//         },
//         ggggg: function() {
//             return o(this.weekYear(), 5)
//         },
//         GG: function() {
//             return o(this.isoWeekYear() % 100, 2)
//         },
//         GGGG: function() {
//             return o(this.isoWeekYear(), 4)
//         },
//         GGGGG: function() {
//             return o(this.isoWeekYear(), 5)
//         },
//         e: function() {
//             return this.weekday()
//         },
//         E: function() {
//             return this.isoWeekday()
//         },
//         a: function() {
//             return this.localeData().meridiem(this.hours(), this.minutes(), !0)
//         },
//         A: function() {
//             return this.localeData().meridiem(this.hours(), this.minutes(), !1)
//         },
//         H: function() {
//             return this.hours()
//         },
//         h: function() {
//             return this.hours() % 12 || 12
//         },
//         m: function() {
//             return this.minutes()
//         },
//         s: function() {
//             return this.seconds()
//         },
//         S: function() {
//             return z(this.milliseconds() / 100)
//         },
//         SS: function() {
//             return o(z(this.milliseconds() / 10), 2)
//         },
//         SSS: function() {
//             return o(this.milliseconds(), 3)
//         },
//         SSSS: function() {
//             return o(this.milliseconds(), 3)
//         },
//         Z: function() {
//             var a = -this.zone()
//               , b = "+";
//             return 0 > a && (a = -a,
//             b = "-"),
//             b + o(z(a / 60), 2) + ":" + o(z(a) % 60, 2)
//         },
//         ZZ: function() {
//             var a = -this.zone()
//               , b = "+";
//             return 0 > a && (a = -a,
//             b = "-"),
//             b + o(z(a / 60), 2) + o(z(a) % 60, 2)
//         },
//         z: function() {
//             return this.zoneAbbr()
//         },
//         zz: function() {
//             return this.zoneName()
//         },
//         X: function() {
//             return this.unix()
//         },
//         Q: function() {
//             return this.quarter()
//         }
//     }, nc = {}, oc = ["months", "monthsShort", "weekdays", "weekdaysShort", "weekdaysMin"]; kc.length; )
//         tb = kc.pop(),
//         mc[tb + "o"] = h(mc[tb], tb);
//     for (; lc.length; )
//         tb = lc.pop(),
//         mc[tb + tb] = g(mc[tb], 2);
//     mc.DDDD = g(mc.DDD, 3),
//     l(i.prototype, {
//         set: function(a) {
//             var b, c;
//             for (c in a)
//                 b = a[c],
//                 "function" == typeof b ? this[c] = b : this["_" + c] = b
//         },
//         _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
//         months: function(a) {
//             return this._months[a.month()]
//         },
//         _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
//         monthsShort: function(a) {
//             return this._monthsShort[a.month()]
//         },
//         monthsParse: function(a) {
//             var b, c, d;
//             for (this._monthsParse || (this._monthsParse = []),
//             b = 0; 12 > b; b++)
//                 if (this._monthsParse[b] || (c = rb.utc([2e3, b]),
//                 d = "^" + this.months(c, "") + "|^" + this.monthsShort(c, ""),
//                 this._monthsParse[b] = new RegExp(d.replace(".", ""),"i")),
//                 this._monthsParse[b].test(a))
//                     return b
//         },
//         _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
//         weekdays: function(a) {
//             return this._weekdays[a.day()]
//         },
//         _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
//         weekdaysShort: function(a) {
//             return this._weekdaysShort[a.day()]
//         },
//         _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
//         weekdaysMin: function(a) {
//             return this._weekdaysMin[a.day()]
//         },
//         weekdaysParse: function(a) {
//             var b, c, d;
//             for (this._weekdaysParse || (this._weekdaysParse = []),
//             b = 0; 7 > b; b++)
//                 if (this._weekdaysParse[b] || (c = rb([2e3, 1]).day(b),
//                 d = "^" + this.weekdays(c, "") + "|^" + this.weekdaysShort(c, "") + "|^" + this.weekdaysMin(c, ""),
//                 this._weekdaysParse[b] = new RegExp(d.replace(".", ""),"i")),
//                 this._weekdaysParse[b].test(a))
//                     return b
//         },
//         _longDateFormat: {
//             LT: "h:mm A",
//             L: "MM/DD/YYYY",
//             LL: "MMMM D, YYYY",
//             LLL: "MMMM D, YYYY LT",
//             LLLL: "dddd, MMMM D, YYYY LT"
//         },
//         longDateFormat: function(a) {
//             var b = this._longDateFormat[a];
//             return !b && this._longDateFormat[a.toUpperCase()] && (b = this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function(a) {
//                 return a.slice(1)
//             }),
//             this._longDateFormat[a] = b),
//             b
//         },
//         isPM: function(a) {
//             return "p" === (a + "").toLowerCase().charAt(0)
//         },
//         _meridiemParse: /[ap]\.?m?\.?/i,
//         meridiem: function(a, b, c) {
//             return a > 11 ? c ? "pm" : "PM" : c ? "am" : "AM"
//         },
//         _calendar: {
//             sameDay: "[Today at] LT",
//             nextDay: "[Tomorrow at] LT",
//             nextWeek: "dddd [at] LT",
//             lastDay: "[Yesterday at] LT",
//             lastWeek: "[Last] dddd [at] LT",
//             sameElse: "L"
//         },
//         calendar: function(a, b) {
//             var c = this._calendar[a];
//             return "function" == typeof c ? c.apply(b) : c
//         },
//         _relativeTime: {
//             future: "in %s",
//             past: "%s ago",
//             s: "a few seconds",
//             m: "a minute",
//             mm: "%d minutes",
//             h: "an hour",
//             hh: "%d hours",
//             d: "a day",
//             dd: "%d days",
//             M: "a month",
//             MM: "%d months",
//             y: "a year",
//             yy: "%d years"
//         },
//         relativeTime: function(a, b, c, d) {
//             var e = this._relativeTime[c];
//             return "function" == typeof e ? e(a, b, c, d) : e.replace(/%d/i, a)
//         },
//         pastFuture: function(a, b) {
//             var c = this._relativeTime[a > 0 ? "future" : "past"];
//             return "function" == typeof c ? c(b) : c.replace(/%s/i, b)
//         },
//         ordinal: function(a) {
//             return this._ordinal.replace("%d", a)
//         },
//         _ordinal: "%d",
//         preparse: function(a) {
//             return a
//         },
//         postformat: function(a) {
//             return a
//         },
//         week: function(a) {
//             return fb(a, this._week.dow, this._week.doy).week
//         },
//         _week: {
//             dow: 0,
//             doy: 6
//         },
//         _invalidDate: "Invalid date",
//         invalidDate: function() {
//             return this._invalidDate
//         }
//     }),
//     rb = function(b, d, e, f) {
//         var g;
//         return "boolean" == typeof e && (f = e,
//         e = a),
//         g = {},
//         g._isAMomentObject = !0,
//         g._i = b,
//         g._f = d,
//         g._l = e,
//         g._strict = f,
//         g._isUTC = !1,
//         g._pf = c(),
//         hb(g)
//     }
//     ,
//     rb.suppressDeprecationWarnings = !1,
//     rb.createFromInputFallback = e("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.", function(a) {
//         a._d = new Date(a._i)
//     }),
//     rb.min = function() {
//         var a = [].slice.call(arguments, 0);
//         return ib("isBefore", a)
//     }
//     ,
//     rb.max = function() {
//         var a = [].slice.call(arguments, 0);
//         return ib("isAfter", a)
//     }
//     ,
//     rb.utc = function(b, d, e, f) {
//         var g;
//         return "boolean" == typeof e && (f = e,
//         e = a),
//         g = {},
//         g._isAMomentObject = !0,
//         g._useUTC = !0,
//         g._isUTC = !0,
//         g._l = e,
//         g._i = b,
//         g._f = d,
//         g._strict = f,
//         g._pf = c(),
//         hb(g).utc()
//     }
//     ,
//     rb.unix = function(a) {
//         return rb(1e3 * a)
//     }
//     ,
//     rb.duration = function(a, b) {
//         var c, d, e, f, g = a, h = null ;
//         return rb.isDuration(a) ? g = {
//             ms: a._milliseconds,
//             d: a._days,
//             M: a._months
//         } : "number" == typeof a ? (g = {},
//         b ? g[b] = a : g.milliseconds = a) : (h = Ib.exec(a)) ? (c = "-" === h[1] ? -1 : 1,
//         g = {
//             y: 0,
//             d: z(h[zb]) * c,
//             h: z(h[Ab]) * c,
//             m: z(h[Bb]) * c,
//             s: z(h[Cb]) * c,
//             ms: z(h[Db]) * c
//         }) : (h = Jb.exec(a)) ? (c = "-" === h[1] ? -1 : 1,
//         e = function(a) {
//             var b = a && parseFloat(a.replace(",", "."));
//             return (isNaN(b) ? 0 : b) * c
//         }
//         ,
//         g = {
//             y: e(h[2]),
//             M: e(h[3]),
//             d: e(h[4]),
//             h: e(h[5]),
//             m: e(h[6]),
//             s: e(h[7]),
//             w: e(h[8])
//         }) : "object" == typeof g && ("from"in g || "to"in g) && (f = q(rb(g.from), rb(g.to)),
//         g = {},
//         g.ms = f.milliseconds,
//         g.M = f.months),
//         d = new k(g),
//         rb.isDuration(a) && a.hasOwnProperty("_locale") && (d._locale = a._locale),
//         d
//     }
//     ,
//     rb.version = ub,
//     rb.defaultFormat = bc,
//     rb.ISO_8601 = function() {}
//     ,
//     rb.momentProperties = Fb,
//     rb.updateOffset = function() {}
//     ,
//     rb.relativeTimeThreshold = function(b, c) {
//         return jc[b] === a ? !1 : c === a ? jc[b] : (jc[b] = c,
//         !0)
//     }
//     ,
//     rb.lang = e("moment.lang is deprecated. Use moment.locale instead.", function(a, b) {
//         return rb.locale(a, b)
//     }),
//     rb.locale = function(a, b) {
//         var c;
//         return a && (c = "undefined" != typeof b ? rb.defineLocale(a, b) : rb.localeData(a),
//         c && (rb.duration._locale = rb._locale = c)),
//         rb._locale._abbr
//     }
//     ,
//     rb.defineLocale = function(a, b) {
//         return null !== b ? (b.abbr = a,
//         Eb[a] || (Eb[a] = new i),
//         Eb[a].set(b),
//         rb.locale(a),
//         Eb[a]) : (delete Eb[a],
//         null )
//     }
//     ,
//     rb.langData = e("moment.langData is deprecated. Use moment.localeData instead.", function(a) {
//         return rb.localeData(a)
//     }),
//     rb.localeData = function(a) {
//         var b;
//         if (a && a._locale && a._locale._abbr && (a = a._locale._abbr),
//         !a)
//             return rb._locale;
//         if (!t(a)) {
//             if (b = I(a))
//                 return b;
//             a = [a]
//         }
//         return H(a)
//     }
//     ,
//     rb.isMoment = function(a) {
//         return a instanceof j || null != a && a.hasOwnProperty("_isAMomentObject")
//     }
//     ,
//     rb.isDuration = function(a) {
//         return a instanceof k
//     }
//     ;
//     for (tb = oc.length - 1; tb >= 0; --tb)
//         y(oc[tb]);
//     rb.normalizeUnits = function(a) {
//         return w(a)
//     }
//     ,
//     rb.invalid = function(a) {
//         var b = rb.utc(0 / 0);
//         return null != a ? l(b._pf, a) : b._pf.userInvalidated = !0,
//         b
//     }
//     ,
//     rb.parseZone = function() {
//         return rb.apply(null , arguments).parseZone()
//     }
//     ,
//     rb.parseTwoDigitYear = function(a) {
//         return z(a) + (z(a) > 68 ? 1900 : 2e3)
//     }
//     ,
//     l(rb.fn = j.prototype, {
//         clone: function() {
//             return rb(this)
//         },
//         valueOf: function() {
//             return +this._d + 6e4 * (this._offset || 0)
//         },
//         unix: function() {
//             return Math.floor(+this / 1e3)
//         },
//         toString: function() {
//             return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
//         },
//         toDate: function() {
//             return this._offset ? new Date(+this) : this._d
//         },
//         toISOString: function() {
//             var a = rb(this).utc();
//             return 0 < a.year() && a.year() <= 9999 ? M(a, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : M(a, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
//         },
//         toArray: function() {
//             var a = this;
//             return [a.year(), a.month(), a.date(), a.hours(), a.minutes(), a.seconds(), a.milliseconds()]
//         },
//         isValid: function() {
//             return F(this)
//         },
//         isDSTShifted: function() {
//             return this._a ? this.isValid() && v(this._a, (this._isUTC ? rb.utc(this._a) : rb(this._a)).toArray()) > 0 : !1
//         },
//         parsingFlags: function() {
//             return l({}, this._pf)
//         },
//         invalidAt: function() {
//             return this._pf.overflow
//         },
//         utc: function(a) {
//             return this.zone(0, a)
//         },
//         local: function(a) {
//             return this._isUTC && (this.zone(0, a),
//             this._isUTC = !1,
//             a && this.add(this._d.getTimezoneOffset(), "m")),
//             this
//         },
//         format: function(a) {
//             var b = M(this, a || rb.defaultFormat);
//             return this.localeData().postformat(b)
//         },
//         add: r(1, "add"),
//         subtract: r(-1, "subtract"),
//         diff: function(a, b, c) {
//             var d, e, f = J(a, this), g = 6e4 * (this.zone() - f.zone());
//             return b = w(b),
//             "year" === b || "month" === b ? (d = 432e5 * (this.daysInMonth() + f.daysInMonth()),
//             e = 12 * (this.year() - f.year()) + (this.month() - f.month()),
//             e += (this - rb(this).startOf("month") - (f - rb(f).startOf("month"))) / d,
//             e -= 6e4 * (this.zone() - rb(this).startOf("month").zone() - (f.zone() - rb(f).startOf("month").zone())) / d,
//             "year" === b && (e /= 12)) : (d = this - f,
//             e = "second" === b ? d / 1e3 : "minute" === b ? d / 6e4 : "hour" === b ? d / 36e5 : "day" === b ? (d - g) / 864e5 : "week" === b ? (d - g) / 6048e5 : d),
//             c ? e : n(e)
//         },
//         from: function(a, b) {
//             return rb.duration({
//                 to: this,
//                 from: a
//             }).locale(this.locale()).humanize(!b)
//         },
//         fromNow: function(a) {
//             return this.from(rb(), a)
//         },
//         calendar: function(a) {
//             var b = a || rb()
//               , c = J(b, this).startOf("day")
//               , d = this.diff(c, "days", !0)
//               , e = -6 > d ? "sameElse" : -1 > d ? "lastWeek" : 0 > d ? "lastDay" : 1 > d ? "sameDay" : 2 > d ? "nextDay" : 7 > d ? "nextWeek" : "sameElse";
//             return this.format(this.localeData().calendar(e, this))
//         },
//         isLeapYear: function() {
//             return D(this.year())
//         },
//         isDST: function() {
//             return this.zone() < this.clone().month(0).zone() || this.zone() < this.clone().month(5).zone()
//         },
//         day: function(a) {
//             var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
//             return null != a ? (a = cb(a, this.localeData()),
//             this.add(a - b, "d")) : b
//         },
//         month: mb("Month", !0),
//         startOf: function(a) {
//             switch (a = w(a)) {
//             case "year":
//                 this.month(0);
//             case "quarter":
//             case "month":
//                 this.date(1);
//             case "week":
//             case "isoWeek":
//             case "day":
//                 this.hours(0);
//             case "hour":
//                 this.minutes(0);
//             case "minute":
//                 this.seconds(0);
//             case "second":
//                 this.milliseconds(0)
//             }
//             return "week" === a ? this.weekday(0) : "isoWeek" === a && this.isoWeekday(1),
//             "quarter" === a && this.month(3 * Math.floor(this.month() / 3)),
//             this
//         },
//         endOf: function(a) {
//             return a = w(a),
//             this.startOf(a).add(1, "isoWeek" === a ? "week" : a).subtract(1, "ms")
//         },
//         isAfter: function(a, b) {
//             return b = "undefined" != typeof b ? b : "millisecond",
//             +this.clone().startOf(b) > +rb(a).startOf(b)
//         },
//         isBefore: function(a, b) {
//             return b = "undefined" != typeof b ? b : "millisecond",
//             +this.clone().startOf(b) < +rb(a).startOf(b)
//         },
//         isSame: function(a, b) {
//             return b = b || "ms",
//             +this.clone().startOf(b) === +J(a, this).startOf(b)
//         },
//         min: e("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548", function(a) {
//             return a = rb.apply(null , arguments),
//             this > a ? this : a
//         }),
//         max: e("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548", function(a) {
//             return a = rb.apply(null , arguments),
//             a > this ? this : a
//         }),
//         zone: function(a, b) {
//             var c, d = this._offset || 0;
//             return null == a ? this._isUTC ? d : this._d.getTimezoneOffset() : ("string" == typeof a && (a = P(a)),
//             Math.abs(a) < 16 && (a = 60 * a),
//             !this._isUTC && b && (c = this._d.getTimezoneOffset()),
//             this._offset = a,
//             this._isUTC = !0,
//             null != c && this.subtract(c, "m"),
//             d !== a && (!b || this._changeInProgress ? s(this, rb.duration(d - a, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0,
//             rb.updateOffset(this, !0),
//             this._changeInProgress = null )),
//             this)
//         },
//         zoneAbbr: function() {
//             return this._isUTC ? "UTC" : ""
//         },
//         zoneName: function() {
//             return this._isUTC ? "Coordinated Universal Time" : ""
//         },
//         parseZone: function() {
//             return this._tzm ? this.zone(this._tzm) : "string" == typeof this._i && this.zone(this._i),
//             this
//         },
//         hasAlignedHourOffset: function(a) {
//             return a = a ? rb(a).zone() : 0,
//             (this.zone() - a) % 60 === 0
//         },
//         daysInMonth: function() {
//             return A(this.year(), this.month())
//         },
//         dayOfYear: function(a) {
//             var b = wb((rb(this).startOf("day") - rb(this).startOf("year")) / 864e5) + 1;
//             return null == a ? b : this.add(a - b, "d")
//         },
//         quarter: function(a) {
//             return null == a ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (a - 1) + this.month() % 3)
//         },
//         weekYear: function(a) {
//             var b = fb(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
//             return null == a ? b : this.add(a - b, "y")
//         },
//         isoWeekYear: function(a) {
//             var b = fb(this, 1, 4).year;
//             return null == a ? b : this.add(a - b, "y")
//         },
//         week: function(a) {
//             var b = this.localeData().week(this);
//             return null == a ? b : this.add(7 * (a - b), "d")
//         },
//         isoWeek: function(a) {
//             var b = fb(this, 1, 4).week;
//             return null == a ? b : this.add(7 * (a - b), "d")
//         },
//         weekday: function(a) {
//             var b = (this.day() + 7 - this.localeData()._week.dow) % 7;
//             return null == a ? b : this.add(a - b, "d")
//         },
//         isoWeekday: function(a) {
//             return null == a ? this.day() || 7 : this.day(this.day() % 7 ? a : a - 7)
//         },
//         isoWeeksInYear: function() {
//             return B(this.year(), 1, 4)
//         },
//         weeksInYear: function() {
//             var a = this.localeData()._week;
//             return B(this.year(), a.dow, a.doy)
//         },
//         get: function(a) {
//             return a = w(a),
//             this[a]()
//         },
//         set: function(a, b) {
//             return a = w(a),
//             "function" == typeof this[a] && this[a](b),
//             this
//         },
//         locale: function(b) {
//             return b === a ? this._locale._abbr : (this._locale = rb.localeData(b),
//             this)
//         },
//         lang: e("moment().lang() is deprecated. Use moment().localeData() instead.", function(b) {
//             return b === a ? this.localeData() : (this._locale = rb.localeData(b),
//             this)
//         }),
//         localeData: function() {
//             return this._locale
//         }
//     }),
//     rb.fn.millisecond = rb.fn.milliseconds = mb("Milliseconds", !1),
//     rb.fn.second = rb.fn.seconds = mb("Seconds", !1),
//     rb.fn.minute = rb.fn.minutes = mb("Minutes", !1),
//     rb.fn.hour = rb.fn.hours = mb("Hours", !0),
//     rb.fn.date = mb("Date", !0),
//     rb.fn.dates = e("dates accessor is deprecated. Use date instead.", mb("Date", !0)),
//     rb.fn.year = mb("FullYear", !0),
//     rb.fn.years = e("years accessor is deprecated. Use year instead.", mb("FullYear", !0)),
//     rb.fn.days = rb.fn.day,
//     rb.fn.months = rb.fn.month,
//     rb.fn.weeks = rb.fn.week,
//     rb.fn.isoWeeks = rb.fn.isoWeek,
//     rb.fn.quarters = rb.fn.quarter,
//     rb.fn.toJSON = rb.fn.toISOString,
//     l(rb.duration.fn = k.prototype, {
//         _bubble: function() {
//             var a, b, c, d = this._milliseconds, e = this._days, f = this._months, g = this._data, h = 0;
//             g.milliseconds = d % 1e3,
//             a = n(d / 1e3),
//             g.seconds = a % 60,
//             b = n(a / 60),
//             g.minutes = b % 60,
//             c = n(b / 60),
//             g.hours = c % 24,
//             e += n(c / 24),
//             h = n(nb(e)),
//             e -= n(ob(h)),
//             f += n(e / 30),
//             e %= 30,
//             h += n(f / 12),
//             f %= 12,
//             g.days = e,
//             g.months = f,
//             g.years = h
//         },
//         abs: function() {
//             return this._milliseconds = Math.abs(this._milliseconds),
//             this._days = Math.abs(this._days),
//             this._months = Math.abs(this._months),
//             this._data.milliseconds = Math.abs(this._data.milliseconds),
//             this._data.seconds = Math.abs(this._data.seconds),
//             this._data.minutes = Math.abs(this._data.minutes),
//             this._data.hours = Math.abs(this._data.hours),
//             this._data.months = Math.abs(this._data.months),
//             this._data.years = Math.abs(this._data.years),
//             this
//         },
//         weeks: function() {
//             return n(this.days() / 7)
//         },
//         valueOf: function() {
//             return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * z(this._months / 12)
//         },
//         humanize: function(a) {
//             var b = eb(this, !a, this.localeData());
//             return a && (b = this.localeData().pastFuture(+this, b)),
//             this.localeData().postformat(b)
//         },
//         add: function(a, b) {
//             var c = rb.duration(a, b);
//             return this._milliseconds += c._milliseconds,
//             this._days += c._days,
//             this._months += c._months,
//             this._bubble(),
//             this
//         },
//         subtract: function(a, b) {
//             var c = rb.duration(a, b);
//             return this._milliseconds -= c._milliseconds,
//             this._days -= c._days,
//             this._months -= c._months,
//             this._bubble(),
//             this
//         },
//         get: function(a) {
//             return a = w(a),
//             this[a.toLowerCase() + "s"]()
//         },
//         as: function(a) {
//             var b, c;
//             if (a = w(a),
//             b = this._days + this._milliseconds / 864e5,
//             "month" === a || "year" === a)
//                 return c = this._months + 12 * nb(b),
//                 "month" === a ? c : c / 12;
//             switch (b += ob(this._months / 12),
//             a) {
//             case "week":
//                 return b / 7;
//             case "day":
//                 return b;
//             case "hour":
//                 return 24 * b;
//             case "minute":
//                 return 24 * b * 60;
//             case "second":
//                 return 24 * b * 60 * 60;
//             case "millisecond":
//                 return 24 * b * 60 * 60 * 1e3;
//             default:
//                 throw new Error("Unknown unit " + a)
//             }
//         },
//         lang: rb.fn.lang,
//         locale: rb.fn.locale,
//         toIsoString: e("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", function() {
//             return this.toISOString()
//         }),
//         toISOString: function() {
//             var a = Math.abs(this.years())
//               , b = Math.abs(this.months())
//               , c = Math.abs(this.days())
//               , d = Math.abs(this.hours())
//               , e = Math.abs(this.minutes())
//               , f = Math.abs(this.seconds() + this.milliseconds() / 1e3);
//             return this.asSeconds() ? (this.asSeconds() < 0 ? "-" : "") + "P" + (a ? a + "Y" : "") + (b ? b + "M" : "") + (c ? c + "D" : "") + (d || e || f ? "T" : "") + (d ? d + "H" : "") + (e ? e + "M" : "") + (f ? f + "S" : "") : "P0D"
//         },
//         localeData: function() {
//             return this._locale
//         }
//     });
//     for (tb in fc)
//         fc.hasOwnProperty(tb) && pb(tb.toLowerCase());
//     rb.duration.fn.asMilliseconds = function() {
//         return this.as("ms")
//     }
//     ,
//     rb.duration.fn.asSeconds = function() {
//         return this.as("s")
//     }
//     ,
//     rb.duration.fn.asMinutes = function() {
//         return this.as("m")
//     }
//     ,
//     rb.duration.fn.asHours = function() {
//         return this.as("h")
//     }
//     ,
//     rb.duration.fn.asDays = function() {
//         return this.as("d")
//     }
//     ,
//     rb.duration.fn.asWeeks = function() {
//         return this.as("weeks")
//     }
//     ,
//     rb.duration.fn.asMonths = function() {
//         return this.as("M")
//     }
//     ,
//     rb.duration.fn.asYears = function() {
//         return this.as("y")
//     }
//     ,
//     rb.locale("en", {
//         ordinal: function(a) {
//             var b = a % 10
//               , c = 1 === z(a % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
//             return a + c
//         }
//     }),
//     Gb ? module.exports = rb : "function" == typeof define && define.amd ? (define("moment", function(a, b, c) {
//         return c.config && c.config() && c.config().noGlobal === !0 && (vb.moment = sb),
//         rb
//     }),
//     qb(!0)) : qb()
// }
// ).call(this);
// ;(function() {
//     window.validateDate = function(date) {
//         var pattern;
//         pattern = new RegExp(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/);
//         return pattern.test(date)
//     }
//     ;
//     window.validatePhone = function(tel) {
//         var error, stripped;
//         error = "";
//         stripped = tel.replace(/[\.\(\)\@\!\-\#\$\%\^\&\*\=\_\|\ ]/g, '');
//         if (tel === "") {
//             error = "Required\n"
//         } else if (isNaN(parseInt(stripped))) {
//             error = "Invalid Phone format\n"
//         } else if (!(stripped.length === 10) && !(stripped.length === 11))
//             error = "Invalid Phone format\n";
//         return error
//     }
//     ;
//     window.isValidEmailAddress = function(emailAddress) {
//         var pattern;
//         pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
//         return pattern.test(emailAddress)
//     }
//     ;
//     window.timeInMinutes = function(time) {
//         var hours, meridian, minutes, totalMinutes;
//         meridian = time.split(' ')[1];
//         hours = parseInt(time.split(':')[0]);
//         minutes = parseInt(time.split(':')[1]);
//         totalMinutes = 0;
//         if (meridian === 'am') {
//             if (hours === 12)
//                 hours = 0
//         } else if (hours !== 12)
//             hours += 12;
//         return (hours * 60) + minutes
//     }
//     ;
//     window.getUrlParameters = function(queryString) {
//         var multiparam, parameters;
//         if (queryString == null )
//             queryString = window.location.search;
//         if (!(queryString != null ) || queryString === null )
//             queryString = "";
//         queryString = queryString.replace("?", "");
//         multiparam = /\[\]/;
//         parameters = {};
//         if (queryString && queryString.length > 0)
//             $.each(queryString.split('&'), function(c, query) {
//                 var key, value, _ref;
//                 _ref = query.split('='),
//                 key = _ref[0],
//                 value = _ref[1];
//                 key = decodeURIComponent(key);
//                 value = decodeURIComponent(value).replace(/\+/g, " ");
//                 if (key.match(multiparam)) {
//                     key = key.replace(multiparam, '');
//                     if (parameters[key] == null )
//                         parameters[key] = []
//                 }
//                 ;if (parameters[key]instanceof Array) {
//                     return parameters[key].push(value)
//                 } else
//                     return parameters[key] = value
//             });
//         return parameters
//     }
//     ;
//     window.getUrlParameter = function(name, backup) {
//         var param, params;
//         if (backup == null )
//             backup = null ;
//         params = getUrlParameters();
//         return param = _.has(params, name) ? params[name] : backup
//     }
//     ;
//     window.clone = function(obj) {
//         var flags, key, newInstance;
//         if (!(obj != null ) || typeof obj !== 'object')
//             return obj;
//         if (obj instanceof Date)
//             return new Date(obj.getTime());
//         if (obj instanceof RegExp) {
//             flags = '';
//             if (obj.global != null )
//                 flags += 'g';
//             if (obj.ignoreCase != null )
//                 flags += 'i';
//             if (obj.multiline != null )
//                 flags += 'm';
//             if (obj.sticky != null )
//                 flags += 'y';
//             return new RegExp(obj.source,flags)
//         }
//         ;newInstance = new obj.constructor();
//         for (key in obj)
//             newInstance[key] = clone(obj[key]);
//         return newInstance
//     }
//     ;
//     window.isIE9OrBelow = function() {
//         return /MSIE\s/.test(window.navigator.userAgent) && parseFloat(window.navigator.appVersion.split("MSIE")[1]) < 10
//     }
//     ;
//     window.goToByScroll = function(jquerySelector) {
//         return $('html,body').animate({
//             scrollTop: $(jquerySelector).offset().top - $('header').height()
//         }, 'slow')
//     }
//     ;
//     (function($) {
//         $.fn.nofollow = function(options) {
//             return this.each(function() {
//                 var $this, elementData, i, newElementHtml;
//                 $this = $(this);
//                 elementData = $this.data('element');
//                 newElementHtml = '';
//                 i = 0;
//                 while (i < elementData.length) {
//                     newElementHtml += String.fromCharCode(parseInt(elementData.substring(i, i + 2), 16));
//                     i += 2
//                 }
//                 ;$this.replaceWith(newElementHtml)
//             })
//         }
//     })(jQuery);
//     window.brightenColor = function(code, brightness) {
//         var b, g, num, r;
//         num = parseInt(code, 16);
//         r = (num >> 16) + brightness;
//         if (r > 255) {
//             r = 255
//         } else if (r < 0)
//             r = 0;
//         b = ((num >> 8) & 0x00FF) + brightness;
//         if (b > 255) {
//             b = 255
//         } else if (b < 0)
//             b = 0;
//         g = (num & 0x0000FF) + brightness;
//         if (g > 255) {
//             g = 255
//         } else if (g < 0)
//             g = 0;
//         return (g | (b << 8) | (r << 16)).toString(16)
//     }
//     ;
//     window.rgb2hex = function(rgb) {
//         var hex;
//         if (rgb.search("rgb") === -1) {
//             return rgb
//         } else {
//             rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
//             hex = function(x) {
//                 return ("0" + parseInt(x).toString(16)).slice(-2)
//             }
//             ;
//             return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])
//         }
//     }
// }
// ).call(this);
// ;




// (function() {
//     var root;
//     root = typeof exports !== "undefined" && exports !== null ? exports : this;
//     if (typeof MDOCS !== "undefined" && MDOCS !== null )
//         MDOCS.ob = {
//             ready: false,
//             cta: void (0),
//             ctaHtml: void (0),
//             calSkipProviderSel: false,
//             calNoDocs: false,
//             reasonsFilterBookings: false,
//             reasons: [],
//             step2Required: false,
//             calendarLabel: void (0),
//             bookNowLabel: void (0),
//             bookingFields: ['newpatient', 'firstname', 'lastname', 'email', 'phone', 'reason', 'date_of_birth', 'sex', 'comment', 'insurance_provider_id', 'insurance_id_number', 'insurance_group_number', 'insurance_phone'],
//             showLegalCheckboxes: false,
//             checkedLegalCheckboxes: false,
//             calLoaded: false,
//             cals: {},
//             calPracticeId: void (0),
//             calDoctorId: void (0),
//             calDoctor: void (0),
//             calDoctors: void (0),
//             calLocationId: void (0),
//             calLocation: void (0),
//             calLocations: void (0),
//             insurances: void (0),
//             submitFromState: void (0),
//             calDirSettings: void (0),
//             allDocsIns: void (0),
//             allDocsLangs: void (0),
//             allLocs: void (0),
//             allDocLocs: void (0),
//             allSpecs: void (0),
//             filterNewPatients: '',
//             filterSpecialties: '',
//             filterInsurance: '',
//             filterGender: '',
//             filterLangs: '',
//             filterLocations: '',
//             apptPhone: '',
//             screeningSettings: void (0),
//             newpatient: void (0),
//             currentlySliding: false,
//             currentSlide: 0,
//             chunks: 0,
//             isScrollingSlots: false,
//             init: function() {
//                 if (MDOCS.ob.ready)
//                     return true;
//                 if (window.isIE9OrBelow()) {
//                     root.$.getScript(MDOCS.endpoint + "/assets/jquery.xdomainrequest.min.js", MDOCS.ob.completeInit)
//                 } else
//                     MDOCS.ob.completeInit();
//                 return true
//             },
//             completeInit: function() {
//                 var template_url;
//                 MDOCS.$ = root.$.noConflict(true);
//                 MDOCS.$.fn.modal = root.$.fn.modal;
//                 MDOCS.ajaxCompatibleEndpoint = window.isIE9OrBelow() ? MDOCS.endpoint.replace('https:', window.location.protocol) : MDOCS.endpoint;
//                 template_url = MDOCS.ajaxCompatibleEndpoint + '/widgets/bookonline/template/' + MDOCS.CDNVersion;
//                 MDOCS.$.ajax({
//                     url: template_url,
//                     type: 'POST',
//                     cache: false,
//                     async: true,
//                     crossDomain: true,
//                     headers: {
//                         'Access-Control-Allow-Origin': '*'
//                     }
//                 }).done(MDOCS.ob.loadComplete).error(MDOCS.ob.loadFailed);
//                 return true
//             },
//             observe: function(method) {
//                 if (method == null )
//                     method = 'on';
//                 MDOCS.$(".ppop_bookonline_action").on("click", MDOCS.ob.startBookOnline);
//                 MDOCS.$('#pp_booking #book-online').on('show.bs.modal', MDOCS.ob.resetSlider);
//                 MDOCS.$("#pp_booking .modal-body input[name='newpatient']").on("change", MDOCS.ob.changedNewPatient);
//                 MDOCS.$('#pp_booking #reason-section-1 select').on("change", MDOCS.ob.selectedReason);
//                 MDOCS.$("#pp_booking button.schedule-next").on('click', MDOCS.ob.slideLeft);
//                 MDOCS.$("#pp_booking button.schedule-prev").on('click', MDOCS.ob.slideRight);
//                 MDOCS.$("#pp_booking #grid-block").on("click", "li.scroller", MDOCS.ob.scrollSlots);
//                 MDOCS.$("#pp_booking select#calendar-time").on("change", MDOCS.ob.setSlotId);
//                 MDOCS.$("#pp_booking #grid-block").on("click", "a", MDOCS.ob.selectBlock);
//                 MDOCS.$('#pp_booking select[name="insurance_provider_id"]').chosen({
//                     width: '250px'
//                 }).change(MDOCS.ob.toggleInsuranceFields);
//                 MDOCS.$("#pp_booking #patient-form").on('submit', MDOCS.ob.doNothing);
//                 MDOCS.$("#pp_booking #patient-form input, #pp_booking #patient-additional-info-form input, #pp_booking #patient-form select, #pp_booking #patient-additional-info-form select").on('change', MDOCS.ob.enterInfo);
//                 MDOCS.$("#pp_booking input#appointment-phone").mask("(999) 999-9999");
//                 MDOCS.$("#pp_booking input#appointment-insurance-phone-number").mask("(999) 999-9999");
//                 MDOCS.$("#pp_booking .btn-book-now").on('click', MDOCS.ob.submitBooking);
//                 MDOCS.$('#pp_booking .btn-book-additional-submit').on('click', MDOCS.ob.submitBookingExtra);
//                 return MDOCS.$('#pp_booking #terms_confirm input[type="checkbox"]').on('click', MDOCS.ob.clickTerms)
//             },
//             loadFailed: function(jqXHR, textStatus, errorThrown) {},
//             loadComplete: function(data) {
//                 MDOCS.$('body').append(data);
//                 MDOCS.ob.observe('on');
//                 return MDOCS.ob.ready = true
//             },
//             startBookOnline: function() {
//                 MDOCS.ob.filterNewPatients = '';
//                 MDOCS.ob.filterSpecialties = '';
//                 MDOCS.ob.filterInsurance = '';
//                 MDOCS.ob.filterGender = '';
//                 MDOCS.ob.filterLangs = '';
//                 MDOCS.ob.filterLocations = '';
//                 MDOCS.$('#pp_booking #book-online').show();
//                 MDOCS.ob.loadingCTA(MDOCS.$(this));
//                 if (root.ga != null )
//                     root.ga('send', 'event', 'button', 'click', 'book online button');
//                 MDOCS.$('#pp_booking #bookAppointmentLabel').text('Calendar');
//                 if ((MDOCS.ob.calPracticeId !== (MDOCS.$(this).attr('data-practiceid') ? parseInt(MDOCS.$(this).attr('data-practiceid')) : 0)) || (MDOCS.ob.calDoctorId !== (MDOCS.$(this).attr('data-doctorid') ? parseInt(MDOCS.$(this).attr('data-doctorid')) : 0)) || (MDOCS.ob.calLocationId !== (MDOCS.$(this).attr('data-locationid') ? parseInt(MDOCS.$(this).attr('data-locationid')) : 0)))
//                     MDOCS.ob.calLoaded = false;
//                 MDOCS.ob.calPracticeId = MDOCS.$(this).attr('data-practiceid') ? parseInt($(this).attr('data-practiceid')) : 0;
//                 MDOCS.ob.calDoctorId = MDOCS.$(this).attr('data-doctorid') ? parseInt($(this).attr('data-doctorid')) : 0;
//                 MDOCS.ob.calLocationId = MDOCS.$(this).attr('data-locationid') ? parseInt($(this).attr('data-locationid')) : 0;
//                 MDOCS.ob.calDoctor = void (0);
//                 MDOCS.ob.calLocation = void (0);
//                 if (MDOCS.ob.calLocationId && MDOCS.$('#pp_booking #patient-form input[name="location_id"]').val() === '')
//                     MDOCS.$('#pp_booking #patient-form input[name="location_id"]').val(MDOCS.ob.calLocationId);
//                 if (MDOCS.ob.calDoctorId && MDOCS.$('#pp_booking #patient-form input[name="doctor_id"]').val() === '')
//                     MDOCS.$('#pp_booking #patient-form input[name="doctor_id"]').val(MDOCS.ob.calDoctorId);
//                 return MDOCS.ob.loadCalendar()
//             },
//             loadingCTA: function(cta) {
//                 MDOCS.ob.cta = cta;
//                 MDOCS.ob.ctaHtml = MDOCS.$(MDOCS.ob.cta).html();
//                 return MDOCS.$(MDOCS.ob.cta).html(MDOCS.ob.ctaHtml.replace(/book online/gi, '<i class="fa fa-cog fa-spin" />'))
//             },
//             resetCTA: function() {
//                 if (MDOCS.ob.cta != null ) {
//                     MDOCS.$(MDOCS.ob.cta).html(MDOCS.ob.ctaHtml);
//                     MDOCS.ob.cta = void (0);
//                     return MDOCS.ob.ctaHtml = void (0)
//                 }
//             },
//             resetSlider: function() {
//                 MDOCS.ob.currentSlide = 0;
//                 MDOCS.$("#pp_booking #grid-block ul").css({
//                     'margin-left': '0px'
//                 });
//                 return MDOCS.ob.checkSliders()
//             },
//             slideLeft: function() {
//                 if (!MDOCS.ob.currentlySliding) {
//                     MDOCS.ob.currentlySliding = true;
//                     MDOCS.ob.currentSlide++;
//                     return MDOCS.$("#pp_booking #grid-block ul").animate({
//                         'margin-left': '-' + (616 * MDOCS.ob.currentSlide) + 'px'
//                     }, 300, MDOCS.ob.checkSliders)
//                 }
//             },
//             slideRight: function() {
//                 if (!MDOCS.ob.currentlySliding) {
//                     MDOCS.ob.currentlySliding = true;
//                     MDOCS.ob.currentSlide--;
//                     return MDOCS.$("#pp_booking #grid-block ul").animate({
//                         'margin-left': '-' + (616 * MDOCS.ob.currentSlide) + 'px'
//                     }, 300, MDOCS.ob.checkSliders)
//                 }
//             },
//             checkSliders: function() {
//                 MDOCS.$("#pp_booking input#appointment-date").val('');
//                 MDOCS.$("#pp_booking input#appointment-time").val('');
//                 MDOCS.$("#pp_booking a.time-slot").removeClass("checked");
//                 if (MDOCS.ob.currentSlide >= (MDOCS.ob.chunks - 1)) {
//                     MDOCS.$("#pp_booking button.schedule-next").hide()
//                 } else
//                     MDOCS.$("#pp_booking button.schedule-next").show();
//                 if (MDOCS.ob.currentSlide === 0) {
//                     MDOCS.$("#pp_booking button.schedule-prev").css({
//                         visibility: "hidden"
//                     })
//                 } else
//                     MDOCS.$("#pp_booking button.schedule-prev").css({
//                         visibility: "visible"
//                     });
//                 return MDOCS.ob.currentlySliding = false
//             },
//             scrollSlots: function() {
//                 var cellHeight, margin_top, slotHeight, slotMargin, slot_margin_abs, slots;
//                 if (!MDOCS.ob.isScrollingSlots) {
//                     slots = MDOCS.$(this).prev().find('.slots');
//                     cellHeight = parseInt(MDOCS.$(this).prev().height());
//                     slotMargin = root.Math.abs(parseInt(slots.css('margin-top')));
//                     slotHeight = parseInt(slots.height());
//                     MDOCS.ob.isScrollingSlots = true;
//                     slot_margin_abs = root.Math.abs(slotMargin);
//                     if (slot_margin_abs < slotHeight - cellHeight) {
//                         margin_top = slot_margin_abs + cellHeight;
//                         margin_top = '-' + margin_top + 'px';
//                         return slots.animate({
//                             'margin-top': margin_top
//                         }, 700, MDOCS.ob.resetSlotScrollingState)
//                     } else
//                         return slots.animate({
//                             'margin-top': '0px'
//                         }, 1100, MDOCS.ob.resetSlotScrollingState)
//                 }
//             },
//             resetSlotScrollingState: function() {
//                 return MDOCS.ob.isScrollingSlots = false
//             },
//             setSlotId: function() {
//                 var slotVal;
//                 slotVal = MDOCS.$(this).val();
//                 if (slotVal === '') {
//                     return MDOCS.$("#pp_booking input#block-id").val('')
//                 } else
//                     return MDOCS.$("#pp_booking input#block-id").val(MDOCS.$(this).val())
//             },
//             changedNewPatient: function() {
//                 if (MDOCS.ob.reasonsFilterBookings || MDOCS.ob.reasons.length > 0)
//                     return MDOCS.ob.updateCalendarModal()
//             },
//             updateCalendarModalFromInput: function() {
//                 var filterName, filterVal;
//                 filterName = MDOCS.$(this).attr('id');
//                 filterVal = MDOCS.$(this).val();
//                 switch (filterName) {
//                 case 'new_patients':
//                     MDOCS.ob.filterNewPatients = filterVal;
//                     break;
//                 case 'specialties':
//                     MDOCS.ob.filterSpecialties = filterVal;
//                     break;
//                 case 'insurance':
//                     MDOCS.ob.filterInsurance = filterVal;
//                     break;
//                 case 'gender':
//                     MDOCS.ob.filterGender = filterVal;
//                     break;
//                 case 'languages':
//                     MDOCS.ob.filterLangs = filterVal;
//                     break;
//                 case 'locations':
//                     MDOCS.ob.filterLocations = filterVal
//                 }
//                 ;MDOCS.ob.updateCalendarModal();
//                 return false
//             },
//             enterInfo: function() {
//                 var doublebreak, fieldIndx, field_name, formStep, indx, inputType, matchedRules, newtokens, rule, rules, sectionLabel, statement, tokens, val, _i, _ref, _ref1, _ref2, _ref3, _results;
//                 field_name = MDOCS.$(this).attr('name');
//                 if (((_ref = MDOCS.ob.screeningSettings) != null ? _ref.length : void (0)) > 0) {
//                     _ref1 = MDOCS.ob.screeningSettings;
//                     _results = [];
//                     for (indx in _ref1) {
//                         statement = _ref1[indx];
//                         matchedRules = 0;
//                         rules = statement.split(' and ');
//                         if (rules.length > 0)
//                             for (indx in rules) {
//                                 rule = rules[indx];
//                                 tokens = rule.split(' ');
//                                 if (tokens.length > 3) {
//                                     newtokens = tokens.splice(0, 2);
//                                     newtokens[2] = tokens.join(' ');
//                                     tokens = newtokens
//                                 }
//                                 ;if (tokens.length === 3 && tokens[1] === '=') {
//                                     doublebreak = false;
//                                     for (fieldIndx = _i = 0,
//                                     _ref2 = MDOCS.ob.bookingFields.length - 1; 0 <= _ref2 ? _i <= _ref2 : _i >= _ref2; fieldIndx = 0 <= _ref2 ? ++_i : --_i)
//                                         if (MDOCS.ob.bookingFields[fieldIndx] === tokens[0]) {
//                                             formStep = MDOCS.ob.cals[0].field_settings[MDOCS.ob.bookingFields[fieldIndx]].step;
//                                             sectionLabel = tokens[0];
//                                             inputType = 'input';
//                                             if ((tokens[0] === 'reason' && ((_ref3 = MDOCS.ob.reasons) != null ? _ref3.length : void (0)) > 0) || tokens[0] === 'insurance_provider_id' || tokens[0] === 'sex') {
//                                                 inputType = 'select'
//                                             } else if (tokens[0] === 'comment')
//                                                 inputType = 'textarea';
//                                             if (sectionLabel === 'firstname' || sectionLabel === 'lastname')
//                                                 sectionLabel = 'name';
//                                             if (tokens[0] === 'newpatient') {
//                                                 if (MDOCS.$("#pp_booking #newpatient-section-" + formStep + " input[name='newpatient']:checked").length)
//                                                     MDOCS.newpatient = MDOCS.$("#pp_booking #newpatient-section-" + formStep + " input[name='newpatient']:checked").val();
//                                                 val = MDOCS.newpatient === 'yes' ? '1' : '0'
//                                             } else
//                                                 val = MDOCS.$("#pp_booking #" + sectionLabel + "-section-" + formStep + " " + inputType + "[name='" + tokens[0] + "']").val();
//                                             if (val === tokens[2]) {
//                                                 matchedRules += 1
//                                             } else {
//                                                 doublebreak = true;
//                                                 break
//                                             }
//                                         }
//                                     ;if (doublebreak)
//                                         break
//                                 }
//                             }
//                         ;if (matchedRules === rules.length) {
//                             MDOCS.$('#booking-screened .apt-conf-phone').html('at <a href="tel:' + MDOCS.ob.apptPhone + '"><span class="mm-phone-number">' + MDOCS.ob.apptPhone + '</span></a>');
//                             MDOCS.ob.showAppointmentStep(4);
//                             if (root.pop.initCheckPhoneNumber != null ) {
//                                 root.pop.initCheckPhoneNumber();
//                                 root.pop.triggerPhoneSwap();
//                                 root.pop.checkPhoneNumberChange()
//                             }
//                             ;break
//                         } else
//                             _results.push(void (0))
//                     }
//                     ;return _results
//                 }
//             },
//             toggleInsuranceFields: function() {
//                 var selectedId;
//                 selectedId = MDOCS.$(this).val();
//                 if (selectedId && selectedId !== '700' && selectedId !== '701' && selectedId !== '602') {
//                     return MDOCS.$('#pp_booking .insurance-selected').removeClass('hide')
//                 } else
//                     return MDOCS.$('#pp_booking .insurance-selected').addClass('hide')
//             },
//             closeModal: function() {
//                 MDOCS.$('#pp_booking #book-online').hide();
//                 return MDOCS.$('#pp_booking #book-online').modal('hide')
//             },
//             doNothing: function() {
//                 return false
//             },
//             goToForm: function() {
//                 root.window.open(MDOCS.$(this).data('url'), '_blank');
//                 if (root.ga != null )
//                     root.ga('send', 'event', 'bookonline', 'view', 'reg form');
//                 return false
//             }
//         }
// }
// ).call(this);
// ;(function() {
//     var root;
//     root = typeof exports !== "undefined" && exports !== null ? exports : this;
//     if (typeof MDOCS !== "undefined" && MDOCS !== null )
//         MDOCS.ob.updateCalendarModal = function() {
//             var allDocsInsFilter, allDocsInsOptions, allDocsLangsFilter, allDocsLangsOptions, allFilters, buildCalResult, cities, docHtml, docId, docIndx, docLoc, docLocName, docSpec, docSpecialties, doctor, env, fieldIndx, filters, foundInsurance, foundLanguage, foundLocation, foundSpecialty, genderFilter, genderOptions, i, ignoreVal, imgExt, indx, inputType, insuranceSection, insurances, labelName, languages, locHtml, locId, locIndx, locName, location, locsFilter, locsOptions, mainSpecialtyIndx, max_length, newPatient, newPatientChecked, newPatientFilter, newPatientOptions, no_match, notShownInStep, num_docs, num_filters, options, shownInStep, shownReasonInStep, specIndx, specialtiesFilter, specialtiesOptions, specs, thisDoc, thisLoc, thisLocHtml, thisSpecialtiesFilter, _i, _j, _k, _l, _len, _m, _n, _o, _p, _q, _r, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _s, _t, _u, _v, _w;
//             MDOCS.ob.resetCTA();
//             if (!MDOCS.ob.calDoctorId && !MDOCS.ob.calNoDocs) {
//                 MDOCS.$("#pp_booking .modal-body.loading").show();
//                 MDOCS.$("#pp_booking .modal-body.selectdoc").hide();
//                 MDOCS.$("#pp_booking .modal-body.selectloc").hide();
//                 MDOCS.$("#pp_booking .modal-body.selectdoc").html('');
//                 MDOCS.$('#pp_booking #bookAppointmentLabel').text('Select Provider');
//                 MDOCS.$("#pp_booking .modal-content .caldetails").hide();
//                 MDOCS.ob.findDoctorsInCals();
//                 if (MDOCS.ob.calDoctors.length === 1 || MDOCS.ob.calSkipProviderSel) {
//                     MDOCS.ob.calPracticeId = 0;
//                     MDOCS.ob.calDoctorId = MDOCS.ob.calDoctors[0].id;
//                     MDOCS.ob.calDoctor = MDOCS.ob.calDoctors[0];
//                     MDOCS.$('#pp_booking #patient-form input[name="doctor_id"]').val(MDOCS.ob.calDoctorId);
//                     MDOCS.ob.calLoaded = false;
//                     MDOCS.ob.loadCalendar();
//                     return
//                 }
//                 ;docHtml = MDOCS.$("#pp_booking #calDocTemplate").html();
//                 num_docs = 0;
//                 if (((_ref = MDOCS.ob.calDoctors) != null ? _ref.length : void (0)) > 0) {
//                     filters = false;
//                     if (MDOCS.ob.calDirSettings.enable_dir === "1") {
//                         newPatientFilter = void (0);
//                         newPatientOptions = [];
//                         if (MDOCS.ob.calDirSettings.filter_new_patients === true) {
//                             newPatientFilter = MDOCS.$('<select />', {
//                                 "class": 'txt-input inline-input',
//                                 id: 'new_patients'
//                             });
//                             newPatientFilter.append(MDOCS.$('<option />', {
//                                 value: '',
//                                 text: '- Filter by New Patients -'
//                             }))
//                         }
//                         ;thisSpecialtiesFilter = void (0);
//                         specialtiesOptions = [];
//                         if (MDOCS.ob.calDirSettings.filter_specialties === true) {
//                             specialtiesFilter = MDOCS.$('<select />', {
//                                 "class": 'txt-input inline-input',
//                                 id: 'specialties'
//                             });
//                             specialtiesFilter.append(MDOCS.$('<option />', {
//                                 value: '',
//                                 text: '- Filter by Specialties -'
//                             }))
//                         }
//                         ;allDocsInsFilter = void (0);
//                         allDocsInsOptions = [];
//                         if (MDOCS.ob.calDirSettings.filter_insurance === true) {
//                             allDocsInsFilter = MDOCS.$('<select />', {
//                                 "class": 'txt-input inline-input',
//                                 id: 'insurance'
//                             });
//                             allDocsInsFilter.append(MDOCS.$('<option />', {
//                                 value: '',
//                                 text: '- Filter by Insurance -'
//                             }))
//                         }
//                         ;genderFilter = void (0);
//                         genderOptions = [];
//                         if (MDOCS.ob.calDirSettings.filter_gender === true) {
//                             genderFilter = MDOCS.$('<select />', {
//                                 "class": 'txt-input inline-input',
//                                 id: 'gender'
//                             });
//                             genderFilter.append(MDOCS.$('<option />', {
//                                 value: '',
//                                 text: '- Filter by Gender -'
//                             }))
//                         }
//                         ;allDocsLangsFilter = void (0);
//                         allDocsLangsOptions = [];
//                         if (MDOCS.ob.calDirSettings.filter_languages === true) {
//                             allDocsLangsFilter = MDOCS.$('<select />', {
//                                 "class": 'txt-input inline-input',
//                                 id: 'languages'
//                             });
//                             allDocsLangsFilter.append(MDOCS.$('<option />', {
//                                 value: '',
//                                 text: '- Filter by Language -'
//                             }))
//                         }
//                         ;locsFilter = void (0);
//                         locsOptions = [];
//                         if (MDOCS.ob.calDirSettings.filter_location === true) {
//                             locsFilter = MDOCS.$('<select />', {
//                                 "class": 'txt-input inline-input',
//                                 id: 'locations'
//                             });
//                             locsFilter.append(MDOCS.$('<option />', {
//                                 value: '',
//                                 text: '- Filter by Location -'
//                             }))
//                         }
//                     }
//                     ;for (docIndx = _i = 0,
//                     _ref1 = MDOCS.ob.calDoctors.length - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; docIndx = 0 <= _ref1 ? ++_i : --_i) {
//                         doctor = MDOCS.ob.calDoctors[docIndx];
//                         if (MDOCS.ob.calLocationId && _.size(MDOCS.ob.allDocLocs) > 0) {
//                             foundLocation = false;
//                             _ref2 = MDOCS.ob.allDocLocs;
//                             for (docId in _ref2) {
//                                 docLoc = _ref2[docId];
//                                 if (parseInt(docId) === doctor.id)
//                                     for (locId in docLoc) {
//                                         ignoreVal = docLoc[locId];
//                                         if (parseInt(locId) === parseInt(MDOCS.ob.calLocationId))
//                                             foundLocation = true
//                                     }
//                             }
//                             ;if (!foundLocation)
//                                 continue
//                         }
//                         ;if (MDOCS.ob.calDirSettings.enable_dir === "1") {
//                             if (MDOCS.ob.calDirSettings.filter_new_patients === true)
//                                 if (newPatientOptions.indexOf(doctor.accepting_new_patients) === -1) {
//                                     options = {
//                                         value: doctor.accepting_new_patients,
//                                         text: doctor.accepting_new_patients === 1 ? 'Accepting new patients' : 'Existing patients only'
//                                     };
//                                     if (parseInt(MDOCS.ob.filterNewPatients) === doctor.accepting_new_patients)
//                                         options.selected = true;
//                                     newPatientFilter.append(MDOCS.$('<option />', options));
//                                     newPatientOptions.push(doctor.accepting_new_patients);
//                                     if (newPatientOptions.length > 1)
//                                         filters = true
//                                 }
//                             ;if (MDOCS.ob.calDirSettings.filter_specialties === true)
//                                 if (_.size(MDOCS.ob.allSpecs) > 0) {
//                                     _ref3 = MDOCS.ob.allSpecs;
//                                     for (docId in _ref3) {
//                                         specs = _ref3[docId];
//                                         if (parseInt(docId) === 0 || parseInt(docId) === doctor.id)
//                                             for (indx = _j = 0,
//                                             _ref4 = specs.length - 1; 0 <= _ref4 ? _j <= _ref4 : _j >= _ref4; indx = 0 <= _ref4 ? ++_j : --_j)
//                                                 if (specialtiesOptions.indexOf(specs[indx].id) === -1) {
//                                                     options = {
//                                                         value: specs[indx].id,
//                                                         text: specs[indx].name
//                                                     };
//                                                     if (specs[indx].id === parseInt(MDOCS.ob.filterSpecialties))
//                                                         options.selected = true;
//                                                     specialtiesFilter.append(MDOCS.$('<option />', options));
//                                                     specialtiesOptions.push(specs[indx].id)
//                                                 }
//                                     }
//                                     ;if (specialtiesOptions.length > 1)
//                                         filters = true
//                                 }
//                             ;if (MDOCS.ob.calDirSettings.filter_insurance === true)
//                                 if (_.size(MDOCS.ob.allDocsIns) > 0) {
//                                     _ref5 = MDOCS.ob.allDocsIns;
//                                     for (docId in _ref5) {
//                                         insurances = _ref5[docId];
//                                         if (parseInt(docId) === 0 || parseInt(docId) === doctor.id)
//                                             for (indx = _k = 0,
//                                             _ref6 = insurances.length - 1; 0 <= _ref6 ? _k <= _ref6 : _k >= _ref6; indx = 0 <= _ref6 ? ++_k : --_k)
//                                                 if (allDocsInsOptions.indexOf(insurances[indx].insurance_provider_id) === -1) {
//                                                     options = {
//                                                         value: insurances[indx].insurance_provider_id,
//                                                         text: insurances[indx].provider
//                                                     };
//                                                     if (insurances[indx].insurance_provider_id === parseInt(MDOCS.ob.filterInsurance))
//                                                         options.selected = true;
//                                                     allDocsInsFilter.append(MDOCS.$('<option />', options));
//                                                     allDocsInsOptions.push(insurances[indx].insurance_provider_id)
//                                                 }
//                                     }
//                                     ;if (allDocsInsOptions.length > 1)
//                                         filters = true
//                                 }
//                             ;if (MDOCS.ob.calDirSettings.filter_gender === true)
//                                 if ((doctor.sex != null ) && doctor.sex !== '' && genderOptions.indexOf(doctor.sex) === -1) {
//                                     options = {
//                                         value: doctor.sex,
//                                         text: doctor.sex === 'm' ? 'Male' : 'Female'
//                                     };
//                                     if (MDOCS.ob.filterGender === doctor.sex)
//                                         options.selected = true;
//                                     genderFilter.append(MDOCS.$('<option />', options));
//                                     genderOptions.push(doctor.sex);
//                                     if (genderOptions.length > 1)
//                                         filters = true
//                                 }
//                             ;if (MDOCS.ob.calDirSettings.filter_languages === true)
//                                 if (_.size(MDOCS.ob.allDocsLangs) > 0) {
//                                     _ref7 = MDOCS.ob.allDocsLangs;
//                                     for (docId in _ref7) {
//                                         languages = _ref7[docId];
//                                         if (parseInt(docId) === doctor.id)
//                                             for (indx = _l = 0,
//                                             _ref8 = languages.length - 1; 0 <= _ref8 ? _l <= _ref8 : _l >= _ref8; indx = 0 <= _ref8 ? ++_l : --_l)
//                                                 if (allDocsLangsOptions.indexOf(languages[indx].language_id) === -1) {
//                                                     options = {
//                                                         value: languages[indx].language_id,
//                                                         text: languages[indx].name
//                                                     };
//                                                     if (languages[indx].language_id === parseInt(MDOCS.ob.filterLangs))
//                                                         options.selected = true;
//                                                     allDocsLangsFilter.append(MDOCS.$('<option />', options));
//                                                     allDocsLangsOptions.push(languages[indx].language_id)
//                                                 }
//                                     }
//                                     ;if (allDocsLangsOptions.length > 1)
//                                         filters = true
//                                 }
//                             ;if (MDOCS.ob.calDirSettings.filter_location === true)
//                                 if (_.size(MDOCS.ob.allLocs) > 0) {
//                                     _ref9 = MDOCS.ob.allLocs;
//                                     for (locId in _ref9) {
//                                         locName = _ref9[locId];
//                                         if (locsOptions.indexOf(locId) === -1) {
//                                             options = {
//                                                 value: locId,
//                                                 text: locName
//                                             };
//                                             if (parseInt(locId) === parseInt(MDOCS.ob.filterLocations))
//                                                 options.selected = true;
//                                             locsFilter.append(MDOCS.$('<option />', options));
//                                             locsOptions.push(locId)
//                                         }
//                                     }
//                                     ;if (locsOptions.length > 1)
//                                         filters = true
//                                 }
//                         }
//                         ;if (MDOCS.ob.filterNewPatients !== '')
//                             if (parseInt(MDOCS.ob.filterNewPatients) !== doctor.accepting_new_patients)
//                                 continue;if (MDOCS.ob.filterSpecialties !== '') {
//                             if (_.size(MDOCS.ob.allSpecs) === 0)
//                                 continue;foundSpecialty = false;
//                             _ref10 = MDOCS.ob.allSpecs;
//                             for (docId in _ref10) {
//                                 specs = _ref10[docId];
//                                 if (parseInt(docId) === 0 || parseInt(docId) === doctor.id)
//                                     for (indx = _m = 0,
//                                     _ref11 = specs.length - 1; 0 <= _ref11 ? _m <= _ref11 : _m >= _ref11; indx = 0 <= _ref11 ? ++_m : --_m)
//                                         if (parseInt(MDOCS.ob.filterSpecialties) === specs[indx].id && (parseInt(docId) > 0 || specs[indx].show_on_all_providers === 1))
//                                             foundSpecialty = true
//                             }
//                             ;if (!foundSpecialty)
//                                 continue
//                         }
//                         ;if (MDOCS.ob.filterInsurance !== '') {
//                             if (_.size(MDOCS.ob.allDocsIns) === 0)
//                                 continue;foundInsurance = false;
//                             _ref12 = MDOCS.ob.allDocsIns;
//                             for (docId in _ref12) {
//                                 insurances = _ref12[docId];
//                                 if (parseInt(docId) === 0 || parseInt(docId) === doctor.id)
//                                     for (indx = _n = 0,
//                                     _ref13 = insurances.length - 1; 0 <= _ref13 ? _n <= _ref13 : _n >= _ref13; indx = 0 <= _ref13 ? ++_n : --_n)
//                                         if (parseInt(MDOCS.ob.filterInsurance) === insurances[indx].insurance_provider_id)
//                                             foundInsurance = true
//                             }
//                             ;if (!foundInsurance)
//                                 continue
//                         }
//                         ;if (MDOCS.ob.filterGender !== '')
//                             if (MDOCS.ob.filterGender !== doctor.sex)
//                                 continue;if (MDOCS.ob.filterLangs !== '') {
//                             if (_.size(MDOCS.ob.allDocsLangs) === 0)
//                                 continue;foundLanguage = false;
//                             _ref14 = MDOCS.ob.allDocsLangs;
//                             for (docId in _ref14) {
//                                 languages = _ref14[docId];
//                                 if (parseInt(docId) === doctor.id)
//                                     for (indx = _o = 0,
//                                     _ref15 = languages.length - 1; 0 <= _ref15 ? _o <= _ref15 : _o >= _ref15; indx = 0 <= _ref15 ? ++_o : --_o)
//                                         if (parseInt(MDOCS.ob.filterLangs) === languages[indx].language_id)
//                                             foundLanguage = true
//                             }
//                             ;if (!foundLanguage)
//                                 continue
//                         }
//                         ;if (MDOCS.ob.filterLocations !== '') {
//                             if (_.size(MDOCS.ob.allDocLocs) === 0)
//                                 continue;foundLocation = false;
//                             _ref16 = MDOCS.ob.allDocLocs;
//                             for (docId in _ref16) {
//                                 docLoc = _ref16[docId];
//                                 if (parseInt(docId) === doctor.id)
//                                     for (locId in docLoc) {
//                                         ignoreVal = docLoc[locId];
//                                         if (parseInt(locId) === parseInt(MDOCS.ob.filterLocations))
//                                             foundLocation = true
//                                     }
//                             }
//                             ;if (!foundLocation)
//                                 continue
//                         }
//                         ;num_docs += 1;
//                         docSpecialties = '';
//                         if (doctor.site_specialties.length > 0) {
//                             max_length = doctor.site_specialties.length > 3 ? 3 : doctor.site_specialties.length;
//                             for (i = _p = 0,
//                             _ref17 = max_length - 1; 0 <= _ref17 ? _p <= _ref17 : _p >= _ref17; i = 0 <= _ref17 ? ++_p : --_p) {
//                                 docSpecialties += doctor.site_specialties[i].specialty.specialty;
//                                 if (i < max_length - 1)
//                                     docSpecialties += max_length - 1 - i > 1 ? ', ' : ' & '
//                             }
//                         }
//                         ;mainSpecialtyIndx = doctor.site_specialties && doctor.site_specialties.length > 0 ? 0 : false;
//                         if (mainSpecialtyIndx)
//                             if (doctor.site_specialties.length > 0)
//                                 for (specIndx = _q = 0,
//                                 _ref18 = doctor.site_specialties.length - 1; 0 <= _ref18 ? _q <= _ref18 : _q >= _ref18; specIndx = 0 <= _ref18 ? ++_q : --_q) {
//                                     docSpec = doctor.site_specialties[specIndx];
//                                     if (docSpec.main)
//                                         mainSpecialtyIndx = specIndx
//                                 }
//                         ;thisDoc = MDOCS.$('<div />', {
//                             html: docHtml
//                         });
//                         if (MDOCS.ob.calDirSettings.enable_dir === "1")
//                             thisDoc.find('.doc-modal').addClass('directory');
//                         thisDoc.find('h6').html(doctor.prefix + ' ' + doctor.lastname);
//                         thisDoc.find('label.spec').html(docSpecialties);
//                         thisDoc.find('.doc-select-hover').attr('data-docid', doctor.id);
//                         thisDoc.find('.doc-select').attr('data-docid', doctor.id);
//                         if ((doctor.media['PROFILE'] != null ) && doctor.media['PROFILE'].length > 0) {
//                             env = thisDoc.find('.provider-pic').attr('data-env');
//                             if (doctor.media['PROFILE'][0]['file_extension'] !== null ) {
//                                 imgExt = '.' + doctor.media['PROFILE'][0]['file_extension']
//                             } else
//                                 imgExt = '.jpg';
//                             if (env !== "production") {
//                                 thisDoc.find('.doc-photo').attr('src', 'https://sa1s3.patientpop.com/assets/images/provider/photos/' + env + '/' + doctor.media['PROFILE'][0]['id'] + imgExt)
//                             } else
//                                 thisDoc.find('.doc-photo').attr('src', 'https://sa1s3.patientpop.com/assets/images/provider/photos/' + doctor.media['PROFILE'][0]['id'] + imgExt)
//                         } else
//                             thisDoc.find('.doc-photo').attr('src', 'https://sa1s3.patientpop.com/assets/images/provider/default-profile.jpg');
//                         MDOCS.$("#pp_booking .modal-body.selectdoc").append(thisDoc.html());
//                         if (MDOCS.ob.calDirSettings.enable_dir !== "1" && MDOCS.ob.calDoctors.length === 4 && docIndx === 1)
//                             MDOCS.$("#pp_booking .modal-body.selectdoc").append('<br/>')
//                     }
//                     ;if (num_docs === 0) {
//                         no_match = MDOCS.$('<div />', {
//                             text: 'no matches'
//                         });
//                         MDOCS.$("#pp_booking .modal-body.selectdoc").append('<br/>').append(no_match)
//                     }
//                     ;if (filters === true) {
//                         allFilters = MDOCS.$('<div />', {
//                             id: 'booking_filters'
//                         });
//                         num_filters = 0;
//                         if (MDOCS.ob.calDirSettings.filter_new_patients === true && newPatientOptions.length > 1) {
//                             allFilters.append(newPatientFilter);
//                             num_filters += 1
//                         }
//                         ;if (MDOCS.ob.calDirSettings.filter_specialties === true && specialtiesOptions.length > 1) {
//                             allFilters.append(specialtiesFilter);
//                             num_filters += 1
//                         }
//                         ;if (MDOCS.ob.calDirSettings.filter_insurance === true && allDocsInsOptions.length > 1) {
//                             num_filters += 1;
//                             allFilters.append(allDocsInsFilter)
//                         }
//                         ;if (MDOCS.ob.calDirSettings.filter_gender === true && genderOptions.length > 1) {
//                             num_filters += 1;
//                             allFilters.append(genderFilter)
//                         }
//                         ;if (MDOCS.ob.calDirSettings.filter_languages === true && allDocsLangsOptions.length > 1) {
//                             num_filters += 1;
//                             allFilters.append(allDocsLangsFilter)
//                         }
//                         ;if (MDOCS.ob.calDirSettings.filter_location === true && locsOptions.length > 1) {
//                             num_filters += 1;
//                             allFilters.append(locsFilter)
//                         }
//                         ;MDOCS.$("#pp_booking .modal-body.selectdoc").prepend(MDOCS.$('<div>&nbsp;</div>'));
//                         MDOCS.$("#pp_booking .modal-body.selectdoc").prepend(allFilters);
//                         MDOCS.$("#pp_booking #booking_filters select").each(function() {
//                             var val;
//                             val = MDOCS.$(this).val();
//                             MDOCS.$(this).html(MDOCS.$(this).find("option").sort(function(a, b) {
//                                 if (a.text === b.text) {
//                                     return 0
//                                 } else if (a.text < b.text) {
//                                     return -1
//                                 } else
//                                     return 1
//                             }));
//                             return MDOCS.$(this).val(val)
//                         });
//                         MDOCS.$("#pp_booking #booking_filters select").on('change', MDOCS.ob.updateCalendarModalFromInput)
//                     }
//                 }
//                 ;MDOCS.$("#pp_booking .modal-body.loading").hide();
//                 MDOCS.$("#pp_booking .modal-body.selectdoc").show();
//                 MDOCS.$('#pp_booking .modal-body.selectdoc .doc-select-hover, #pp_booking .modal-body.selectdoc .doc-select.link').on('click', MDOCS.ob.selectDoc);
//                 MDOCS.$('#pp_booking #book-online').modal('show');
//                 if (root.ga != null )
//                     return root.ga('send', 'event', 'bookonline', 'view', 'doctors')
//             } else if (!MDOCS.ob.calLocationId) {
//                 MDOCS.$("#pp_booking .modal-body.loading").show();
//                 MDOCS.$("#pp_booking .modal-body.selectdoc").hide();
//                 MDOCS.$("#pp_booking .modal-body.selectloc").hide();
//                 MDOCS.$("#pp_booking .modal-body.selectloc").html('');
//                 MDOCS.$('#pp_booking #bookAppointmentLabel').text('Select Location');
//                 MDOCS.$("#pp_booking .modal-content .caldetails").hide();
//                 MDOCS.ob.findLocationsInCals();
//                 if (MDOCS.ob.calLocations.length === 1) {
//                     MDOCS.ob.calPracticeId = 0;
//                     MDOCS.ob.calLocationId = MDOCS.ob.calLocations[0].id;
//                     MDOCS.ob.calLocation = MDOCS.ob.calLocations[0];
//                     MDOCS.$('#pp_booking #patient-form input[name="location_id"]').val(MDOCS.ob.calLocationId);
//                     MDOCS.ob.calLoaded = false;
//                     MDOCS.ob.loadCalendar();
//                     return
//                 }
//                 ;locHtml = MDOCS.$("#pp_booking #calLocTemplate").html();
//                 cities = {};
//                 if (MDOCS.ob.calLocations.length > 0) {
//                     for (locIndx = _r = 0,
//                     _ref19 = MDOCS.ob.calLocations.length - 1; 0 <= _ref19 ? _r <= _ref19 : _r >= _ref19; locIndx = 0 <= _ref19 ? ++_r : --_r) {
//                         location = MDOCS.ob.calLocations[locIndx];
//                         if (location.city != null )
//                             cities[location.city.toLowerCase()] = cities[location.city.toLowerCase()] != null ? cities[location.city.toLowerCase()] + 1 : 1
//                     }
//                     ;for (locIndx = _s = 0,
//                     _ref20 = MDOCS.ob.calLocations.length - 1; 0 <= _ref20 ? _s <= _ref20 : _s >= _ref20; locIndx = 0 <= _ref20 ? ++_s : --_s) {
//                         location = MDOCS.ob.calLocations[locIndx];
//                         thisLocHtml = locHtml.replace(/LOCID/g, location.id);
//                         thisLocHtml = thisLocHtml.replace(/LOCNAME/g, location.city + ((location.city != null ) && cities[location.city] <= 1 ? '' : ', ' + location.address_street));
//                         thisLocHtml = thisLocHtml.replace(/LOCADDRESS/g, location.address_number + ' ' + location.address_street + (location.address2 ? ' ' + location.address2 : '') + ', ' + location.city + ', ' + location.state + ' ' + location.zip);
//                         thisLoc = MDOCS.$('<div />', {
//                             html: thisLocHtml
//                         });
//                         if (MDOCS.ob.calDirSettings.enable_dir === "1")
//                             thisLoc.find('.loc-modal').addClass('directory');
//                         MDOCS.$("#pp_booking .modal-body.selectloc").append(thisLoc.html());
//                         if (MDOCS.ob.calDirSettings.enable_dir !== "1" && MDOCS.ob.calLocations.length === 4 && locIndx === 1)
//                             MDOCS.$("#pp_booking .modal-body.selectloc").append('<br/>')
//                     }
//                 }
//                 ;MDOCS.$("#pp_booking .modal-body.loading").hide();
//                 MDOCS.$('#pp_booking #book-online').scrollTop(0);
//                 MDOCS.$("#pp_booking .modal-body.selectloc").show();
//                 MDOCS.$('#pp_booking .modal-body.selectloc .location-map').each(root.pop.loadMaps);
//                 MDOCS.$('#pp_booking .modal-body.selectloc .loc-modal').on('click', MDOCS.ob.selectLoc);
//                 MDOCS.$('#pp_booking #book-online').modal('show');
//                 if (root.ga != null )
//                     return root.ga('send', 'event', 'bookonline', 'view', 'locations')
//             } else {
//                 MDOCS.$("#pp_booking .modal-body.loading").show();
//                 MDOCS.$("#pp_booking .modal-body.selectdoc").hide();
//                 MDOCS.$("#pp_booking .modal-body.selectloc").hide();
//                 if (!MDOCS.ob.calDoctor && MDOCS.ob.calDoctorId) {
//                     MDOCS.ob.findDoctorsInCals();
//                     for (indx = _t = 0,
//                     _ref21 = MDOCS.ob.calDoctors.length - 1; 0 <= _ref21 ? _t <= _ref21 : _t >= _ref21; indx = 0 <= _ref21 ? ++_t : --_t)
//                         if (MDOCS.ob.calDoctors[indx].id === parseInt(MDOCS.ob.calDoctorId))
//                             MDOCS.ob.calDoctor = MDOCS.ob.calDoctors[indx]
//                 }
//                 ;if (!MDOCS.ob.calLocation && MDOCS.ob.calLocationId) {
//                     MDOCS.ob.findLocationsInCals();
//                     for (indx = _u = 0,
//                     _ref22 = MDOCS.ob.calLocations.length - 1; 0 <= _ref22 ? _u <= _ref22 : _u >= _ref22; indx = 0 <= _ref22 ? ++_u : --_u)
//                         if (MDOCS.ob.calLocations[indx] === parseInt(MDOCS.ob.calLocationId))
//                             MDOCS.ob.calLocation = MDOCS.ob.calLocations[indx]
//                 }
//                 ;docLocName = '';
//                 if (MDOCS.ob.calDoctor && !MDOCS.ob.calSkipProviderSel)
//                     docLocName += MDOCS.ob.calDoctor['prefix'] + ' ' + MDOCS.ob.calDoctor['lastname'] + (MDOCS.ob.calLocation ? ', ' : '');
//                 if (MDOCS.ob.calLocation != null )
//                     docLocName += MDOCS.ob.calLocation['city'] + ', ' + MDOCS.ob.calLocation['state'];
//                 MDOCS.$('#pp_booking #bookAppointmentLabel').html(MDOCS.ob.calendarLabel + ' <span class="subtitle">' + docLocName + '</span>');
//                 MDOCS.$("#pp_booking .modal-content .caldetails").hide();
//                 MDOCS.$("#pp_booking #grid-block a").removeClass("checked");
//                 MDOCS.$("#pp_booking .btn-book-now").html(MDOCS.ob.step2Required ? 'Next' : MDOCS.ob.bookNowLabel).prop("disabled", false);
//                 if (MDOCS.ob.step2Required) {
//                     MDOCS.$("#pp_booking .btn-skip").hide();
//                     MDOCS.$("#pp_booking .btn-book-additional-submit").html(MDOCS.ob.step2Required ? MDOCS.ob.bookNowLabel : 'Submit').prop("disabled", false)
//                 }
//                 ;if (!MDOCS.ob.cals || MDOCS.ob.cals.length !== 1 || MDOCS.ob.cals[0].calendar_blocks.length <= 0) {
//                     alert("Sorry, we don't have an online calendar yet. Please contact our office directly.");
//                     MDOCS.ob.closeModal()
//                 } else {
//                     MDOCS.$('#pp_booking #patient-form input[name="calendar_id"]').val(MDOCS.ob.cals[0].id);
//                     if (MDOCS.ob.cals[0].field_settings['insurance_provider_id'].hide === void (0) || MDOCS.ob.cals[0].field_settings['insurance_provider_id'].hide) {
//                         insuranceSection = MDOCS.ob.cals[0].field_settings['insurance_provider_id'].step;
//                         MDOCS.$('#pp_booking #insurance_provider_id-section-' + insuranceSection + ' .add-info-insurance-select-dropdown').find('option').remove();
//                         MDOCS.$('#pp_booking #insurance_provider_id-section-' + insuranceSection + ' .add-info-insurance-select-dropdown').append(MDOCS.$("<option></option>").attr("value", '').attr('selected', 'selected').text('- Select One -'));
//                         root._.each(MDOCS.ob.insurances, function(option) {
//                             if (MDOCS.ob.cals[0].allow_no_ins_answer || (option.id !== 700 && option.id !== 701))
//                                 return MDOCS.$('#pp_booking #insurance_provider_id-section-' + insuranceSection + ' .add-info-insurance-select-dropdown').append(MDOCS.$("<option></option>").attr("value", option.id).text(option.provider))
//                         });
//                         MDOCS.$('#pp_booking #insurance_provider_id-section-' + insuranceSection + ' .add-info-insurance-select-dropdown').trigger("chosen:updated")
//                     }
//                     ;for (fieldIndx = _v = 0,
//                     _ref23 = MDOCS.ob.bookingFields.length - 1; 0 <= _ref23 ? _v <= _ref23 : _v >= _ref23; fieldIndx = 0 <= _ref23 ? ++_v : --_v) {
//                         labelName = MDOCS.ob.bookingFields[fieldIndx];
//                         if (labelName === 'firstname' || labelName === 'lastname')
//                             labelName = 'name';
//                         if ((MDOCS.ob.cals[0].field_settings[MDOCS.ob.bookingFields[fieldIndx]].hide != null ) && MDOCS.ob.cals[0].field_settings[MDOCS.ob.bookingFields[fieldIndx]].hide) {
//                             MDOCS.$("#pp_booking #" + labelName + "-section-1").hide();
//                             MDOCS.$("#pp_booking #" + labelName + "-section-1 " + inputType).prop('disabled', true);
//                             MDOCS.$("#pp_booking #" + labelName + "-section-2").hide();
//                             MDOCS.$("#pp_booking #" + labelName + "-section-2 " + inputType).prop('disabled', true)
//                         } else {
//                             shownInStep = parseInt(MDOCS.ob.cals[0].field_settings[MDOCS.ob.bookingFields[fieldIndx]].step);
//                             notShownInStep = shownInStep === 1 ? 2 : 1;
//                             inputType = 'input';
//                             if ((MDOCS.ob.bookingFields[fieldIndx] === 'reason' && (MDOCS.ob.reasons != null )) || MDOCS.ob.bookingFields[fieldIndx] === 'insurance_provider_id') {
//                                 inputType = 'select'
//                             } else if (MDOCS.ob.bookingFields[fieldIndx] === 'comment')
//                                 inputType = 'textarea';
//                             MDOCS.$("#pp_booking #" + labelName + "-section-" + shownInStep).show();
//                             MDOCS.$("#pp_booking #" + labelName + "-section-" + shownInStep + ' ' + inputType).prop('disabled', false);
//                             MDOCS.$("#pp_booking #" + labelName + "-section-" + notShownInStep).hide();
//                             MDOCS.$("#pp_booking #" + labelName + "-section-" + notShownInStep + ' ' + inputType).prop('disabled', true);
//                             if (labelName === 'newpatient' && ((_ref24 = MDOCS.ob.calDoctor) != null ? _ref24.accepting_new_patients : void (0)) === 0) {
//                                 MDOCS.$("#pp_booking #" + labelName + "-section-" + shownInStep + ' #new-patient-yes').parent().hide();
//                                 MDOCS.$("#pp_booking #" + labelName + "-section-" + shownInStep + ' #new-patient-yes').prop('disabled', true);
//                                 MDOCS.$("#pp_booking #" + labelName + "-section-" + shownInStep + ' #new-patient-no').prop('checked', true)
//                             } else {
//                                 MDOCS.$("#pp_booking #" + labelName + "-section-" + shownInStep + ' #new-patient-yes').parent().show();
//                                 MDOCS.$("#pp_booking #" + labelName + "-section-" + shownInStep + ' #new-patient-yes').prop('disabled', false)
//                             }
//                         }
//                     }
//                     ;if (MDOCS.ob.showLegalCheckboxes) {
//                         MDOCS.$("#pp_booking #terms_confirm").show()
//                     } else
//                         MDOCS.$("#pp_booking #terms_confirm").hide();
//                     shownReasonInStep = MDOCS.ob.cals[0].field_settings['reason'].step;
//                     newPatientChecked = MDOCS.$("#pp_booking .modal-body input[name='newpatient']:checked").length > 0;
//                     newPatient = MDOCS.$('#pp_booking #patient-form #new-patient-yes').is(':checked');
//                     if (MDOCS.ob.reasons.length > 0 || MDOCS.ob.reasonsFilterBookings) {
//                         MDOCS.$('#pp_booking #reason-section-' + shownReasonInStep + ' select').html('');
//                         if (newPatientChecked) {
//                             MDOCS.$('#pp_booking #reason-section-' + shownReasonInStep + ' select').append(MDOCS.$('<option>', {
//                                 value: '',
//                                 text: '- Select One -'
//                             }));
//                             if (MDOCS.ob.reasons.length > 0) {
//                                 _ref25 = MDOCS.ob.reasons;
//                                 for (_w = 0,
//                                 _len = _ref25.length; _w < _len; _w++) {
//                                     i = _ref25[_w];
//                                     if ((i.doctor_id === parseInt(MDOCS.ob.calDoctorId) || i.doctor_id === null ) && (i.location_id === parseInt(MDOCS.ob.calLocationId) || i.location_id === null ) && i.reason_type && (i.reason_type === 'all' || newPatient && i.reason_type === 'new' || !newPatient && i.reason_type === 'existing'))
//                                         MDOCS.$('#pp_booking #reason-section-' + shownReasonInStep + ' select').append(MDOCS.$('<option>', {
//                                             value: i.id,
//                                             text: i.name,
//                                             'data-ext_reason_id': i.external_reason_id
//                                         }))
//                                 }
//                             }
//                         } else
//                             MDOCS.$('#pp_booking #reason-section-' + shownReasonInStep + ' select').append(MDOCS.$('<option>', {
//                                 value: '',
//                                 text: 'Answer new patient question above'
//                             }));
//                         MDOCS.$('#pp_booking #reason-section-1 input[name="reason"]').prop('disabled', true);
//                         MDOCS.$('#pp_booking #reason-section-2 input[name="reason"]').prop('disabled', true);
//                         MDOCS.$('#pp_booking #reason-section-' + shownReasonInStep + ' input[name="reason"]').hide();
//                         MDOCS.$('#pp_booking #reason-section-' + shownReasonInStep + ' select[name="reason"]').prop('disabled', false);
//                         MDOCS.$('#pp_booking #reason-section-' + shownReasonInStep + ' select[name="reason"]').show()
//                     } else {
//                         MDOCS.$('#pp_booking #reason-section-' + shownReasonInStep + ' select[name="reason"]').prop('disabled', true);
//                         MDOCS.$('#pp_booking #reason-section-' + shownReasonInStep + ' select[name="reason"]').hide();
//                         if (parseInt(shownReasonInStep) === 1)
//                             MDOCS.$('#pp_booking #reason-section-2 input[name="reason"]').prop('disabled', true);
//                         MDOCS.$('#pp_booking #reason-section-' + shownReasonInStep + ' input[name="reason"]').prop('disabled', false);
//                         MDOCS.$('#pp_booking #reason-section-' + shownReasonInStep + ' input[name="reason"]').show()
//                     }
//                     ;if (MDOCS.ob.reasonsFilterBookings) {
//                         MDOCS.$('#pp_booking #calendar-block').removeClass('visible');
//                         MDOCS.$("#pp_booking #calendar-block-loading").hide();
//                         if (!newPatientChecked) {
//                             MDOCS.$("#pp_booking #calendar-block-select-newpatient").show();
//                             MDOCS.$("#pp_booking #calendar-block-select-reason").hide()
//                         } else {
//                             MDOCS.$("#pp_booking #calendar-block-select-newpatient").hide();
//                             MDOCS.$("#pp_booking #calendar-block-select-reason").show()
//                         }
//                         ;MDOCS.$("#pp_booking .modal-body.loading").hide();
//                         MDOCS.$("#pp_booking .modal-content .caldetails").show();
//                         MDOCS.$('#pp_booking #book-online').modal('show')
//                     } else {
//                         MDOCS.$("#pp_booking #calendar-block-select-newpatient").hide();
//                         MDOCS.$("#pp_booking #calendar-block-loading").hide();
//                         MDOCS.$("#pp_booking #calendar-block-select-reason").hide();
//                         MDOCS.$('#pp_booking #calendar-block').addClass('visible');
//                         buildCalResult = MDOCS.ob.buildCalendar();
//                         if (buildCalResult) {
//                             MDOCS.ob.buildAppointmentOptions();
//                             MDOCS.ob.checkSliders();
//                             MDOCS.$("#pp_booking .modal-body.loading").hide();
//                             MDOCS.$("#pp_booking .modal-content .caldetails").show();
//                             MDOCS.$('#pp_booking #book-online').modal('show')
//                         } else {
//                             alert("Sorry, there are no appointments available on our calendar. Please contact our office directly.");
//                             MDOCS.ob.closeModal()
//                         }
//                     }
//                 }
//                 ;if (root.ga != null )
//                     return root.ga('send', 'event', 'bookonline', 'view', 'step 1')
//             }
//         }
// }
// ).call(this);
// ;(function() {
//     var root;
//     root = typeof exports !== "undefined" && exports !== null ? exports : this;
//     if (typeof MDOCS !== "undefined" && MDOCS !== null ) {
//         MDOCS.ob.loadCalendar = function() {
//             MDOCS.$("#pp_booking .modal-body.loading").show();
//             MDOCS.$("#pp_booking .modal-body.selectdoc").hide();
//             MDOCS.$("#pp_booking .modal-body.selectloc").hide();
//             MDOCS.$("#pp_booking .modal-content .caldetails").hide();
//             if (!MDOCS.ob.calLoaded) {
//                 return MDOCS.$.ajax({
//                     type: "POST",
//                     url: MDOCS.ajaxCompatibleEndpoint + '/widgets/calendars/' + MDOCS.ob.calPracticeId + '/' + MDOCS.ob.calDoctorId + '/' + MDOCS.ob.calLocationId
//                 }).done(MDOCS.ob.successLoadCalendar).error(MDOCS.ob.failLoadCalendar)
//             } else
//                 return MDOCS.ob.updateCalendarModal()
//         }
//         ;
//         MDOCS.ob.successLoadCalendar = function(data) {
//             var cal, fieldIndx, _i, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
//             MDOCS.ob.resetCTA();
//             if (data.status === 'success') {
//                 if (((_ref = data.message.calendars[0]) != null ? _ref.calendar_label : void (0)) != null )
//                     MDOCS.ob.calendarLabel = data.message.calendars[0].calendar_label;
//                 if (((_ref1 = data.message.calendars[0]) != null ? (_ref2 = _ref1.practice) != null ? _ref2.skip_cal_provider_sel : void (0) : void (0)) != null )
//                     MDOCS.ob.calSkipProviderSel = data.message.calendars[0].practice.skip_cal_provider_sel;
//                 if (((_ref3 = data.message.calendars[0]) != null ? (_ref4 = _ref3.practice) != null ? _ref4.num_docs : void (0) : void (0)) != null )
//                     MDOCS.ob.calNoDocs = data.message.calendars[0].practice.num_docs > 0 ? 0 : 1;
//                 if (((_ref5 = data.message.calendars[0]) != null ? (_ref6 = _ref5.practice) != null ? _ref6.show_legal_checkboxes : void (0) : void (0)) != null )
//                     MDOCS.ob.showLegalCheckboxes = data.message.calendars[0].practice.show_legal_checkboxes;
//                 if (MDOCS.ob.calDoctorId === 0 && !MDOCS.ob.calNoDocs) {
//                     if (data.message.allDocsIns != null )
//                         MDOCS.ob.allDocsIns = data.message.allDocsIns;
//                     if (data.message.allDocsLangs != null )
//                         MDOCS.ob.allDocsLangs = data.message.allDocsLangs;
//                     if (data.message.allLocs != null )
//                         MDOCS.ob.allLocs = data.message.allLocs;
//                     if (data.message.allDocLocs != null )
//                         MDOCS.ob.allDocLocs = data.message.allDocLocs;
//                     if (data.message.allSpecs != null )
//                         MDOCS.ob.allSpecs = data.message.allSpecs
//                 } else if ((MDOCS.ob.calDoctorId > 0 || MDOCS.ob.calNoDocs) && MDOCS.ob.calLocationId > 0) {
//                     if (data.message.calendars[0].book_button_label != null ) {
//                         MDOCS.ob.bookNowLabel = data.message.calendars[0].book_button_label
//                     } else
//                         MDOCS.ob.bookNowLabel = 'Book Now';
//                     MDOCS.$('#pp_booking .book-online-message').html(data.message.calendars[0].calendar_copy);
//                     if (data.message.reasons != null ) {
//                         MDOCS.ob.reasons = data.message.reasons;
//                         MDOCS.ob.reasonsFilterBookings = data.message.reasonsFilterBookings
//                     }
//                     ;if (data.message.insurances != null )
//                         MDOCS.ob.insurances = data.message.insurances;
//                     cal = data.message.calendars[0];
//                     MDOCS.ob.step2Required = false;
//                     for (fieldIndx = _i = 0,
//                     _ref7 = MDOCS.ob.bookingFields.length - 1; 0 <= _ref7 ? _i <= _ref7 : _i >= _ref7; fieldIndx = 0 <= _ref7 ? ++_i : --_i)
//                         if (cal.field_settings[MDOCS.ob.bookingFields[fieldIndx]].required && parseInt(cal.field_settings[MDOCS.ob.bookingFields[fieldIndx]].step) === 2) {
//                             MDOCS.ob.step2Required = true;
//                             break
//                         }
//                 }
//                 ;MDOCS.ob.calDirSettings = data.message.directorySettings;
//                 MDOCS.ob.apptPhone = data.message.apptPhone;
//                 if (((_ref8 = data.message.calendars[0]) != null ? _ref8.screening_settings : void (0)) != null )
//                     MDOCS.ob.screeningSettings = (_ref9 = data.message.calendars[0]) != null ? _ref9.screening_settings : void (0);
//                 MDOCS.ob.calLoaded = true;
//                 root.setTimeout(MDOCS.ob.clearCalLoaded, 18e5);
//                 MDOCS.ob.cals = data.message.calendars;
//                 return MDOCS.ob.updateCalendarModal()
//             } else {
//                 alert("Sorry we couldn't retrieve the calendar.\n" + (data.message ? data.message + '\n' : '') + 'Please try again.');
//                 return MDOCS.ob.closeModal()
//             }
//         }
//         ;
//         MDOCS.ob.failLoadCalendar = function() {
//             alert("Sorry we couldn't retrieve the calendar. Please try again.");
//             MDOCS.ob.closeModal();
//             return MDOCS.ob.resetCTA()
//         }
//         ;
//         MDOCS.ob.clearCalLoaded = function() {
//             MDOCS.ob.calLoaded = false;
//             return MDOCS.ob.closeModal()
//         }
//     }
// }
// ).call(this);
// ;(function() {
//     var root;
//     root = typeof exports !== "undefined" && exports !== null ? exports : this;
//     if (typeof MDOCS !== "undefined" && MDOCS !== null )
//         MDOCS.ob.buildCalendar = function(reasonId, extReasonId) {
//             var block, currentDay, dateSplit, days, daysBefore, filteredBlocks, found, fullWeekDays, indx, indxBlock, indxDay, indxReason, indxTime, newDate, numBlocks, numDays, numReasons, numSlots, numTotalSlots, theCalBlocks, timeSlots, weekdays, _i, _j, _k, _l, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
//             theCalBlocks = [];
//             _ref = MDOCS.ob.cals[0]['calendar_blocks'];
//             for (indx in _ref) {
//                 block = _ref[indx];
//                 theCalBlocks.push(block)
//             }
//             ;if (reasonId && extReasonId && MDOCS.ob.reasonsFilterBookings) {
//                 filteredBlocks = [];
//                 numBlocks = root._.size(theCalBlocks);
//                 if (numBlocks > 0)
//                     for (indxBlock = _i = 0,
//                     _ref1 = numBlocks - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; indxBlock = 0 <= _ref1 ? ++_i : --_i) {
//                         numReasons = theCalBlocks[indxBlock].reasons != null ? theCalBlocks[indxBlock].reasons.length : 0;
//                         found = false;
//                         if (numReasons > 0)
//                             for (indxReason = _j = 0,
//                             _ref2 = numReasons - 1; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; indxReason = 0 <= _ref2 ? ++_j : --_j)
//                                 if (parseInt(theCalBlocks[indxBlock].reasons[indxReason].id) === parseInt(reasonId)) {
//                                     found = true;
//                                     break
//                                 }
//                         ;if (found)
//                             filteredBlocks.push(theCalBlocks[indxBlock])
//                     }
//                 ;theCalBlocks = filteredBlocks
//             }
//             ;days = [];
//             currentDay = '';
//             numDays = 0;
//             numTotalSlots = 0;
//             numSlots = 0;
//             MDOCS.$.each(theCalBlocks, function(i, slot) {
//                 var hours, minutes, newDay, scheduleDate, suffix;
//                 if (slot.slots.length === 0 || (!MDOCS.ob.calNoDocs && MDOCS.$.inArray(parseInt(MDOCS.ob.calDoctorId), slot.slots) < 0))
//                     return;
//                 newDay = false;
//                 if (currentDay !== slot.date) {
//                     currentDay = slot.date;
//                     numDays++;
//                     scheduleDate = slot.date.split('-')[1] + '/' + slot.date.split('-')[2] + '/' + slot.date.split('-')[0];
//                     days[numDays - 1] = {
//                         weekday: slot.weekday,
//                         date: scheduleDate,
//                         id: slot.date,
//                         times: []
//                     };
//                     numSlots = 0;
//                     newDay = true
//                 }
//                 ;hours = slot.start_time.split(':')[0];
//                 minutes = slot.start_time.split(':')[1];
//                 suffix = hours >= 12 ? 'pm' : 'am';
//                 hours = hours > 12 ? hours - 12 : hours;
//                 hours = hours === '00' ? 12 : hours;
//                 days[numDays - 1].times[numSlots] = {
//                     id: slot.id,
//                     time: hours + ':' + minutes + ' ' + suffix
//                 };
//                 numTotalSlots++;
//                 return numSlots++
//             });
//             if (numTotalSlots === 0)
//                 return false;
//             weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
//             fullWeekDays = [];
//             currentDay = 0;
//             if (days.length > 0)
//                 for (indx = _k = 0,
//                 _ref3 = days.length - 1; 0 <= _ref3 ? _k <= _ref3 : _k >= _ref3; indx = 0 <= _ref3 ? ++_k : --_k)
//                     if (days[indx].weekday !== weekdays[indx % 7]) {
//                         daysBefore = 1;
//                         while (days[indx].weekday !== weekdays[(indx + daysBefore) % 7])
//                             daysBefore++;
//                         newDate = new Date();
//                         dateSplit = days[indx].date.split('/');
//                         newDate.setFullYear(dateSplit[2], dateSplit[0] - 1, dateSplit[1] - daysBefore);
//                         days.splice(indx, 0, {
//                             weekday: weekdays[indx % 7],
//                             date: (newDate.getMonth() < 9 ? '0' : '') + (newDate.getMonth() + 1) + '/' + (newDate.getDate() < 10 ? '0' : '') + newDate.getDate() + '/' + newDate.getFullYear(),
//                             id: newDate.getFullYear() + '-' + (newDate.getMonth() < 9 ? '0' : '') + (newDate.getMonth() + 1) + '-' + (newDate.getDate() < 10 ? '0' : '') + newDate.getDate(),
//                             times: []
//                         })
//                     }
//             ;timeSlots = '<ul>';
//             if (days.length > 0)
//                 for (indxDay = _l = 0,
//                 _ref4 = days.length - 1; 0 <= _ref4 ? _l <= _ref4 : _l >= _ref4; indxDay = 0 <= _ref4 ? ++_l : --_l) {
//                     timeSlots += '<li class="day-grid"><ol><li>' + days[indxDay].weekday + '<span>' + days[indxDay].date + '</span></li><li class="slot-holder"><div class="slots" id="' + days[indxDay].id + '">';
//                     if (days[indxDay].times.length > 0)
//                         for (indxTime = _m = 0,
//                         _ref5 = days[indxDay].times.length - 1; 0 <= _ref5 ? _m <= _ref5 : _m >= _ref5; indxTime = 0 <= _ref5 ? ++_m : --_m)
//                             timeSlots += '<a href="#" data-blockid="' + days[indxDay].times[indxTime].id + '" class="time-slot">' + days[indxDay].times[indxTime].time + '</a>';
//                     timeSlots += '</div></li><li class="scroller">More...</li></ol></li>'
//                 }
//             ;timeSlots += "</ul>";
//             MDOCS.$("#pp_booking #grid-block").html(timeSlots);
//             MDOCS.$("#pp_booking li.day-grid").each(function() {
//                 if (MDOCS.$(this).find('a.time-slot').length === 0) {
//                     return MDOCS.$(this).addClass('empty-grid')
//                 } else if (MDOCS.$(this).find('a.time-slot').length <= 4)
//                     return MDOCS.$(this).addClass('maxed-grid')
//             });
//             MDOCS.$("#pp_booking #grid-block ul").css({
//                 width: (MDOCS.$("li.day-grid").length * 90) + 'px'
//             });
//             MDOCS.ob.chunks = parseInt(MDOCS.$("#pp_booking li.day-grid").length / 7);
//             if (MDOCS.$("#pp_booking li.day-grid").length % 7 > 0)
//                 MDOCS.ob.chunks++;
//             return true
//         }
// }
// ).call(this);
// ;(function() {
//     var root;
//     root = typeof exports !== "undefined" && exports !== null ? exports : this;
//     if (typeof MDOCS !== "undefined" && MDOCS !== null ) {
//         MDOCS.ob.clickTerms = function() {
//             return MDOCS.ob.checkedLegalCheckboxes = MDOCS.$('#pp_booking #terms_confirm input[type="checkbox"]').prop('checked')
//         }
//         ;
//         MDOCS.ob.submitAppointment = function(submitFromStep) {
//             var field, field2, formFieldNames, formFields, formFields1, formFields2, indx, indx1;
//             MDOCS.ob.submitFromStep = submitFromStep;
//             if (root.ga != null )
//                 root.ga('send', 'event', 'bookonline', 'submit', 'step ' + submitFromStep);
//             MDOCS.ob.disableSubmitButtons();
//             if (MDOCS.ob.submitFromStep === 1) {
//                 if (!MDOCS.ob.verifApptForm(1)) {
//                     MDOCS.ob.enableSubmitButtons();
//                     if (root.ga != null )
//                         root.ga('send', 'event', 'bookonline', 'submit', 'step ' + submitFromStep + ' error validation');
//                     return
//                 }
//             } else if (!MDOCS.ob.verifApptForm(2)) {
//                 MDOCS.ob.enableSubmitButtons();
//                 if (root.ga != null )
//                     root.ga('send', 'event', 'bookonline', 'submit', 'step ' + submitFromStep + ' error validation');
//                 return
//             }
//             ;formFields = {};
//             if (MDOCS.ob.submitFromStep === 1) {
//                 formFields = MDOCS.$("#pp_booking #patient-form").serialize()
//             } else {
//                 formFields1 = MDOCS.$("#pp_booking #patient-form").serializeArray();
//                 formFields2 = MDOCS.$("#pp_booking #patient-additional-info-form").serializeArray();
//                 formFieldNames = [];
//                 for (indx in formFields1) {
//                     field = formFields1[indx];
//                     formFieldNames.push(field.name)
//                 }
//                 ;for (indx in formFields2) {
//                     field = formFields2[indx];
//                     if ((MDOCS.ob.cals[0].field_settings[field.name] != null ) && parseInt(MDOCS.ob.cals[0].field_settings[field.name].step) === 2)
//                         if (formFieldNames.indexOf(field.name) >= 0) {
//                             for (indx1 in formFields1) {
//                                 field2 = formFields1[indx1];
//                                 if (field2.name === field.name) {
//                                     formFields1[indx1] = field;
//                                     break
//                                 }
//                             }
//                         } else
//                             formFields1[formFields1.length] = field
//                 }
//                 ;formFields = MDOCS.$.param(formFields1)
//             }
//             ;return MDOCS.$.ajax({
//                 type: window.isIE9OrBelow() ? "GET" : "POST",
//                 url: MDOCS.ajaxCompatibleEndpoint + '/widgets/appointment/make',
//                 data: formFields,
//                 dataType: 'json',
//                 cache: false,
//                 async: true,
//                 crossDomain: true,
//                 headers: {
//                     'Access-Control-Allow-Origin': '*'
//                 }
//             }).done(MDOCS.ob.successPostBooking).error(MDOCS.ob.failPostBooking)
//         }
//         ;
//         MDOCS.ob.successPostBooking = function(data) {
//             var i, links, telephoneNum, _i, _ref, _ref1, _ref2, _ref3;
//             if (data.status === 'success') {
//                 if (root.ga != null ) {
//                     if (MDOCS.$("#pp_booking input[name='newpatient']:checked").val() === "yes") {
//                         root.ga('send', 'event', 'button', 'click', 'online booking - new')
//                     } else
//                         root.ga('send', 'event', 'button', 'click', 'online booking - returning');
//                     root.ga('send', 'event', 'bookonline', 'submit', 'booking success')
//                 }
//                 ;telephoneNum = '';
//                 if (((_ref = data.message) != null ? _ref.phone : void (0)) != null )
//                     telephoneNum = 'at ' + data.message.phone;
//                 MDOCS.$('#pp_booking .apt-conf-phone').text(telephoneNum);
//                 if (((_ref1 = data.message) != null ? (_ref2 = _ref1.formLinks) != null ? _ref2.length : void (0) : void (0)) > 0) {
//                     links = '<p class="type-wrapper">Register online now: ';
//                     for (i = _i = 0,
//                     _ref3 = data.message.formLinks.length - 1; 0 <= _ref3 ? _i <= _ref3 : _i >= _ref3; i = 0 <= _ref3 ? ++_i : --_i)
//                         links += '<a class="btn-goto-form" data-url="' + data.message.formLinks[i].url + '" href="#">' + data.message.formLinks[i].title + ' <i class="fa fa-external-link"></i></a>';
//                     links += '</p>';
//                     if (MDOCS.ob.step2Required) {
//                         MDOCS.$('#pp_booking .apt-conf-formlinks2').html(links)
//                     } else
//                         MDOCS.$('#pp_booking .apt-conf-formlinks').html(links);
//                     MDOCS.$('#pp_booking .btn-goto-form').on('click', MDOCS.ob.goToForm)
//                 }
//                 ;if (MDOCS.ob.submitFromStep === 1) {
//                     MDOCS.$('#pp_booking #patient-additional-info-form input[name="id"]').val(data.appointment_id);
//                     MDOCS.ob.showAppointmentStep(2);
//                     if (root.ga != null )
//                         root.ga('send', 'event', 'bookonline', 'view', 'step 2')
//                 } else {
//                     MDOCS.$("#pp_booking #patient-additional-info-form")[0].reset();
//                     MDOCS.ob.showAppointmentStep(3);
//                     if (root.ga != null )
//                         root.ga('send', 'event', 'bookonline', 'view', 'step 3')
//                 }
//                 ;MDOCS.$("#pp_booking #patient-form")[0].reset();
//                 MDOCS.$("#pp_booking #grid-block a").removeClass("checked");
//                 MDOCS.ob.enableSubmitButtons();
//                 return MDOCS.ob.calLoaded = false
//             } else {
//                 if (MDOCS.ob.submitFromStep === 2)
//                     MDOCS.ob.showAppointmentStep(1);
//                 MDOCS.ob.enableSubmitButtons();
//                 alert('Sorry, ' + (data.message ? data.message.toLowerCase() : 'there was an error processing your request.') + '\nPlease try again.');
//                 MDOCS.ob.calLoaded = false;
//                 MDOCS.ob.loadCalendar();
//                 if (root.ga != null )
//                     return root.ga('send', 'event', 'bookonline', 'submit', 'booking error')
//             }
//         }
//         ;
//         MDOCS.ob.failPostBooking = function() {
//             alert('Sorry there was an error processing your request. Please try again.');
//             if (root.ga != null )
//                 root.ga('send', 'event', 'bookonline', 'submit', 'booking error');
//             if (MDOCS.ob.submitFromStep === 2)
//                 MDOCS.ob.showAppointmentStep(1);
//             MDOCS.ob.enableSubmitButtons();
//             MDOCS.ob.calLoaded = false;
//             return MDOCS.ob.loadCalendar()
//         }
//         ;
//         MDOCS.ob.submitApptUpdate = function() {
//             MDOCS.ob.disableSubmitButtons();
//             if (!MDOCS.ob.verifApptForm(2)) {
//                 MDOCS.ob.enableSubmitButtons();
//                 return
//             }
//             ;return MDOCS.$.ajax({
//                 type: window.isIE9OrBelow() ? "GET" : "POST",
//                 url: MDOCS.ajaxCompatibleEndpoint + '/widgets/appointment/update',
//                 data: MDOCS.$("#pp_booking #patient-additional-info-form").serialize(),
//                 dataType: 'json',
//                 cache: false,
//                 async: true,
//                 crossDomain: true,
//                 headers: {
//                     'Access-Control-Allow-Origin': '*'
//                 }
//             }).done(MDOCS.ob.successUpdateBooking).error(MDOCS.ob.failUpdateBooking)
//         }
//         ;
//         MDOCS.ob.successUpdateBooking = function(data) {
//             if (data.status === 'success') {
//                 MDOCS.ob.showAppointmentStep(3);
//                 MDOCS.ob.enableSubmitButtons();
//                 MDOCS.$("#pp_booking #patient-form")[0].reset();
//                 MDOCS.$("#pp_booking #patient-additional-info-form")[0].reset();
//                 MDOCS.$('#pp_booking select[name="insurance_provider_id"]').val('').trigger("chosen:updated");
//                 if (root.ga != null ) {
//                     root.ga('send', 'event', 'button', 'click', 'online booking - additional info');
//                     return root.ga('send', 'event', 'bookonline', 'submit', 'additional info success')
//                 }
//             } else {
//                 alert('Sorry, ' + (data.message ? data.message.toLowerCase() : 'there was an error processing your request.') + '\nPlease try again.');
//                 MDOCS.ob.enableSubmitButtons();
//                 if (root.ga != null )
//                     return root.ga('send', 'event', 'bookonline', 'submit', 'additional info error')
//             }
//         }
//         ;
//         MDOCS.ob.failUpdateBooking = function() {
//             alert('Sorry there was an error processing your request. Please try again.');
//             MDOCS.ob.enableSubmitButtons();
//             if (root.ga != null )
//                 return root.ga('send', 'event', 'bookonline', 'submit', 'additional info error')
//         }
//         ;
//         MDOCS.ob.disableSubmitButtons = function() {
//             return MDOCS.$("#pp_booking .btn-book-now, #pp_booking .btn-book-additional-submit").html('<i class="fa fa-cog fa-spin"></i> Processing').prop("disabled", true)
//         }
//         ;
//         MDOCS.ob.enableSubmitButtons = function() {
//             MDOCS.$("#pp_booking .btn-book-now").html(MDOCS.ob.step2Required ? 'Next' : MDOCS.ob.bookNowLabel).prop("disabled", false);
//             return MDOCS.$("#pp_booking .btn-book-additional-submit").html(MDOCS.ob.step2Required ? MDOCS.ob.bookNowLabel : 'Submit').prop("disabled", false)
//         }
//         ;
//         MDOCS.ob.submitBooking = function() {
//             if (MDOCS.ob.step2Required) {
//                 MDOCS.ob.disableSubmitButtons();
//                 if (!MDOCS.ob.verifApptForm(1)) {
//                     MDOCS.ob.enableSubmitButtons();
//                     return false
//                 }
//                 ;MDOCS.ob.showAppointmentStep(2);
//                 MDOCS.ob.enableSubmitButtons()
//             } else
//                 MDOCS.ob.submitAppointment(1);
//             return false
//         }
//         ;
//         MDOCS.ob.submitBookingExtra = function() {
//             if (MDOCS.ob.step2Required) {
//                 MDOCS.ob.submitAppointment(2)
//             } else
//                 MDOCS.ob.submitApptUpdate();
//             return false
//         }
//     }
// }
// ).call(this);
// ;(function() {
//     var root;
//     root = typeof exports !== "undefined" && exports !== null ? exports : this;
//     if (typeof MDOCS !== "undefined" && MDOCS !== null ) {
//         MDOCS.ob.selectDoc = function() {
//             var i, _i, _ref;
//             MDOCS.ob.calPracticeId = 0;
//             MDOCS.ob.calDoctorId = MDOCS.$(this).attr('data-docid');
//             MDOCS.$('#pp_booking')[0].className = MDOCS.$('#pp_booking')[0].className.replace(/\bppp-.*\d/, '');
//             MDOCS.$('#pp_booking').addClass('ppp-doc-' + MDOCS.ob.calDoctorId);
//             if (MDOCS.ob.calDoctors.length > 0)
//                 for (i = _i = 0,
//                 _ref = MDOCS.ob.calDoctors.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i)
//                     if (MDOCS.ob.calDoctors[i].id === MDOCS.ob.calDoctorId) {
//                         MDOCS.ob.calDoctor = MDOCS.ob.calDoctors[i];
//                         break
//                     }
//             ;MDOCS.$('#pp_booking #patient-form input[name="doctor_id"]').val(MDOCS.ob.calDoctorId);
//             MDOCS.ob.calLoaded = false;
//             MDOCS.ob.loadCalendar();
//             return false
//         }
//         ;
//         MDOCS.ob.selectLoc = function() {
//             var i, _i, _ref;
//             MDOCS.ob.calPracticeId = 0;
//             MDOCS.ob.calLocationId = MDOCS.$(this).attr('data-locid');
//             MDOCS.$('#pp_booking')[0].className = MDOCS.$('#pp_booking')[0].className.replace(/\bppp-.*\d/, '');
//             MDOCS.$('#pp_booking').addClass('ppp-loc-' + MDOCS.ob.calLocationId);
//             if (MDOCS.ob.calLocations.length > 0)
//                 for (i = _i = 0,
//                 _ref = MDOCS.ob.calLocations.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i)
//                     if (MDOCS.ob.calLocations[i].id === MDOCS.ob.calLocationId) {
//                         MDOCS.ob.calLocation = MDOCS.ob.calLocations[i];
//                         break
//                     }
//             ;MDOCS.$('#pp_booking #patient-form input[name="location_id"]').val(MDOCS.ob.calLocationId);
//             MDOCS.ob.calLoaded = false;
//             MDOCS.ob.loadCalendar();
//             return false
//         }
//         ;
//         MDOCS.ob.selectedReason = function() {
//             var buildCalResult, reasonVal;
//             if (MDOCS.ob.reasonsFilterBookings) {
//                 MDOCS.$("#pp_booking input#block-id").val('');
//                 reasonVal = MDOCS.$(this).val();
//                 if (reasonVal === '') {
//                     MDOCS.$('#pp_booking #calendar-block-select-reason').show();
//                     MDOCS.$('#pp_booking #calendar-block-loading').hide();
//                     MDOCS.$('#pp_booking #calendar-block').removeClass('visible');
//                     return MDOCS.$("#pp_booking select#calendar-time").html('')
//                 } else {
//                     MDOCS.$('#pp_booking #calendar-block-select-reason').hide();
//                     MDOCS.$('#pp_booking #calendar-block-loading').show();
//                     buildCalResult = MDOCS.ob.buildCalendar(MDOCS.$(this).val(), MDOCS.$(this).find(':selected').data('ext_reason_id'));
//                     MDOCS.ob.buildAppointmentOptions(MDOCS.$(this).val());
//                     MDOCS.ob.checkSliders();
//                     MDOCS.$('#pp_booking #calendar-block-loading').hide();
//                     MDOCS.$('#pp_booking #calendar-block').addClass('visible');
//                     MDOCS.$("#pp_booking .modal-body.loading").hide();
//                     MDOCS.$("#pp_booking .modal-content .caldetails").show();
//                     if (!buildCalResult)
//                         return MDOCS.$('#pp_booking #calendar-block').html('&nbsp; Sorry, no appointments available.')
//                 }
//             }
//         }
//         ;
//         MDOCS.ob.selectBlock = function() {
//             if (MDOCS.$(this).data('blockid')) {
//                 MDOCS.$("#grid-block a").removeClass("checked");
//                 MDOCS.$(this).addClass("checked");
//                 MDOCS.$("input#block-id").val(MDOCS.$(this).data('blockid'))
//             }
//             ;return false
//         }
//     }
// }
// ).call(this);
// ;(function() {
//     var root;
//     root = typeof exports !== "undefined" && exports !== null ? exports : this;
//     if (typeof MDOCS !== "undefined" && MDOCS !== null ) {
//         MDOCS.ob.findDoctorsInCals = function() {
//             var cal, calOwner, doc, docIndx, docLocs, doctorIds, doctors, indx, indxLoc, _i, _ref, _ref1, _ref2;
//             doctors = [];
//             doctorIds = [];
//             _ref = MDOCS.ob.cals;
//             for (indx in _ref) {
//                 cal = _ref[indx];
//                 calOwner = cal.calendar_owner;
//                 if (calOwner.practice != null ) {
//                     _ref1 = calOwner.practice['doctors'];
//                     for (docIndx in _ref1) {
//                         doc = _ref1[docIndx];
//                         if (doctorIds.indexOf(doc.id) < 0) {
//                             doctors.push(doc);
//                             doctorIds.push(doc.id)
//                         }
//                     }
//                 }
//                 ;if (calOwner.doctor != null )
//                     if (doctorIds.indexOf(calOwner.doctor['id']) < 0) {
//                         doctors.push(calOwner.doctor);
//                         doctorIds.push(calOwner.doctor['id'])
//                     }
//                 ;if ((calOwner.location != null ) && calOwner.doctor === void (0) && (calOwner.location['doctor_locations'] != null )) {
//                     docLocs = calOwner.location['doctor_locations'];
//                     if (docLocs.length > 0)
//                         for (indxLoc = _i = 0,
//                         _ref2 = docLocs.length - 1; 0 <= _ref2 ? _i <= _ref2 : _i >= _ref2; indxLoc = 0 <= _ref2 ? ++_i : --_i)
//                             if (doctorIds.indexOf(docLocs[indxLoc]['doctor']['id']) < 0) {
//                                 doctors.push(docLocs[indxLoc]['doctor']);
//                                 doctorIds.push(docLocs[indxLoc]['doctor']['id'])
//                             }
//                 }
//             }
//             ;return MDOCS.ob.calDoctors = _.sortBy(doctors, function(d) {
//                 if (_.has(d, 'sort_id')) {
//                     return d.sort_id
//                 } else
//                     return null
//             })
//         }
//         ;
//         MDOCS.ob.findLocationsInCals = function() {
//             var cal, calOwner, doc, docIndx, docLocs, indx, indxLoc, locationIds, locations, locs, _i, _j, _k, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
//             locations = [];
//             locationIds = [];
//             _ref = MDOCS.ob.cals;
//             for (indx in _ref) {
//                 cal = _ref[indx];
//                 calOwner = cal.calendar_owner;
//                 if (calOwner.practice != null )
//                     if (((_ref1 = calOwner.practice['doctors']) != null ? _ref1.length : void (0)) > 0) {
//                         _ref2 = calOwner.practice['doctors'];
//                         for (docIndx in _ref2) {
//                             doc = _ref2[docIndx];
//                             docLocs = doc.doctor_locations;
//                             if (docLocs.length > 0)
//                                 for (indxLoc = _i = 0,
//                                 _ref3 = docLocs.length - 1; 0 <= _ref3 ? _i <= _ref3 : _i >= _ref3; indxLoc = 0 <= _ref3 ? ++_i : --_i)
//                                     if (locationIds.indexOf(docLocs[indxLoc]['location']['id']) < 0) {
//                                         locations.push(docLocs[indxLoc]['location']);
//                                         locationIds.push(docLocs[indxLoc]['location']['id'])
//                                     }
//                         }
//                     } else if (((_ref4 = calOwner.practice['locations']) != null ? _ref4.length : void (0)) > 0) {
//                         locs = calOwner.practice['locations'];
//                         for (indxLoc = _j = 0,
//                         _ref5 = locs.length - 1; 0 <= _ref5 ? _j <= _ref5 : _j >= _ref5; indxLoc = 0 <= _ref5 ? ++_j : --_j)
//                             if (locationIds.indexOf(locs[indxLoc]['id']) < 0) {
//                                 locations.push(locs[indxLoc]);
//                                 locationIds.push(locs[indxLoc]['id'])
//                             }
//                     }
//                 ;if ((calOwner.doctor != null ) && calOwner.location === void (0)) {
//                     docLocs = calOwner.doctor['doctor_locations'];
//                     if (docLocs.length > 0)
//                         for (indxLoc = _k = 0,
//                         _ref6 = docLocs.length - 1; 0 <= _ref6 ? _k <= _ref6 : _k >= _ref6; indxLoc = 0 <= _ref6 ? ++_k : --_k)
//                             if (locationIds.indexOf(docLocs[indxLoc]['location']['id']) < 0) {
//                                 locations.push(docLocs[indxLoc]['location']);
//                                 locationIds.push(docLocs[indxLoc]['location']['id'])
//                             }
//                 }
//                 ;if (calOwner.location != null )
//                     if (locationIds.indexOf(calOwner.location['id']) < 0) {
//                         locations.push(calOwner.location);
//                         locationIds.push(calOwner.location['id'])
//                     }
//             }
//             ;return MDOCS.ob.calLocations = locations
//         }
//     }
// }
// ).call(this);
// ;(function() {
//     var root;
//     root = typeof exports !== "undefined" && exports !== null ? exports : this;
//     if (typeof MDOCS !== "undefined" && MDOCS !== null ) {
//         MDOCS.ob.verifApptForm = function(verifFromStep) {
//             var countStep2Filled, dob_date, errorMessage, errors, fieldIndx, inputType, ins_provider, now_date, sectionLabel, sectionisClass, val, _i, _ref, _ref1;
//             MDOCS.$("#pp_booking .modal-body span.error").remove();
//             MDOCS.$("#pp_booking input, #pp_booking select, #pp_booking textarea, #pp_booking label").removeClass('required');
//             countStep2Filled = 0;
//             errors = 0;
//             if (MDOCS.ob.showLegalCheckboxes && !MDOCS.ob.checkedLegalCheckboxes) {
//                 errors++;
//                 MDOCS.$("#pp_booking #book-online .modal-body .right #terms_confirm").append('<span class="error"><br/>* Please agree to our terms of use and privacy policy</span>')
//             }
//             ;ins_provider = null ;
//             for (fieldIndx = _i = 0,
//             _ref = MDOCS.ob.bookingFields.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; fieldIndx = 0 <= _ref ? ++_i : --_i)
//                 if (parseInt(MDOCS.ob.cals[0].field_settings[MDOCS.ob.bookingFields[fieldIndx]].step) === verifFromStep) {
//                     val;
//                     sectionLabel = MDOCS.ob.bookingFields[fieldIndx];
//                     inputType = 'input';
//                     if ((MDOCS.ob.bookingFields[fieldIndx] === 'reason' && ((_ref1 = MDOCS.ob.reasons) != null ? _ref1.length : void (0)) > 0) || MDOCS.ob.bookingFields[fieldIndx] === 'insurance_provider_id' || MDOCS.ob.bookingFields[fieldIndx] === 'sex') {
//                         inputType = 'select'
//                     } else if (MDOCS.ob.bookingFields[fieldIndx] === 'comment')
//                         inputType = 'textarea';
//                     if (MDOCS.ob.bookingFields[fieldIndx] === 'firstname' || MDOCS.ob.bookingFields[fieldIndx] === 'lastname')
//                         sectionLabel = 'name';
//                     if (MDOCS.ob.bookingFields[fieldIndx] === 'newpatient') {
//                         val = MDOCS.$("#pp_booking #newpatient-section-" + verifFromStep + " input[name='newpatient']:checked").length
//                     } else
//                         val = MDOCS.$("#pp_booking #" + sectionLabel + "-section-" + verifFromStep + " " + inputType + "[name='" + MDOCS.ob.bookingFields[fieldIndx] + "']").val();
//                     if (MDOCS.ob.bookingFields[fieldIndx] === 'insurance_provider_id')
//                         ins_provider = parseInt(val);
//                     if (verifFromStep === 2 && !MDOCS.ob.step2Required && val)
//                         countStep2Filled++;
//                     errorMessage = void (0);
//                     if ((ins_provider != null ) && (MDOCS.ob.bookingFields[fieldIndx] === 'insurance_id_number' || MDOCS.ob.bookingFields[fieldIndx] === 'insurance_group_number' || MDOCS.ob.bookingFields[fieldIndx] === 'insurance_phone') && (ins_provider === 700 || ins_provider === 701 || ins_provider === 602))
//                         ;
//                     else if (MDOCS.ob.cals[0].field_settings[MDOCS.ob.bookingFields[fieldIndx]].required && !val) {
//                         errorMessage = 'required'
//                     } else if (MDOCS.ob.bookingFields[fieldIndx] === 'email' && val !== '' && !root.isValidEmailAddress(val)) {
//                         errorMessage = 'invalid email address'
//                     } else if ((MDOCS.ob.bookingFields[fieldIndx] === 'phone' || MDOCS.ob.bookingFields[fieldIndx] === 'insurance_phone') && val !== '') {
//                         errorMessage = root.validatePhone(val)
//                     } else if (MDOCS.ob.bookingFields[fieldIndx] === 'date_of_birth' && val !== '' && !root.validateDate(val)) {
//                         errorMessage = 'invalid date. enter mm/dd/yyyy'
//                     } else if (MDOCS.ob.bookingFields[fieldIndx] === 'date_of_birth' && val !== '') {
//                         dob_date = new Date(val);
//                         now_date = new Date();
//                         if (dob_date > now_date)
//                             errorMessage = 'invalid date. DOB must be a past date'
//                     }
//                     ;if ((errorMessage != null ) && errorMessage !== '') {
//                         sectionisClass = false;
//                         if (MDOCS.ob.bookingFields[fieldIndx] === 'reason')
//                             sectionisClass = true;
//                         MDOCS.$("#pp_booking #" + sectionLabel + "-section-" + verifFromStep + " " + (sectionisClass ? '.' : '#') + sectionLabel + "-label").append('<span class="error">* ' + errorMessage + '</span>');
//                         MDOCS.$("#pp_booking #" + sectionLabel + "-section-" + verifFromStep + " " + inputType + "[name='" + MDOCS.ob.bookingFields[fieldIndx] + "']").addClass('required');
//                         if (MDOCS.ob.bookingFields[fieldIndx] === 'newpatient')
//                             MDOCS.$("#pp_booking #" + sectionLabel + "-section-" + verifFromStep + " ul label").addClass('required');
//                         errors++
//                     }
//                 }
//             ;if (verifFromStep === 1 && MDOCS.$("#pp_booking .modal-body #block-id").val() === '') {
//                 MDOCS.$("#pp_booking #book-online .modal-body .right").prepend('<span class="error">* Please select an appointment time</span>');
//                 errors++
//             }
//             ;if (verifFromStep === 2 && !MDOCS.ob.step2Required && countStep2Filled === 0) {
//                 MDOCS.$("#pp_booking #booked-additional-info .modal-body .label").append('<span class="error">* required</span>');
//                 MDOCS.$("#pp_booking #booked-additional-info .modal-body input, #booked-additional-info .modal-body textarea").addClass('required');
//                 errors++
//             }
//             ;return errors === 0
//         }
//         ;
//         MDOCS.ob.showAppointmentStep = function(showStep) {
//             if (showStep === 1) {
//                 MDOCS.$('#pp_booking #booked-additional-info').modal('hide');
//                 MDOCS.$('#pp_booking #booked-online').modal('hide');
//                 MDOCS.$('#pp_booking #book-online').modal('show');
//                 return MDOCS.$('#pp_booking #booked-booking-screened').modal('hide')
//             } else if (showStep === 2) {
//                 MDOCS.$('#pp_booking #book-online').modal('hide');
//                 MDOCS.$('#pp_booking #booked-online').modal('hide');
//                 MDOCS.$('#pp_booking #booked-additional-info').modal('show');
//                 return MDOCS.$('#pp_booking #booked-booking-screened').modal('hide')
//             } else if (showStep === 3) {
//                 MDOCS.$('#pp_booking #booked-additional-info').modal('hide');
//                 MDOCS.$('#pp_booking #book-online').modal('hide');
//                 MDOCS.$('#pp_booking #booked-online').modal('show');
//                 return MDOCS.$('#pp_booking #booked-booking-screened').modal('hide')
//             } else if (showStep === 4) {
//                 MDOCS.$('#pp_booking #booked-additional-info').modal('hide');
//                 MDOCS.$('#pp_booking #book-online').modal('hide');
//                 MDOCS.$('#pp_booking #booked-online').modal('hide');
//                 return MDOCS.$('#pp_booking #booking-screened').modal('show')
//             }
//         }
//         ;
//         MDOCS.ob.buildAppointmentOptions = function(reasonId) {
//             var block, currentDay, filteredBlocks, found, indx, indxBlock, indxReason, numBlocks, numDays, numReasons, theCalBlocks, timeSlots, _i, _j, _ref, _ref1, _ref2;
//             theCalBlocks = [];
//             _ref = MDOCS.ob.cals[0]['calendar_blocks'];
//             for (indx in _ref) {
//                 block = _ref[indx];
//                 theCalBlocks.push(block)
//             }
//             ;if (reasonId) {
//                 filteredBlocks = [];
//                 numBlocks = root._.size(theCalBlocks);
//                 if (numBlocks > 0)
//                     for (indxBlock = _i = 0,
//                     _ref1 = numBlocks - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; indxBlock = 0 <= _ref1 ? ++_i : --_i) {
//                         numReasons = theCalBlocks[indxBlock].reasons != null ? theCalBlocks[indxBlock].reasons.length : 0;
//                         found = false;
//                         if (numReasons > 0)
//                             for (indxReason = _j = 0,
//                             _ref2 = numReasons - 1; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; indxReason = 0 <= _ref2 ? ++_j : --_j)
//                                 if (theCalBlocks[indxBlock].reasons[indxReason].id === parseInt(reasonId)) {
//                                     found = true;
//                                     break
//                                 }
//                         ;if (found)
//                             filteredBlocks.push(theCalBlocks[indxBlock])
//                     }
//                 ;theCalBlocks = filteredBlocks
//             }
//             ;timeSlots = '<option value=""> - Select Date & Time - </option>';
//             currentDay = '';
//             numDays = 0;
//             MDOCS.$.each(theCalBlocks, function(i, slot) {
//                 var hours, minutes, newDay, scheduleDate, suffix;
//                 newDay = false;
//                 if (currentDay !== slot.date) {
//                     currentDay = slot.date;
//                     numDays++;
//                     scheduleDate = slot.date.split('-')[1] + '/' + slot.date.split('-')[2] + '/' + slot.date.split('-')[0];
//                     if (numDays > 1)
//                         timeSlots += '</optgroup>';
//                     timeSlots += '<optgroup label="' + slot.weekday + ' ' + scheduleDate + '">';
//                     newDay = true
//                 }
//                 ;hours = slot.start_time.split(':')[0];
//                 minutes = slot.start_time.split(':')[1];
//                 suffix = hours >= 12 ? 'pm' : 'am';
//                 hours = hours > 12 ? hours - 12 : hours;
//                 hours = hours === '00' ? 12 : hours;
//                 return timeSlots += '<option value="' + slot.id + '">' + hours + ':' + minutes + ' ' + suffix + '</option>'
//             });
//             if (numDays > 0)
//                 timeSlots += '</optgroup>';
//             MDOCS.$("#pp_booking select#calendar-time").html(timeSlots);
//             MDOCS.$("#pp_booking select#calendar-time optgroup").each(function() {
//                 if (MDOCS.$(this).find('option').length === 0)
//                     return MDOCS.$(this).remove()
//             });
//             MDOCS.$("#pp_booking select#calendar-time").blur();
//             return MDOCS.$("#pp_booking select#calendar-time").focus()
//         }
//     }
// }
// ).call(this);
// ;;
// MDOCS.CDNVersion = "";
// MDOCS.practiceId = 1;
// MDOCS.endpoint = "";
// MDOCS.ob.init();
