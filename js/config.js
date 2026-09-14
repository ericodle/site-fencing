/* ---------------------------------------------------------------------------
   Ember Tide Fencing Club — site configuration
   Everything an owner is likely to change lives here. Edit, save, reload.
   (Links inside index.html — nav, footer, social cards — are plain <a> tags
   and are edited there.)
   --------------------------------------------------------------------------- */
window.CLUB = {
  name: "Ember Tide Fencing Club",
  nameZh: "焰潮擊劍會",

  /* The contact form sends email without leaving the page.
     - formEndpoint "" (empty) → posts through FormSubmit (formsubmit.co) to
       `email`. The first message sends an activation link to that inbox;
       click it once and every later message is delivered.
     - or a Formspree URL (https://formspree.io/f/xxxxxxxx), or any endpoint
       that accepts a POST of JSON.
     `email` is a placeholder — swap in the real inbox before launch.         */
  formEndpoint: "",
  email: "hello@embertide.tw",

  /* Social handles used by the share buttons and embeds. */
  line: "https://line.me/R/ti/p/@embertide",
  instagram: "https://www.instagram.com/embertidefencing",
  facebookPage: "embertidefencing",

  /* Text that gets shared when someone taps the share buttons. */
  shareTitle: "Ember Tide Fencing Club · 焰潮擊劍會",
  shareText: "Competitive, cooperative, English-friendly fencing in Taipei — foil, épée and saber, guests from other clubs welcome. 台北競技、合作、英語友善的擊劍會。",

  /* Default language when a visitor has no saved preference:
     "auto" follows the browser, or force it with "en" / "zh".                */
  defaultLang: "auto"
};
