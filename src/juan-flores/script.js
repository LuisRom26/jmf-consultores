(() => {
  const portrait = document.querySelector('#portrait');
  const photo = portrait?.querySelector('img');

  if (photo) {
    const showPhoto = () => portrait.classList.add('has-photo');
    if (photo.complete && photo.naturalWidth > 0) showPhoto();
    else photo.addEventListener('load', showPhoto, { once: true });
  }

  const status = document.querySelector('#copy-status');
  let statusTimer;
  const announce = (message) => {
    if (!status) return;
    status.textContent = message;
    status.classList.add('is-visible');
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => status.classList.remove('is-visible'), 1800);
  };

  const fallbackCopy = (text) => {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    if (!copied) throw new Error('Copy command failed');
  };

  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copy;
      try {
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(value);
        else fallbackCopy(value);
        announce('Número copiado');
      } catch {
        try { fallbackCopy(value); announce('Número copiado'); }
        catch { announce('No fue posible copiar el número'); }
      }
    });
  });
})();
