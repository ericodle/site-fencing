/* ---------------------------------------------------------------------------
   Sheshouzuo Fencing Club — site configuration
   Everything an owner is likely to change lives here. Edit, save, reload.
   (Links inside index.html — nav, footer, social cards — are plain <a> tags
   and are edited there.)
   --------------------------------------------------------------------------- */
window.CLUB = {
  name: "Sheshouzuo Fencing Club",
  nameZh: "射手座擊劍會",

  /* The contact form sends email without leaving the page.
     - formEndpoint "" (empty) → posts through FormSubmit (formsubmit.co) to
       `email`. The first message sends an activation link to that inbox;
       click it once and every later message is delivered.
     - or a Formspree URL (https://formspree.io/f/xxxxxxxx), or any endpoint
       that accepts a POST of JSON.
     `email` is a placeholder — swap in the real inbox before launch.         */
  formEndpoint: "",
  email: "hello@sheshouzuo.tw",

  /* Social handles used by the share buttons and embeds. */
  line: "https://line.me/R/ti/p/@sheshouzuo",
  instagram: "https://www.instagram.com/sheshouzuofencing",
  facebookPage: "sheshouzuofencing",

  /* Text that gets shared when someone taps the share buttons. */
  shareTitle: "Sheshouzuo Fencing Club · 射手座擊劍會",
  shareText: "Physical training, mental training, data-driven — épée and saber in Taipei, guests from other clubs welcome. 身體訓練、心理訓練、數據導向：台北的銳劍與軍刀，歡迎其他俱樂部劍手。",

  /* Default language when a visitor has no saved preference:
     "auto" follows the browser, or force it with "en" / "zh".                */
  defaultLang: "auto"
};
