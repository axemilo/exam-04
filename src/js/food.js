const LINK = 'http://localhost:4000'

const mainItemTemplateFoods = document.getElementById('main-item-template-foods').content
const mainListFoods = document.getElementById('main-list-foods')

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
  mutation{
    orders{
      userId
      FoodId
      count
    }
  }
`

async function renderFoods(query, variables = {}) {
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

  console.log(localFoodCategoryId)
  foods = foods.filter((item) => item.foodCategoryId == localFoodCategoryId)
  console.log(foods)
  foods.forEach((item) => {
    const { foodId, foodName, foodImg, price, description, foodCategoryId } = item

    const card = mainItemTemplateFoods.cloneNode(true)

    const mainItemFoodsTitle = card.getElementById('main-item-foods-title')
    const mainItemFoodsPrice = card.getElementById('main-item-foods-price')
    const mainItemFoodsImage = card.getElementById('main-item-foods-img')
    const mainItemFoodsBtn = card.getElementById('main-item-foods-btn')
    const mainItemFoodsDescription = card.getElementById('main-item-foods-description')

    mainItemFoodsBtn.dataset.food_id = foodId

    let token = localStorage.getItem('token')

    if (token) {
      mainItemFoodsBtn.classList.remove('unsignedUp')
      mainItemFoodsBtn.classList.add('signedUp')
    }

    mainItemFoodsTitle.textContent = foodName
    mainItemFoodsPrice.textContent = 'Price: ' + price + '$'
    mainItemFoodsDescription.textContent = description
    mainItemFoodsImage.src = `${LINK}/images/` + foodImg

    mainItemFoodsBtn.addEventListener('click', async (e) => {
      if (mainItemFoodsBtn.classList.contains('unsignedUp'))
        alert('you need to Sing Up to buy this food!')
      else alert('the food ordered!')

      let response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          variables,
        }),
      })
    })
    mainListFoods.appendChild(card)
  })
}

renderFoods(getFoods)
