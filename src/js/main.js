const mainListRestaurants = document.getElementById('main-list')

const mainItemTemplateRestaurants = document.getElementById(
  'main-item-template-restaurants'
).content

const getRestaurants = `
  query{
    restaurants{
      foodCategoryId
      restaurantId
      restaurantName
    }
  }
`

async function renderRestaurnats(query, variables = {}) {
  let response = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
  const { data } = await response.json()
  let restaurants = data.restaurants

  restaurants.forEach((item) => {
    const { restaurantId, restaurantName, foodCategoryId } = item
    const card = mainItemTemplateRestaurants.cloneNode(true)

    const mainItemFoods = card.getElementById('main-item-restaurant')
    const mainItemFoodsText = card.getElementById('main-item-restaurant-text')
    const mainItemLink = card.getElementById('main-item-restaurant-link')

    mainItemFoods.dataset.category_id = foodCategoryId
    CATEGORY_ID = foodCategoryId
    mainItemFoodsText.textContent = restaurantName
    mainListRestaurants.appendChild(card)

    mainItemLink.addEventListener('click', (e) => {
      localStorage.clear()
      localStorage.setItem('foodCategoryId', mainItemFoods.dataset.category_id)
    })
  })
}

renderRestaurnats(getRestaurants)
