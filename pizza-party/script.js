// pizza ordering application

// global objects
const Order = {
  customer: {
    firstName: null,
    lastName: null,
    phone: null,
    streetAddress: null,
    city: null,
    zipCode: null
  },
  pizzas: [],
}

const Toppings = {
  bacon: 1.50,
  tuna: 1.50,
  sausage: 1.50,
  pepperoni: 1.50,
  chicken: 1.50,
  onions: .50,
  peppers: .50,
  mushrooms: .50,
  jalapeños: .50,
  pineapple: .50
}

const Sizes = {
  small: 12.99,
  medium: 16.99,
  large: 19.99
}

function Pizza(
  size = null,
  toppings = null,
  instructions = null,
  subtotal = null
) {
  this.size = size;
  this.toppings = toppings;
  this.instructions = instructions;
  this.subtotal = subtotal;
}


// ~~~~~~pizza size~~~~~~
window.addEventListener('load', function () {
  const sizeInputs = this.document.querySelectorAll('.size-container  input');

  sizeInputs.forEach(function (sizeInput) {
    const labelText = this.document.querySelector(`label[for='${sizeInput.id}']`).innerText;
    const size = labelText.split(' ')[0];

    sizeInput.addEventListener('input', function () {
      selectPizzaSize(size);
      clearToppingsOnSizeChange();
    });
  })
});

function selectPizzaSize(size) {
  const pizzaSizeDescription = document.getElementById('pizzaSizeDescription');
  const sizePriceOutput = document.getElementById('sizePrice');
  const sizePrice = Sizes[size.toLowerCase()];

  pizzaSizeDescription.innerText = `${size} Pizza`;
  sizePriceOutput.innerText = `$${sizePrice}`;

  getCurrentPizzaSubtotal();
}

function clearToppingsOnSizeChange() {
  const currentToppingsContainer = document.getElementById('currentToppingsContainer');
  const children = currentToppingsContainer.children;
  if (currentToppingsContainer.hasChildNodes() == true) {
    for (let i = children.length - 1; i >= 0; i--) {
      children[i].remove();
    }
    const toppingInputs = this.document.querySelectorAll('.toppings-container > div > input');
    for (let topping of toppingInputs) {
      topping.checked = false;
    }
  }
  getCurrentPizzaSubtotal();
}


// ~~~~~~toppings~~~~~~
window.addEventListener('load', function () {
  const toppingInputs = document.querySelectorAll('.toppings-container > div input');

  toppingInputs.forEach(function (toppingInput) {
    const topping = document.querySelector(`label[for='${toppingInput.id}']`).innerText;

    toppingInput.addEventListener('input', function () {
      if (checkSizeIsEnteredFirst() == false) {
        const message = 'It looks like you tried to add toppings before selecting a size first.'
        displayPizzaError(message);
        resetCurrentPizza();
      } else {
        addTopping(toppingInput, topping);
        removeTopping(toppingInput, topping);
        getCurrentPizzaSubtotal();
      }
    });
  });
});

function addTopping(toppingInput, topping) {
  if (toppingInput.checked == true) {
    const currentToppingsContainer = document.getElementById('currentToppingsContainer');
    const container = document.createElement('div');
    const descriptionOutput = document.createElement('p');
    const priceOutput = document.createElement('p');
    let toppingPriceAdjuster = checkToppingPrice();
    const price = (Toppings[topping.toLowerCase()] + toppingPriceAdjuster);

    container.id = `${topping.toLowerCase()}CurrentContainer`;
    descriptionOutput.innerText = `${topping}`;
    priceOutput.innerText = `+ $${price.toFixed(2)}`;

    container.appendChild(descriptionOutput);
    container.appendChild(priceOutput);
    currentToppingsContainer.appendChild(container);
  }
}

// check pizza size for corresponding topping price
function checkToppingPrice() {
  const medium = document.getElementById('mediumPizza');
  const large = document.getElementById('largePizza');
  let toppingPriceAdjuster = 0;

  if (medium.checked == true) {
    toppingPriceAdjuster = .3;
  } else if (large.checked == true) {
    toppingPriceAdjuster = .6;
  }
  return toppingPriceAdjuster;
}

