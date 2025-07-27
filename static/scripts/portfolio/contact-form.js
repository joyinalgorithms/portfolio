// Contact form functionality with API integration
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm")
  const submitBtn = document.getElementById("submitBtn")
  const formMessage = document.getElementById("formMessage")

  if (!contactForm) return

  // Form submission handler
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Get form data
    const formData = new FormData(contactForm)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    }

    // Validate form data
    if (!validateForm(data)) {
      showMessage("Please fill in all required fields.", "error")
      return
    }

    // Show loading state
    setLoadingState(true)

    try {
      // Send form data to API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        showMessage("Thank you for your message! I'll get back to you soon.", "success")
        contactForm.reset()
      } else {
        throw new Error(result.message || "Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      showMessage("Sorry, there was an error sending your message. Please try again or email me directly.", "error")
    } finally {
      setLoadingState(false)
    }
  })

  // Form validation
  function validateForm(data) {
    return data.name && data.email && data.subject && data.message && isValidEmail(data.email)
  }

  // Email validation
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Show loading state
  function setLoadingState(loading) {
    const btnText = submitBtn.querySelector("span")
    const btnIcon = submitBtn.querySelector("i")

    if (loading) {
      submitBtn.disabled = true
      submitBtn.classList.add("loading")
      btnText.textContent = "Sending..."
      btnIcon.className = "fas fa-spinner"
    } else {
      submitBtn.disabled = false
      submitBtn.classList.remove("loading")
      btnText.textContent = "Send Message"
      btnIcon.className = "fas fa-paper-plane"
    }
  }

  // Show form message
  function showMessage(message, type) {
    formMessage.textContent = message
    formMessage.className = `form-message ${type}`
    formMessage.style.display = "block"

    // Hide message after 5 seconds
    setTimeout(() => {
      formMessage.style.display = "none"
    }, 5000)
  }

  // Real-time form validation
  const inputs = contactForm.querySelectorAll("input, select, textarea")
  inputs.forEach((input) => {
    input.addEventListener("blur", () => {
      validateField(input)
    })
  })

  // Individual field validation
  function validateField(field) {
    const value = field.value.trim()
    let isValid = true

    // Remove existing error styling
    field.style.borderColor = ""

    if (field.hasAttribute("required") && !value) {
      isValid = false
    } else if (field.type === "email" && value && !isValidEmail(value)) {
      isValid = false
    }

    // Add error styling if invalid
    if (!isValid) {
      field.style.borderColor = "#ff6b6b"
    } else {
      field.style.borderColor = "#00ff88"
    }

    return isValid
  }

  // Character counter for message field
  const messageField = document.getElementById("message")
  if (messageField) {
    const maxLength = 1000
    const counter = document.createElement("div")
    counter.className = "char-counter"
    counter.style.cssText = `
            text-align: right;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.6);
            margin-top: 5px;
        `

    messageField.parentNode.appendChild(counter)

    messageField.addEventListener("input", () => {
      const remaining = maxLength - messageField.value.length
      counter.textContent = `${remaining} characters remaining`

      if (remaining < 50) {
        counter.style.color = "#ff6b6b"
      } else {
        counter.style.color = "rgba(255, 255, 255, 0.6)"
      }
    })

    // Initialize counter
    messageField.dispatchEvent(new Event("input"))
  }
})
