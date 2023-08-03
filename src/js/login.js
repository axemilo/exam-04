const formLogin = document.getElementById('form-login')

const formLoginUsername = document.getElementById('form-login-admin-name')
const formLoginPassword = document.getElementById('form-login-password')

const createAdmin = `
mutation Mutation($adminName: String!, $password: String!) {
  register(adminName: $adminName, password: $password) {
    data
    message
    token
  }
}
`
async function handleAddAdmin(evt) {
  let variables = {
    adminName: formLoginUsername.value,
    password: formLoginPassword.value,
  }
  evt.preventDefault()

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
    window.location.replace('../pages/panel.html')
    localStorage.setItem('token', data.register.token)
  } else {
    alert('something wrong. Try AGAIN!')
  }
}

formLogin.addEventListener('submit', handleAddAdmin)