function removeTopping(toppingInput, topping) {
  const toppingContainer = document.getElementById(`${topping.toLowerCase()}CurrentContainer`);
  if (toppingContainer) {
    if (toppingInput.checked != true) {
      toppingContainer.remove();
    }
  }
}

// ~~~~~~current pizza price output~~~~~~
function getCurrentPizzaSubtotal() {
  const subtotalOutput = document.getElementById('currentSubtotal');
  const size = getCurrentSizePrice();
  const toppings = getToppingsTotalPrice();
  const subtotal = size + toppings;

  subtotalOutput.innerText = `$${subtotal.toFixed(2)}`;
}

function getCurrentSizePrice() {
  const sizeInputs = document.querySelectorAll('.size-container input');
  let sizePrice;

  sizeInputs.forEach(function (sizeInput) {
    const labelText = document.querySelector(`label[for='${sizeInput.id}']`).innerText;
    const size = labelText.split(' ')[0].toLowerCase();

    if (sizeInput.checked == true) {
      sizePrice = Sizes[size];
    }
  });
  return sizePrice;
}

function getToppingsTotalPrice() {
  const toppingsInputs = document.querySelectorAll('.toppings-container > div > input');
  let toppingsTotal = 0;
  let toppingPriceAdjuster = checkToppingPrice();

  toppingsInputs.forEach(function (toppingInput) {
    if (toppingInput.checked == true) {
      const topping = document.querySelector(`label[for='${toppingInput.id}']`).innerText.toLowerCase();;
      toppingsTotal += (Toppings[topping] + toppingPriceAdjuster);
    }
  });
  return toppingsTotal;
}


// ~~~~~~add pizza to order~~~~~~
window.addEventListener('load', function () {
  const addPizzaButton = document.getElementById('addPizzaButton');
  addPizzaButton.addEventListener('click', () => {
    if (checkSizeIsEnteredFirst() == false) {
      const errorMessage = 'There is no pizza to add to the order. Please create a pizza first.'
      displayPizzaError(errorMessage);
    } else {
      updatePizzaAndOrderObjects();
      resetCurrentPizza();
      getOrderSubtotal();
    };
  })
});

// object info
function updatePizzaAndOrderObjects() {
  window.event.preventDefault();
  const sizeInputs = document.querySelectorAll('.size-container input');
  const toppingInputs = document.querySelectorAll('.toppings-container input');
  const instructions = document.getElementById('pizzaInstructions').value;
  const subtotal = parseFloat(document.getElementById('currentSubtotal').innerText.split('$')[1]);
  let size;
  let toppingsArray = [];

  sizeInputs.forEach(function (sizeInput) {
    if (sizeInput.checked == true) {
      const labelText = document.querySelector(`label[for='${sizeInput.id}']`).innerText;
      size = labelText.split(' ')[0].toLowerCase();
    }
  });
  toppingInputs.forEach(function (toppingInput) {
    const topping = document.querySelector(`label[for='${toppingInput.id}']`).innerText;
    if (toppingInput.checked == true) {
      toppingsArray.push(topping);
    }
  });
  const pizzaObject = new Pizza(size, toppingsArray, instructions, subtotal);
  Order.pizzas.push(pizzaObject);

  outputPizzaToOrderTotal(pizzaObject);
}

// output
function outputPizzaToOrderTotal(pizza) {
  const container = document.getElementById('orderSubtotalPizzasContainer')
  const header = document.createElement('div');
  const pizzaSize = document.createElement('p');
  const sizeCapitalized = pizza.size[0].toUpperCase() + pizza.size.slice(1);
  const subtotal = document.createElement('p');
  const toppingsList = outputToppings(pizza);

  if (pizza.instructions != '') {
    const instructions = outputInstructions(pizza, 'li');
    toppingsList.appendChild(instructions);
  }

  pizzaSize.innerText = `1 ${sizeCapitalized} Pizza`;
  subtotal.innerText = `$${pizza.subtotal}`;

  header.appendChild(pizzaSize);
  header.appendChild(subtotal);
  container.appendChild(header);
  container.appendChild(toppingsList);
}

function outputToppings(pizza) {
  const toppingsArray = pizza.toppings;
  const list = document.createElement('ul');
  toppingsArray.forEach(function (topping) {
    const li = document.createElement('li');
    li.innerText = topping;
    list.appendChild(li);
  });
  return list;
}

