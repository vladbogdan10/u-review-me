window.cookieconsent.initialise({
  domain: 'u-review.me',
  palette: {
    popup: {
      background: '#424242',
    },
    button: {
      background: '#f0bc17',
    },
  },
  theme: 'classic',
  type: 'info',
  dismissOnScroll: 1000,
  content: {
    message:
      'We use cookies &#127850; to analyse the use of this website. By using this website you agree to our',
    link: 'Cookie Policy',
    href: '/legal/cookie-policy',
  },
  revokeBtn:
    '<div class="cc-revoke" title="enable or disable cookies">&#127850;</div>',
});
