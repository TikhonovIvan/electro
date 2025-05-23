"use strict";

document.addEventListener('DOMContentLoaded', function () {
  // --- Мобильное меню ---
  const toggleBtn = document.querySelector('.menu-toggle > a');
  const nav = document.getElementById('responsive-nav');

  if (toggleBtn && nav) {
    toggleBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      nav.classList.toggle('active');
    });

    nav.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    document.addEventListener('click', function () {
      nav.classList.remove('active');
    });
  }

  // --- Корзина ---
const dropdown = document.querySelector('.dropdown.cart-dropdown-wrapper');
const toggle = dropdown?.querySelector('.dropdown-toggle');
const dropdownContent = dropdown?.querySelector('.cart-dropdown');


toggle?.addEventListener('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  dropdown.classList.toggle('open');
});

dropdownContent?.addEventListener('click', function (e) {
  e.stopPropagation();
});

document.addEventListener('click', function () {
  dropdown.classList.remove('open');
});

  // --- Products Slick ---
  document.querySelectorAll('.products-slick').forEach(el => {
    const nav = el.getAttribute('data-nav');
    $(el).slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      appendArrows: nav ? nav : false,
      responsive: [
        { breakpoint: 991, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
      ]
    });
  });

  // --- Products Widget Slick ---
  document.querySelectorAll('.products-widget-slick').forEach(el => {
    const nav = el.getAttribute('data-nav');
    $(el).slick({
      infinite: true,
      autoplay: true,
      speed: 300,
      dots: false,
      arrows: true,
      appendArrows: nav ? nav : false
    });
  });

  // --- Product Main img Slick ---
  if ($('#product-main-img').length) {
    $('#product-main-img').slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: '#product-imgs'
    });

    $('#product-imgs').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: '#product-main-img',
      responsive: [
        {
          breakpoint: 991,
          settings: { vertical: false, arrows: false, dots: true }
        }
      ]
    });

    // --- Product img zoom ---
    $('#product-main-img .product-preview').zoom(); // jQuery Zoom
  }

  // --- Input Number ---
  document.querySelectorAll('.input-number').forEach(el => {
    const input = el.querySelector('input[type="number"]');
    const up = el.querySelector('.qty-up');
    const down = el.querySelector('.qty-down');

    down.addEventListener('click', () => {
      let value = parseInt(input.value) - 1;
      value = value < 1 ? 1 : value;
      input.value = value;
      input.dispatchEvent(new Event('change'));
      updatePriceSlider(el, value);
    });

    up.addEventListener('click', () => {
      let value = parseInt(input.value) + 1;
      input.value = value;
      input.dispatchEvent(new Event('change'));
      updatePriceSlider(el, value);
    });
  });

  const priceInputMax = document.getElementById('price-max');
  const priceInputMin = document.getElementById('price-min');

  if (priceInputMax) {
    priceInputMax.addEventListener('change', function () {
      updatePriceSlider(this.parentElement, this.value);
    });
  }

  if (priceInputMin) {
    priceInputMin.addEventListener('change', function () {
      updatePriceSlider(this.parentElement, this.value);
    });
  }

  // --- Price Slider ---
  const priceSlider = document.getElementById('price-slider');
  if (priceSlider) {
    noUiSlider.create(priceSlider, {
      start: [1, 999],
      connect: true,
      step: 1,
      range: {
        min: 1,
        max: 999
      }
    });

    priceSlider.noUiSlider.on('update', function (values, handle) {
      const value = values[handle];
      if (handle) {
        priceInputMax.value = value;
      } else {
        priceInputMin.value = value;
      }
    });
  }

  function updatePriceSlider(elem, value) {
    if (!priceSlider || !priceSlider.noUiSlider) return;
    if (elem.classList.contains('price-min')) {
      priceSlider.noUiSlider.set([value, null]);
    } else if (elem.classList.contains('price-max')) {
      priceSlider.noUiSlider.set([null, value]);
    }
  }
});
