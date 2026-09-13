/* ---------------------------------------------------------------------------
   Ember Tide Fencing Club — site configuration
   Everything an owner is likely to change lives here. Edit, save, reload.
   (Links inside index.html — nav, footer, social cards — are plain <a> tags
   and are edited there.)
   --------------------------------------------------------------------------- */
window.CLUB = {
  name: "Ember Tide Fencing Club",
  nameZh: "焰潮擊劍會",

  /* Where the trial-booking form sends. Three options:
     - "" (empty)         → opens the visitor's mail app addressed to `email`
     - a Formspree URL    → https://formspree.io/f/xxxxxxxx
     - any endpoint that accepts a POST of JSON                               */
  formEndpoint: "",
  email: "hello@embertide.tw",

  /* Social handles used by the share buttons and embeds. */
  line: "https://line.me/R/ti/p/@embertide",
  instagram: "https://www.instagram.com/embertidefencing",
  facebookPage: "embertidefencing",

  /* Text that gets shared when someone taps the share buttons. */
  shareTitle: "Ember Tide Fencing Club · 焰潮擊劍會",
  shareText: "Taipei's only bilingual fencing club — foil, épée and sabre in English and Mandarin. 台北唯一的雙語擊劍會。",

  /* Default language when a visitor has no saved preference:
     "auto" follows the browser, or force it with "en" / "zh".                */
  defaultLang: "auto"
};
