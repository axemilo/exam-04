const createFormFoods = document.getElementById('create-food-form')

const createFormFoodsName = document.getElementById('create-food-form-name')
const createFormFoodsDescription = document.getElementById('create-food-form-description')
const createFormFoodsPrice = document.getElementById('create-food-form-price')
const createFormFoodsCategory = document.getElementById('create-food-form-categories')
const createFormFoodsImg = document.getElementById('create-food-form-img')

const createFoodQuery = `
mutation CreateFood($foodName: String!, $price: Int!, $description: String!, $foodCategoryId: Int!, $foodImg: Upload) {
  createFood(foodName: $foodName, price: $price, description: $description, foodCategoryId: $foodCategoryId, foodImg: $foodImg) {
    data
    message
  }
}
`

createFormFoods.addEventListener('submit', async (evt) => {
  evt.preventDefault()
  const formData = new FormData(createFormFoods)

  formData.append('foodName', createFormFoodsName.value)
  formData.append('description', createFormFoodsDescription.value)
  formData.append('price', createFormFoodsPrice.value - 0)
  formData.append('foodCategoryId', createFormFoodsCategory.value - 0)
  formData.append('foodImg', createFormFoodsImg.files[0])

  console.log(createFormFoodsImg.files[0])

  let response = await fetch('http://localhost:4000/graphql', {
    method: createFormFoods.method,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: {
      query: createFoodQuery,
      variables: formData,
    },
  })
  let data = await response.json()
  console.log(data)
})
