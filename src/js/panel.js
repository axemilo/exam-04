// Template for using
const adminPanelItemTemplate = document.getElementById('admin-panel-item-template').content

// Lists
const adminPaneListFoods = document.getElementById('admin-panel-list-foods')
const adminPaneListRestaurants = document.getElementById('admin-panel-list-restaurants')

// Create Buttons LINK
const btnCreateFoods = document.getElementById('btn-create-foods')

// Queries
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

const deleteFood = `
mutation Mutation($foodId: Int!) {
  deleteFood(foodId: $foodId) {
    data
    message
  }
}
`

const getRestaurants = `
  query{
    restaurants{
      foodCategoryId
      restaurantId
      restaurantName
    }
  }
`

const deleteRestaurants = `
mutation Mutation($restaurantId: Int!) {
  deleteRestaurants(restaurantId: $restaurantId) {
    data
    message
  }
}
`
// Render Restaurants
async function renderPanelRestaurants(query, variables = {}) {
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
    const card = adminPanelItemTemplate.cloneNode(true)

    const adminItemText = card.getElementById('admin-panel-item-list_text')
    const adminItemDeleteBtn = card.getElementById('admin-panel-item-list_btn-delete')

    adminItemText.textContent = restaurantName
    adminPaneListRestaurants.appendChild(card)

    adminItemDeleteBtn.addEventListener('click', async (evt) => {
      evt.preventDefault()
      let response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: deleteRestaurants,
          variables: { restaurantId },
        }),
      })
      const { data } = await response.json()
      console.log(data)
      renderPanelFoods(getFoods)
    })
  })
}

// Render Foods
async function renderPanelFoods(query, variables = {}) {
  adminPaneListFoods.innerHTML = null
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

  foods.forEach((item) => {
    console.log(item)
    const { foodId, foodName, foodImg, price, description, foodCategoryId } = item

    const card = adminPanelItemTemplate.cloneNode(true)

    const adminItemText = card.getElementById('admin-panel-item-list_text')
    const adminItemDeleteBtn = card.getElementById('admin-panel-item-list_btn-delete')

    adminItemText.textContent = foodName

    adminPaneListFoods.appendChild(card)

    adminItemDeleteBtn.addEventListener('click', async (evt) => {
      evt.preventDefault()
      let response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: deleteFood,
          variables: { foodId },
        }),
      })
      const { data } = await response.json()
      console.log(data)
      renderPanelFoods(getFoods)
    })
  })
}

renderPanelFoods(getFoods)
renderPanelRestaurants(getRestaurants)

// Create Foods

btnCreateFoods.addEventListener('click', (evt) => {
  evt.preventDefault()
  window.location.replace('../pages/createFood.html')
})