function outputInstructions(pizza, element) {
  const output = document.createElement(element);
  output.innerText = `Instructions: ${pizza.instructions}`;
  return output;
}

function getOrderSubtotal() {
  const pizzasArray = Order.pizzas;
  const output = document.getElementById('orderSubtotal');
  let orderSubtotal = 0;
  pizzasArray.forEach(function (pizza) {
    orderSubtotal = orderSubtotal + pizza.subtotal;
  });

  output.innerText = `$${orderSubtotal.toFixed(2)}`;
}

// reset pizza builder form
function resetCurrentPizza() {
  const size = document.querySelectorAll('#currentPizzaContainer > div:first-of-type p');
  const toppingsContainer = document.getElementById('currentToppingsContainer');
  const subtotal = document.getElementById('currentSubtotal');
  const inputs = document.querySelectorAll('.left-pizza-form-container input');
  const instructions = document.getElementById('pizzaInstructions');

  size.forEach(function (element) {
    element.innerText = '';
  });

  toppingsContainer.innerHTML = '';
  subtotal.innerHTML = '$0.00';

  inputs.forEach(function (input) {
    input.checked = false;
  });

  instructions.value = '';
}

// ~~~~~~go to checkout/place order~~~~~~
window.addEventListener('load', function () {
  const checkoutButton = this.document.getElementById('checkoutButton');
  checkoutButton.addEventListener('click', () => {
    if (Order.pizzas.length == 0) {
      const message = 'Your order does not currently contain any pizzas. Please order at least one pizza to continue to checkout.'
      displayPizzaError(message);
    } else {
      outputOrderSubotalToCheckout();
      calculateTotal();
      checkoutDisplay();
    }

    const submitOrderButton = this.document.getElementById('submitOrderButton');
    submitOrderButton.addEventListener('click', addUserObjectValues);
    submitOrderButton.addEventListener('click', submitOrder);
    submitOrderButton.addEventListener('click', displayConfirmation);
  });
})

// change display
function checkoutDisplay() {
  const orderPage = document.getElementById('orderDisplay');
  const checkoutPage = document.getElementById('checkoutDisplay');

  orderPage.style.display = 'none';
  checkoutPage.style.display = 'block';
}

// update object
function addUserObjectValues(e) {
  e.preventDefault();
  Order.customer.firstName = document.getElementById('firstName').value;
  Order.customer.lastName = document.getElementById('lastName').value;
  Order.customer.phone = document.getElementById('phone').value;
  Order.customer.streetAddress = document.getElementById('streetAddress').value;
  Order.customer.city = document.getElementById('city').value;
  Order.customer.zipCode = document.getElementById('zipCode').value;
}

// output
function outputOrderSubotalToCheckout() {
  const pizzaArray = Order.pizzas;

  pizzaArray.forEach(function (pizza) {
    const summaryContainer = document.getElementById('summaryPizzasContainer');
    const header = document.createElement('div');
    const descriptionOutput = document.createElement('p');
    const pizzaTotalOutput = document.createElement('p');
    const list = document.createElement('ul');
    const sizeCapitalized = pizza.size[0].toUpperCase() + pizza.size.slice(1);

    for (let topping of pizza.toppings) {
      const li = document.createElement('li');
      li.innerText = topping;
      list.appendChild(li);
    }

    if (pizza.instructions != '') {
      let instructions = outputInstructions(pizza, 'li');
      list.appendChild(instructions);
    }

    descriptionOutput.innerText = `1 ${sizeCapitalized} Pizza`;
    pizzaTotalOutput.innerText = `$${pizza.subtotal}`;

    header.appendChild(descriptionOutput);
    header.appendChild(pizzaTotalOutput);
    summaryContainer.appendChild(header);
    summaryContainer.appendChild(list);
  })
}

function calculateTotal() {
  const subtotalOutput = document.getElementById('summarySubtotal');
  const subtotal = parseFloat(document.getElementById('orderSubtotal').innerText.split('$')[1]);
  const taxOutput = document.getElementById('tax');
  const tax = (subtotal / 10);
  const totalOutput = document.getElementById('orderTotal');
  const total = (subtotal + tax);

  subtotalOutput.innerText = `$${subtotal}`;
  taxOutput.innerText = `$${tax.toFixed(2)}`;
  totalOutput.innerText = `$${total.toFixed(2)}`;
}

