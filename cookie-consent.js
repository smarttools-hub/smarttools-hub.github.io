/* ============================================================
   SmartToolsHub — Bandeau de consentement cookies
   À inclure sur chaque page avec :  <script src="cookie-consent.js" defer></script>
   Autonome : injecte son propre HTML + CSS. Multilingue (6 langues).
   Mémorise le choix dans localStorage (clé : sth_cookie_consent).
   ============================================================ */
(function () {
  "use strict";

  var STORE_KEY = "sth_cookie_consent";          // "accepted" | "rejected"
  var LANG_KEY  = "sth_lang";                      // partagé avec le reste du site

  // ---- Traductions ----
  var T = {
    fr: {
      text: "Nous utilisons des cookies pour mesurer l'audience et afficher des publicités (Google AdSense). Vous pouvez accepter ou refuser les cookies non essentiels.",
      accept: "Tout accepter",
      reject: "Refuser",
      more: "En savoir plus"
    },
    en: {
      text: "We use cookies to measure traffic and display ads (Google AdSense). You can accept or reject non-essential cookies.",
      accept: "Accept all",
      reject: "Reject",
      more: "Learn more"
    },
    zh: {
      text: "我们使用 Cookie 来统计访问量并展示广告（Google AdSense）。您可以接受或拒绝非必要的 Cookie。",
      accept: "全部接受",
      reject: "拒绝",
      more: "了解更多"
    },
    ru: {
      text: "Мы используем файлы cookie для измерения аудитории и показа рекламы (Google AdSense). Вы можете принять или отклонить необязательные файлы cookie.",
      accept: "Принять все",
      reject: "Отклонить",
      more: "Подробнее"
    },
    es: {
      text: "Usamos cookies para medir la audiencia y mostrar anuncios (Google AdSense). Puedes aceptar o rechazar las cookies no esenciales.",
      accept: "Aceptar todo",
      reject: "Rechazar",
      more: "Más información"
    },
    pt: {
      text: "Usamos cookies para medir a audiência e exibir anúncios (Google AdSense). Pode aceitar ou recusar os cookies não essenciais.",
      accept: "Aceitar tudo",
      reject: "Recusar",
      more: "Saber mais"
    }
  };

  // ---- Choix de la langue (même logique que le site) ----
  function pickLang() {
    var lang = null;
    try {
      var p = new URLSearchParams(location.search);
      lang = p.get("l");
    } catch (e) {}
    if (!lang) { try { lang = localStorage.getItem(LANG_KEY); } catch (e) {} }
    if (!lang) {
      var nav = (navigator.language || "fr").slice(0, 2);
      if (T[nav]) lang = nav;
    }
    return T[lang] ? lang : "fr";
  }

  // ---- Lire / écrire le consentement ----
  function getConsent() {
    try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }
  function setConsent(v) {
    try { localStorage.setItem(STORE_KEY, v); } catch (e) {}
  }

  // Hook : déclenché à l'acceptation. C'est ICI qu'on activera AdSense plus tard.
  function onAccept() {
    // Quand ton compte AdSense sera prêt, tu pourras charger le script ici, par ex. :
    // var s = document.createElement('script');
    // s.async = true;
    // s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX';
    // s.crossOrigin = 'anonymous';
    // document.head.appendChild(s);
    window.STH_COOKIES_ACCEPTED = true;
    document.dispatchEvent(new CustomEvent("sth-cookies-accepted"));
  }

  // ---- Injection du CSS ----
  function injectStyles() {
    if (document.getElementById("sth-cc-style")) return;
    var css =
      ".sth-cc{position:fixed;left:0;right:0;bottom:0;z-index:9999;" +
      "background:#FFFFFF;border-top:1px solid rgba(201,168,76,0.4);" +
      "box-shadow:0 -4px 24px rgba(44,36,22,0.12);" +
      "padding:1rem 1.3rem;display:flex;align-items:center;gap:1rem;" +
      "flex-wrap:wrap;justify-content:center;" +
      "font-family:'DM Sans',system-ui,-apple-system,sans-serif;" +
      "animation:sthccup .4s cubic-bezier(.16,1,.3,1);}" +
      "@keyframes sthccup{from{transform:translateY(100%);}to{transform:translateY(0);}}" +
      ".sth-cc__text{font-size:.86rem;line-height:1.5;color:#2C2416;" +
      "max-width:640px;font-weight:300;flex:1 1 320px;}" +
      ".sth-cc__text a{color:#A0672A;text-decoration:underline;}" +
      ".sth-cc__btns{display:flex;gap:.6rem;flex-wrap:wrap;flex-shrink:0;}" +
      ".sth-cc__btn{font-family:inherit;font-size:.82rem;font-weight:500;" +
      "padding:.6rem 1.1rem;border-radius:9px;cursor:pointer;border:1px solid transparent;" +
      "transition:transform .12s,box-shadow .2s,background .2s;white-space:nowrap;}" +
      ".sth-cc__btn:hover{transform:translateY(-1px);}" +
      ".sth-cc__btn--accept{background:linear-gradient(135deg,#C9A84C,#A0672A);color:#fff;" +
      "box-shadow:0 4px 14px rgba(201,168,76,0.35);}" +
      ".sth-cc__btn--reject{background:transparent;color:#2C2416;border-color:rgba(201,168,76,0.4);}" +
      ".sth-cc__btn--reject:hover{background:#F7F3EC;}" +
      "@media(max-width:560px){.sth-cc{flex-direction:column;align-items:stretch;text-align:center;}" +
      ".sth-cc__btns{justify-content:center;}}";
    var st = document.createElement("style");
    st.id = "sth-cc-style";
    st.textContent = css;
    document.head.appendChild(st);
  }

  // ---- Construire le bandeau ----
  function buildBanner(lang) {
    var t = T[lang];
    var bar = document.createElement("div");
    bar.className = "sth-cc";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "cookies");

    var txt = document.createElement("p");
    txt.className = "sth-cc__text";
    txt.innerHTML = t.text + ' <a href="privacy.html">' + t.more + "</a>";

    var btns = document.createElement("div");
    btns.className = "sth-cc__btns";

    var reject = document.createElement("button");
    reject.className = "sth-cc__btn sth-cc__btn--reject";
    reject.type = "button";
    reject.textContent = t.reject;
    reject.addEventListener("click", function () {
      setConsent("rejected");
      removeBanner(bar);
    });

    var accept = document.createElement("button");
    accept.className = "sth-cc__btn sth-cc__btn--accept";
    accept.type = "button";
    accept.textContent = t.accept;
    accept.addEventListener("click", function () {
      setConsent("accepted");
      removeBanner(bar);
      onAccept();
    });

    btns.appendChild(reject);
    btns.appendChild(accept);
    bar.appendChild(txt);
    bar.appendChild(btns);
    return bar;
  }

  function removeBanner(bar) {
    bar.style.transition = "transform .3s ease, opacity .3s ease";
    bar.style.transform = "translateY(100%)";
    bar.style.opacity = "0";
    setTimeout(function () { if (bar && bar.parentNode) bar.parentNode.removeChild(bar); }, 320);
  }

  // ---- Démarrage ----
  function start() {
    var consent = getConsent();
    if (consent === "accepted") { onAccept(); return; }   // déjà accepté → on (ré)active
    if (consent === "rejected") { return; }               // déjà refusé → rien
    injectStyles();
    var lang = pickLang();
    var banner = buildBanner(lang);
    document.body.appendChild(banner);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
