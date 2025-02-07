import '../assets/scss/main.scss';

const swiper = new Swiper('.swiper', {
  loop: true,
  slidesPerView: 1,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

const openModal = document.querySelector('._js-open-modal');
const closeModal = document.querySelector('._js-close-modal');
const modal = document.querySelector('.modal');

openModal.addEventListener('click', (e) => {
  e.preventDefault();
  modal.classList.add('open');
});

closeModal.addEventListener('click', (e) => {
  e.preventDefault();
  modal.classList.remove('open');
});

document.addEventListener('click', function (event) {
  const clickedElement = event.target;
  const isClickInsideModal = clickedElement.closest('.modal-wrapper') !== null;
  const isClickOnOpenModalButton = clickedElement.closest('._js-open-modal') !== null;

  if (!isClickInsideModal && !isClickOnOpenModalButton) {
    modal.classList.remove('open');
  }
});

const customCursor = document.getElementById('customCursor');
const swiperContainer = document.querySelector('.swiper');

document.addEventListener('mousemove', (e) => {
  customCursor.style.left = `${e.clientX}px`;
  customCursor.style.top = `${e.clientY}px`;

  const isCursorInsideSwiper = swiperContainer.contains(e.target);

  if (isCursorInsideSwiper) {
    customCursor.style.opacity = 1;

    const screenWidth = window.innerWidth;
    const cursorX = e.clientX;

    if (cursorX < screenWidth / 2) {
      customCursor.classList.remove('right');
      customCursor.classList.add('left');
    } else {
      customCursor.classList.remove('left');
      customCursor.classList.add('right');
    }
  } else {
    customCursor.style.opacity = 0;
  }
});

document.addEventListener('click', (e) => {
  const isModalOpen = document.querySelector('.modal.open');

  if (isModalOpen) {
    return;
  }

  const isCursorInsideSwiper = swiperContainer.contains(e.target);

  if (isCursorInsideSwiper) {
    const screenWidth = window.innerWidth;
    const clickX = e.clientX;

    if (clickX < screenWidth / 2) {
      swiper.slidePrev();
    } else {
      swiper.slideNext();
    }
  }
});

window.addEventListener("DOMContentLoaded", function () {
  [].forEach.call(document.querySelectorAll('.tel'), function (input) {
    var keyCode;

    function mask(event) {
      event.keyCode && (keyCode = event.keyCode);
      var pos = this.selectionStart;
      if (pos < 3) event.preventDefault();
      var matrix = "+7 (___) ___ ____",
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, ""),
        new_value = matrix.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
        });
      i = new_value.indexOf("_");
      if (i != -1) {
        i < 5 && (i = 3);
        new_value = new_value.slice(0, i);
      }
      var reg = matrix.substr(0, this.value.length).replace(/_+/g,
        function (a) {
          return "\\d{1," + a.length + "}";
        }).replace(/[+()]/g, "\\$&");
      reg = new RegExp("^" + reg + "$");
      if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
      if (event.type == "blur" && this.value.length < 5) this.value = "";
    }

    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false);
  });
});

document.querySelector('.modal-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nameInput = this.querySelector('input[placeholder="ИМЯ"]');
  const phoneInput = this.querySelector('input[placeholder="ТЕЛЕФОН"]');

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!name) {
    alert('Пожалуйста, введите ваше имя.');
    nameInput.focus();
    return;
  }

  const phoneRegex = /^\+7 \(\d{3}\) \d{3} \d{4}$/;
  if (!phone || !phoneRegex.test(phone)) {
    alert('Пожалуйста, введите корректный номер телефона.');
    phoneInput.focus();
    return;
  }

  try {
    const sendButton = this.querySelector('.modal-send');
    sendButton.textContent = 'Отправка...';
    sendButton.disabled = true;

    const response = await submitForm({ name, phone });

    alert(response.message);
    this.reset(); // Очистка формы
  } catch (error) {
    alert('Ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
  } finally {
    const sendButton = this.querySelector('.modal-send');
    sendButton.textContent = 'Отправить';
    sendButton.disabled = false;
  }
});

async function submitForm(data) {
    try {
        const response = await fetch('/mail.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(data),
        });

        if (!response.ok) {
            throw new Error('Ошибка сервера');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw new Error('Ошибка при отправке формы');
    }
}
