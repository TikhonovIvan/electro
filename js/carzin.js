
  // Переменные для хранения корзины
  let cart = {};
  let totalQty = 0;
  let totalPrice = 0;

  // При нажатии на кнопку "В карзину"
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => {
      const name = button.dataset.name;
      const price = parseFloat(button.dataset.price);
      const img = button.dataset.img;

      // Увеличиваем количество
      if (cart[name]) {
        cart[name].qty += 1;
      } else {
        cart[name] = {
          name: name,
          price: price,
          img: img,
          qty: 1
        };
      }

      // Обновляем отображение
      updateCartDisplay();
    });
  });

  function updateCartDisplay() {
    const qtySpans = document.querySelectorAll('.cart-dropdown-wrapper .qty');
    const cartList = document.querySelector('.cart-list');
    const summary = document.querySelector('.cart-summary');

    cartList.innerHTML = '';
    totalQty = 0;
    totalPrice = 0;

    for (let name in cart) {
      const item = cart[name];
      totalQty += item.qty;
      totalPrice += item.qty * item.price;

      cartList.innerHTML += `
        <div class="product-widget">
          <div class="product-img">
            <img src="${item.img}" alt="">
          </div>
          <div class="product-body">
            <h3 class="product-name"><a href="#">${item.name}</a></h3>
            <h4 class="product-price"><span class="qty">${item.qty}x</span>${item.price} сом</h4>
          </div>
        </div>
      `;
    }

    // Обновляем все счетчики .qty
    qtySpans.forEach(span => span.textContent = totalQty);
    summary.innerHTML = `<small>Выбрано ${Object.keys(cart).length} элемента</small><h5>Итог: ${totalPrice} сом</h5>`;
  }

