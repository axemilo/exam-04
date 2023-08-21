const LINK = 'http://localhost:4000'

const mainItemTemplateFoods = document.getElementById('main-item-template-foods').content
const mainListFoods = document.getElementById('main-list-foods')
const korzinaItem = document.getElementById('korzina-item')
const korzinaItemContent = window.getComputedStyle(korzinaItem, '::before')
korzinaItem.setAttribute('data-before', 0)

let count = 0
const getFoods = `
  query{
    foods{
      foodId
      foodName
      foodImg
      price
      description
      foodCategoryId
    }
  }
`

const createOrder = `
mutation CreateOrder($userId: Int!, $foodId: Int!, $count: Int!) {
  createOrder(userId: $userId, foodId: $foodId, count: $count) {
    data
    message
    token
  }
}
`

const updateOrder = `
mutation UpdateOrder($orderId: Int!, $count: Int) {
  updateOrder(orderId: $orderId, count: $count) {
    data
    message
  }
}`

const getOrders = async () => {
  const orderQuery = `
  query Query {
    orders {
      orderId
      foodId
      userId
      count
    }
  }`
  let response = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: orderQuery,
      variables: {},
    }),
  })
  const { data } = await response.json()
  let orders = data.orders
  return orders
}

async function renderFoods(query, variables = {}) {
  mainListFoods.innerHTML = null
  let response = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
  const { data } = await response.json()
  let foods = data.foods
  const localFoodCategoryId = localStorage.getItem('foodCategoryId')
  foods = foods.filter((item) => item.foodCategoryId == localFoodCategoryId)

  const orders = await getOrders()
  console.log(orders)
  foods.forEach((item) => {
    const { foodId, foodName, foodImg, price, description, foodCategoryId } = item
    const card = mainItemTemplateFoods.cloneNode(true)

    const mainItemFoodsTitle = card.getElementById('main-item-foods-title')
    const mainItemFoodsPrice = card.getElementById('main-item-foods-price')
    const mainItemFoodsImage = card.getElementById('main-item-foods-img')
    const mainItemFoodsBtn = card.getElementById('main-item-foods-btn')
    const mainItemFoodsDescription = card.getElementById('main-item-foods-description')
    const mainItemFoodsCount = card.getElementById('main-item-foods-count')

    mainItemFoodsBtn.dataset.food_id = foodId

    let token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')

    const userOrder = orders.filter((item) => item.userId == userId && item.foodId)

    if (token) {
      mainItemFoodsBtn.classList.remove('unsignedUp')
      mainItemFoodsBtn.classList.add('signedUp')
    }

    mainItemFoodsTitle.textContent = foodName
    mainItemFoodsPrice.textContent = 'Price: ' + price + '$'
    mainItemFoodsDescription.textContent = description
    mainItemFoodsImage.src = `${LINK}/images/` + foodImg
    mainItemFoodsCount.textContent = 'Count: ' + count

    korzinaItem.setAttribute('data-before', userOrder.length)
    mainItemFoodsBtn.addEventListener('click', async (e) => {
      if (mainItemFoodsBtn.classList.contains('unsignedUp'))
        alert('you need to Sing Up to buy this food!')
      else alert('the food ordered!')
      if (!(count == 0)) {
        let responseOrder = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: updateOrder,
            variables: {
              orderId: foodId - 0,
              count: count + 1,
            },
          }),
        })
      } else {
        let responseOrder = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: createOrder,
            variables: {
              foodId: foodId - 0,
              userId: userId - 0,
              count: count + 1,
            },
          }),
        })
        const orderData = await responseOrder.json()
        mainItemFoodsBtn.dataset.order_id = await orderData.data.createOrder.data.order_id
      }
      renderFoods(getFoods)
    })

    mainListFoods.appendChild(card)
  })
}

renderFoods(getFoods)
