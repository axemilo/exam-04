const formLogin = document.getElementById('form-login')

const formLoginUsername = document.getElementById('form-login-admin-name')
const formLoginPassword = document.getElementById('form-login-password')

const createAdmin = `
mutation Mutation($adminName: String!, $password: String!) {
  login(adminName: $adminName, password: $password) {
    data
    message
    token
  }
}
`

let token = localStorage.getItem('token')
if (token) {
  window.location.replace('../pages/panel.html')
}

async function handleAddAdmin(evt) {
  evt.preventDefault()

  let variables = {
    adminName: formLoginUsername.value,
    password: formLoginPassword.value,
  }

  console.log(variables)
  let response = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: createAdmin,
      variables,
    }),
  })
  let { data } = await response.json()
  console.log(data)
  if (data) {
    localStorage.setItem('token', data.login.token)
    window.location.replace('../pages/panel.html')
  } else {
    alert('something wrong. Try AGAIN!')
  }
}

formLogin.addEventListener('submit', handleAddAdmin)