// send form data
function submitOrder() {
  const data = JSON.stringify(Order, null, 2);

  let request = new XMLHttpRequest();
  request.open('POST', 'https://jsonplaceholder.typicode.com/users');
  request.setRequestHeader("Content-Type", "application/json");
  request.onload = function () {
    console.log(request.status);
    console.log(request.responseText);
  }

  request.send(data);
}

// order confirmation
function displayConfirmation() {
  const summary = document.getElementById('orderSummary');
  const form = document.getElementById('deliveryFormContainer');
  const submittedContainer = document.getElementById('submittedContainer');

  summary.style.display = 'none';
  form.style.display = 'none';
  submittedContainer.style.display = 'block';
}


// ~~~~~~validation~~~~~~
window.addEventListener('load', function () {
  const pizzaErrorButton = document.getElementById('pizzaErrorButton');
  const checkoutInputs = document.querySelectorAll('#deliveryForm input');
  const submitButton = document.getElementById('submitOrderButton');
  submitButton.disabled = true;

  pizzaErrorButton.addEventListener('click', () => {
    const popup = document.getElementById('pizzaErrorMessage');
    popup.style.display = 'none';
    resetCurrentPizza();
  })

  checkoutInputs.forEach(function (input) {
    input.addEventListener('focus', function () {
      checkUserInfoInputs(input);
      enableSubmitOrderButton(checkoutInputs, input, submitButton);
    });

    input.addEventListener('input', function () {
      checkUserInfoInputs(input);
      enableSubmitOrderButton(checkoutInputs, input, submitButton);
    });
  });
});

// size before toppings
function checkSizeIsEnteredFirst() {
  const sizeInputs = document.querySelectorAll('.size-container input');
  let isSelected;
  let isChecked = false;
  sizeInputs.forEach(function (input) {
    if (input.checked == true) {
      isChecked = true;
    }
  });
  return isChecked;
}

// user info form inputs
function checkUserInfoInputs(input) {
  if (input.checkValidity() == false) {
    if (input.id == 'phone') {
      const message = `${input.validationMessage} <br> xxx-xxx-xxxx`;
      displayCheckoutError(message);
    } else {
      displayCheckoutError(input.validationMessage);
    }
  } else {
    document.getElementById('checkoutErrorMessage').style.display = 'none';;
  }
}

function enableSubmitOrderButton(inputs, input, button) {
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].checkValidity() == false) {
      return button.disabled = true;
    }
  }
  button.disabled = false;
}

// display error messages
function displayPizzaError(text) {
  const popup = document.getElementById('pizzaErrorMessage');
  const errorMessage = document.getElementById('pizzaErrorResponse');

  errorMessage.innerText = text;
  popup.style.display = 'block';
}

function displayCheckoutError(text) {
  const popup = document.getElementById('checkoutErrorMessage');
  const errorMessage = document.getElementById('checkoutErrorResponse');

  errorMessage.innerHTML = text;
  popup.style.display = 'block';

}


// ~~~~~~styles~~~~~~
window.addEventListener('load', function () {
  const checkoutInputs = this.document.querySelectorAll('#deliveryForm input');
  const orderCollapseButton = document.getElementById('orderCollapseButton');


  checkoutInputs.forEach(function (input) {
    const placeholderAttribute = input.getAttribute('placeholder');
    input.addEventListener('focus', () => input.setAttribute('placeholder', ''));
  })

  orderCollapseButton.addEventListener('click', function () {
    toggleOrderTab(orderCollapseButton);
  });
})

let collapsed = true;
// collapsible order tab
function toggleOrderTab(button) {
  const subtotalCheckoutContainer = document.getElementById('subtotalCheckoutContainer');
  const width = subtotalCheckoutContainer.offsetWidth + 20;

  if (collapsed == true) {
    subtotalCheckoutContainer.style.right = '0';
    button.style.right = `300px`;
    collapsed = false;
  } else {
    subtotalCheckoutContainer.style.right = '-300px';
    button.style.right = '0';
    collapsed = true;
  }

  return collapsed;
}




















