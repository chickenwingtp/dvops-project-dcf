let currentView = "home"

function handleLocationChange() {
  currentView = window.location.hash.replace("#", "")

  document.querySelectorAll("main").forEach((el) => el.classList.add("hidden"))

  // Check if user is logged in
  const token = window.localStorage.getItem("authToken")

  if (currentView.length > 0) {
    const element = document.getElementById(`view-${currentView}`)
    element.classList.remove("hidden")

    if (token) {
      document.getElementById("profile-navigation").classList.remove("hidden")
      document.getElementById("balance-navigation").classList.remove("hidden")
      fetchUserBalance(token)
      fetchUserProfile(token)
    }
  } else {
    if (token) {
      window.location.hash = "game"
    } else {
      window.location.hash = "home"
    }
  }

  if (currentView !== "home" && currentView !== "game") {
    document.querySelector("#back-navigation").classList.remove("hidden")
  } else {
    document.querySelector("#back-navigation").classList.add("hidden")
  }

  if (currentView === "creditmachine") {
    document.getElementById("balance-navigation").classList.add("hidden")
  } else {
    document.getElementById("balance-navigation").classList.remove("hidden")
  }
}

function fetchUserBalance(token) {
  fetch("/user/balance", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        document.getElementById("user-balance").textContent = data.balance
      } else {
        console.log(data.error)
      }
    })
    .catch((error) => {
      console.error("Error fetching balance:", error)
    })
}

window.onload = () => {
  if ("onhashchange" in window) {
    window.addEventListener("hashchange", handleLocationChange)
  }

  handleLocationChange()

  document.getElementById("login-form").addEventListener("submit", (event) => {
    event.preventDefault()

    const email = document.getElementById("login-email").value
    const password = document.getElementById("login-password").value

    // Regular expression for a valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.")
      return false
    }

    // Password validation
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.")
      return false
    }

    // Regular expression to check for at least one uppercase letter, lowercase letter, digit, and special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      alert(
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      )
      return false
    }

    fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Login Success!")
          console.log(data.token)
          window.localStorage.setItem("authToken", data.token)
          document
            .getElementById("profile-navigation")
            .classList.remove("hidden")
          document
            .getElementById("balance-navigation")
            .classList.remove("hidden")
          fetchUserBalance(data.token)
          console.log(data.token)
          pushView("game")
        } else {
          console.log(data.error)
          alert("Error submitting form.")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("Error submitting form.")
      })
  })

  document
    .getElementById("register-form")
    .addEventListener("submit", (event) => {
      event.preventDefault()

      const username = document.getElementById("register-username").value
      const email = document.getElementById("register-email").value
      const password = document.getElementById("register-password").value
      const confirmPassword = document.getElementById(
        "register-confirm-password",
      ).value

      // Username validation: At least 3 characters and alphanumeric
      const usernameRegex = /^[a-zA-Z0-9]{3,}$/
      if (!usernameRegex.test(username)) {
        alert(
          "Username must be at least 3 characters long and contain only letters and numbers.",
        )
        return false
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.")
        return false
      }

      // Password length and complexity validation
      if (password.length < 8) {
        alert("Password must be at least 8 characters long.")
        return false
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      if (!passwordRegex.test(password)) {
        alert(
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
        )
        return false
      }

      // Confirm password validation
      if (password !== confirmPassword) {
        alert("Passwords do not match. Please re-enter.")
        return false
      }

      fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Account created! Please login.")
            pushView("login")
          } else {
            console.log(data.error)
            alert("Error submitting form")
          }
        })
        .catch((error) => {
          console.error("Error:", error)
          alert("Error submitting form.")
        })
    })
}

function pushView(name) {
  window.location.hash = name
}

function popView() {
  window.history.back()
}

const SECONDS = 1000
const LIVERELOAD_INTERVAL = 0.5 * SECONDS
const livereload = setInterval(() => {
  fetch("/livereload")
    .then((res) => res.json())
    .then((data) => {
      if (data.reload) {
        window.location.reload()
      }
    })
}, LIVERELOAD_INTERVAL)

function editProfile() {
  const usernameElement = document.getElementById("profile-username")
  const emailElement = document.getElementById("profile-email")

  const currentUsername = usernameElement.textContent
  const currentEmail = emailElement.textContent

  usernameElement.innerHTML = `<input type="text" id="edit-username" value="${currentUsername}" />`
  emailElement.innerHTML = `<input type="email" id="edit-email" value="${currentEmail}" />`

  const editButton = document.querySelector("#view-profile button")
  editButton.textContent = "Save"
  editButton.onclick = saveProfile
}

function saveProfile() {
  const newUsername = document.getElementById("edit-username").value
  const newEmail = document.getElementById("edit-email").value

  const token = window.localStorage.getItem("authToken")


  fetch("/user/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username: newUsername,
      email: newEmail,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        document.getElementById("profile-username").textContent = data.username
        document.getElementById("profile-email").textContent = data.email

        const editButton = document.querySelector("#view-profile button")
        editButton.textContent = "Edit"
        editButton.onclick = editProfile
      } else {
        console.log(data.error)
        alert("Error updating profile.")
      }
    })
    .catch((error) => {
      console.error("Error updating profile:", error)
      alert("Error updating profile.")
    })
}