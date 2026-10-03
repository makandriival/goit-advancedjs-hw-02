import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const delay = Number(formData.get('delay'));
  const state = formData.get('state');

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
        return;
      }

      reject(delay);
    }, delay);
  });

  promise
    .then((resolvedDelay) => {
      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${resolvedDelay}ms`,
        position: 'topRight',
      });
    })
    .catch((rejectedDelay) => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${rejectedDelay}ms`,
        position: 'topRight',
      });
    })
    .finally(() => {
      form.reset();
    });
});
