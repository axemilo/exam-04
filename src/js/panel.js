const adminPaneList = document.getElementById('admin-panel-list')
const adminPanelItemTemplate = document.getElementById('admin-panel-item-template').content

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

async function renderPanels(query, variables = {}) {
  adminPaneList.innerHTML = null
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

    const adminItemTitle = card.getElementById('admin-panel-item-list_text')
    const adminItemDeleteBtn = card.getElementById('admin-panel-item-list_btn-delete')

    adminItemTitle.textContent = foodName

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
    })
    adminPaneList.appendChild(card)
  })
}

renderPanels(getFoods)

// OXirgacha qilomadim, chunki vaqt yetmadi. Azgina vaqt boganda xammasini bitirardim:)
