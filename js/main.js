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
  const cartList = document.getElementById('cart-list');
  const cartTotalQty = document.getElementById('cart-total-qty');
  const cartItemCount = document.getElementById('cart-item-count');
  const cartTotalPrice = document.getElementById('cart-total-price');

  // --- Checkout summary ---
  const checkoutProducts = document.getElementById('checkout-products');
  const checkoutTotal = document.getElementById('checkout-total');

  // Загрузка корзины из localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Сохранение корзины
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Обновление блока "Ваш заказ"
  function updateCheckoutSummary() {
    if (!checkoutProducts || !checkoutTotal) return;

    checkoutProducts.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
      const productRow = document.createElement('div');
      productRow.classList.add('order-col');
      productRow.innerHTML = `
        <div>${item.qty}x ${item.name}</div>
        <div>${(item.qty * item.price).toFixed(2)} сом</div>
      `;
      checkoutProducts.appendChild(productRow);

      totalPrice += item.qty * item.price;
    });

    checkoutTotal.textContent = `${totalPrice.toFixed(2)} сом`;
  }

  // Обновление отображения корзины
  function updateCartDisplay() {
    if (!cartList) return;
    
    cartList.innerHTML = '';
    let totalQty = 0;
    let totalPrice = 0;

    cart.forEach((item, index) => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product-widget', 'cart-item');
      productDiv.setAttribute('data-index', index);
      productDiv.innerHTML = `
        <div class="product-img">
          <img src="${item.img}" alt="${item.name}" />
        </div>
        <div class="product-body">
          <h3 class="product-name">${item.name}</h3>
          <h4 class="product-price">${item.qty} x ${item.price} сом</h4>
        </div>
        <button class="delete" data-index="${index}">
          <i class="fa fa-close"></i>
        </button>
      `;
      cartList.appendChild(productDiv);

      totalQty += item.qty;
      totalPrice += item.price * item.qty;
    });

    if (cartTotalQty) cartTotalQty.textContent = totalQty;
    if (cartItemCount) cartItemCount.textContent = cart.length;
    if (cartTotalPrice) cartTotalPrice.textContent = totalPrice.toFixed(2);

    saveCart();
    updateCheckoutSummary(); // Обновляем блок "Ваш заказ"
  }

  // Инициализация корзины
  updateCartDisplay();

  // Открытие/закрытие корзины
  if (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
  }

  if (dropdownContent) {
    dropdownContent.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }

  document.addEventListener('click', function () {
    if (dropdown) dropdown.classList.remove('open');
  });

  // Добавление товара в корзину
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.dataset.id;
      const name = this.dataset.name;
      const price = parseFloat(this.dataset.price);
      const img = this.dataset.img;
      const qtyInput = this.closest('.add-to-cart')?.querySelector('.product-qty');
      const qty = qtyInput ? parseInt(qtyInput.value) : 1;

      const existingIndex = cart.findIndex(item => item.id === id);
      
      if (existingIndex !== -1) {
        cart[existingIndex].qty += qty;
      } else {
        cart.push({ id, name, price, img, qty });
      }

      this.classList.add('added');
      setTimeout(() => this.classList.remove('added'), 500);

      updateCartDisplay();
    });
  });

  // Удаление товара
  if (cartList) {
    cartList.addEventListener('click', function (e) {
      const deleteBtn = e.target.closest('.delete');
      if (deleteBtn) {
        const index = parseInt(deleteBtn.dataset.index);
        if (!isNaN(index)) {
          const itemToRemove = deleteBtn.closest('.cart-item');
          if (itemToRemove) {
            itemToRemove.classList.add('removing');
            setTimeout(() => {
              cart.splice(index, 1);
              updateCartDisplay();
            }, 300);
          }
        }
      }
    });
  }

  // --- Products Slick ---
  if (typeof $ !== 'undefined') {
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

      $('#product-main-img .product-preview').zoom();
    }
  }

  // --- Input Number ---
  document.querySelectorAll('.input-number').forEach(el => {
    const input = el.querySelector('input[type="number"]');
    const up = el.querySelector('.qty-up');
    const down = el.querySelector('.qty-down');

    if (down) down.addEventListener('click', () => {
      let value = parseInt(input.value) - 1;
      input.value = value < 1 ? 1 : value;
      input.dispatchEvent(new Event('change'));
    });

    if (up) up.addEventListener('click', () => {
      input.value = parseInt(input.value) + 1;
      input.dispatchEvent(new Event('change'));
    });
  });

  // --- Price Slider ---
  const priceInputMax = document.getElementById('price-max');
  const priceInputMin = document.getElementById('price-min');
  const priceSlider = document.getElementById('price-slider');

  if (priceSlider && typeof noUiSlider !== 'undefined') {
    noUiSlider.create(priceSlider, {
      start: [1, 999],
      connect: true,
      step: 1,
      range: { min: 1, max: 999 }
    });

    priceSlider.noUiSlider.on('update', function (values, handle) {
      const value = values[handle];
      if (handle) {
        if (priceInputMax) priceInputMax.value = Math.round(value);
      } else {
        if (priceInputMin) priceInputMin.value = Math.round(value);
      }
    });
  }
});
