const CONTRACTS_CLASS = 'navbar-contracts-link';
const LEGACY_PATH = '/docs/0.5.x/';

function toggle() {
  const el = document.querySelector(`.${CONTRACTS_CLASS}`)?.closest('.navbar__item');
  if (!el) return;
  el.style.display = window.location.pathname.startsWith(LEGACY_PATH) ? 'none' : '';
}

if (typeof window !== 'undefined') {
  toggle();

  const observer = new MutationObserver(toggle);
  observer.observe(document.querySelector('#__docusaurus') || document.body, {
    childList: true,
    subtree: true,
  });
}

export function onRouteDidUpdate() {
  toggle();
}
