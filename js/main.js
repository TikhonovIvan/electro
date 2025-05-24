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

  // Загрузка корзины из localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Сохранение корзины в localStorage
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Обновление отображения корзины
  function updateCartDisplay() {
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

    // Мгновенное обновление всех счетчиков
    updateCartCounters(totalQty, totalPrice);
    saveCart();
  }

  // Функция для мгновенного обновления счетчиков
  function updateCartCounters(totalQty, totalPrice) {
    cartTotalQty.textContent = totalQty;
    cartItemCount.textContent = cart.length; // Количество уникальных товаров
    cartTotalPrice.textContent = totalPrice;
    
    // Обновление иконки корзины в шапке
    const cartIcons = document.querySelectorAll('.cart-icon, .dropdown-toggle');
    cartIcons.forEach(icon => {
      const counter = icon.querySelector('.qty, #cart-total-qty');
      if (counter) {
        counter.textContent = cart.length;
      }
    });
  }

  // Инициализация корзины
  updateCartDisplay();

  // Обработчики открытия/закрытия корзины
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

      // Мгновенное обновление
      const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
      const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      updateCartCounters(totalQty, totalPrice);
      
      // Полное обновление отображения
      setTimeout(updateCartDisplay, 0);
    });
  });

  // Удаление товара из корзины с анимацией
  cartList.addEventListener('click', function (e) {
    const deleteBtn = e.target.closest('.delete');
    if (deleteBtn) {
      const index = parseInt(deleteBtn.dataset.index);
      if (!isNaN(index)) {
        // Анимация удаления
        const itemToRemove = deleteBtn.closest('.cart-item');
        itemToRemove.classList.add('removing');
        
        // Мгновенное обновление данных
        const removedQty = cart[index].qty;
        const removedPrice = cart[index].price * cart[index].qty;
        cart.splice(index, 1);
        
        // Мгновенное обновление счетчиков
        const totalQty = parseInt(cartTotalQty.textContent) - removedQty;
        const totalPrice = parseInt(cartTotalPrice.textContent) - removedPrice;
        updateCartCounters(totalQty, totalPrice);
        
        // Полное обновление после анимации
        setTimeout(() => {
          updateCartDisplay();
          saveCart();
        }, 300);
      }
    }
  });

  
  // --- Остальной код (слайдеры и прочее) ---
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

  // Обработчики количества товаров
  document.querySelectorAll('.input-number').forEach(el => {
    const input = el.querySelector('input[type="number"]');
    const up = el.querySelector('.qty-up');
    const down = el.querySelector('.qty-down');

    down.addEventListener('click', () => {
      let value = parseInt(input.value) - 1;
      input.value = value < 1 ? 1 : value;
      input.dispatchEvent(new Event('change'));
    });

    up.addEventListener('click', () => {
      input.value = parseInt(input.value) + 1;
      input.dispatchEvent(new Event('change'));
    });
  });

  // Фильтр по цене
  const priceInputMax = document.getElementById('price-max');
  const priceInputMin = document.getElementById('price-min');
  const priceSlider = document.getElementById('price-slider');

  if (priceSlider) {
    noUiSlider.create(priceSlider, {
      start: [1, 999],
      connect: true,
      step: 1,
      range: { min: 1, max: 999 }
    });

    priceSlider.noUiSlider.on('update', function (values, handle) {
      const value = values[handle];
      if (handle) {
        priceInputMax.value = Math.round(value);
      } else {
        priceInputMin.value = Math.round(value);
      }
    });
  }
});