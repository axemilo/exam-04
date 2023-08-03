const formSignup = document.getElementById('form-signup')

const formSignupUsername = document.getElementById('form-signup-username')
const formSignupPassword = document.getElementById('form-signup-password')
const formSignupEmail = document.getElementById('form-signup-email')
const formSignupBalance = document.getElementById('form-signup-balance')

const createUser = `
mutation Mutation($username: String!, $password: String!, $email: String!, $balance: Int!) {
  createUser(username: $username, password: $password, email: $email, balance: $balance) {
    data
    message
    token
  }
}
`
async function handleAddUser(evt) {
  let variables = {
    username: formSignupUsername.value,
    password: formSignupPassword.value,
    email: formSignupEmail.value,
    balance: formSignupBalance.value - 0,
  }
  evt.preventDefault()

  console.log(variables)
  let response = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: createUser,
      variables,
    }),
  })
  let { data } = await response.json()
  if (data) {
    window.location.replace('../pages/restaurant.html')
    localStorage.setItem('token', data.createUser.token)
  } else {
    alert('something wrong. Try AGAIN!')
  }
}

formSignup.addEventListener('submit', handleAddUser)
