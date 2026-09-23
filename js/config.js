/* ---------------------------------------------------------------------------
   Kuou Fencing Club — site configuration
   Everything an owner is likely to change lives here. Edit, save, reload.
   (Links inside index.html — nav, footer, social cards — are plain <a> tags
   and are edited there.)
   --------------------------------------------------------------------------- */
window.CLUB = {
  name: "Kuou Fencing Club",
  nameZh: "古歐擊劍會",

  /* The contact form sends email without leaving the page.
     - formEndpoint "" (empty) → posts through FormSubmit (formsubmit.co) to
       `email`. The first message sends an activation link to that inbox;
       click it once and every later message is delivered.
     - or a Formspree URL (https://formspree.io/f/xxxxxxxx), or any endpoint
       that accepts a POST of JSON.
     `email` is a placeholder — swap in the real inbox before launch.         */
  formEndpoint: "",
  email: "hello@kuou.dev",

  /* Where the member app lives. The "Member login" links in the header and
     the footer point at it, and js/main.js rewrites their href from this on
     load — so the address is set once here rather than in three places in the
     markup. The literal href in index.html is the no-JS fallback; keep the two
     in step, or change this and let the rewrite do it.
     No trailing slash.                                                       */
  appUrl: "https://app.kuou.dev",

  /* Social handles used by the share buttons and embeds. */
  line: "https://line.me/R/ti/p/@kuoufencing",
  instagram: "https://www.instagram.com/kuoufencing",
  facebookPage: "kuoufencing",

  /* Text that gets shared when someone taps the share buttons. */
  shareTitle: "Kuou Fencing Club",
  shareText: "Physical training, mental training, data-driven — épée and saber in Taipei, Taiwan, guests from other clubs welcome. 身體訓練、心理訓練、數據導向：台灣台北的銳劍與軍刀，歡迎其他俱樂部劍手。",

  /* Default language when a visitor has no saved preference:
     "auto" follows the browser, or force it with "en" / "zh".                */
  defaultLang: "auto"
};
