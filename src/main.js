import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"]
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

//Security Code
const securityCode = document.querySelector("#security-code")
const securityCodePattern = { mask: "0000" }

const securityCodeMasked = IMask(securityCode, securityCodePattern)

const ccSecurityCode = document.querySelector(
  ".cc-info .cc-extra .cc-security .value"
)

//Expiration Date
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    }
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const ccExpirationDate = document.querySelector(
  ".cc-extra .cc-expiration .value"
)

//Card Number
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})d{0,12}/,
      cardtype: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    }
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    setCardType(foundMask.cardtype)
    return foundMask
  }
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const ccNumber = document.querySelector(".cc-number")

//Owner Name
const nameInput = document.querySelector("#card-holder")

const ccName = document.querySelector(".cc-info .cc-holder .value")

//EVENTS

//Chance CC Number value on input update
cardNumber.addEventListener(
  "input",
  () =>
    (ccNumber.textContent =
      cardNumber.value === "" ? "1234 5678 9012 3456" : cardNumber.value)
)

//Change CC Name value on input update
nameInput.addEventListener(
  "input",
  () =>
    (ccName.textContent =
      nameInput.value === "" ? "FULANO DA SILVA" : nameInput.value)
)

//Change Expiration Date value on input update
expirationDate.addEventListener(
  "input",
  () =>
    (ccExpirationDate.textContent =
      expirationDate.value === "" ? "02/32" : expirationDate.value)
)

//Change CC Security Code value on input update
securityCode.addEventListener("input", () => {
  if (securityCodeMasked.value !== "") {
    ccSecurityCode.textContent = ""

    for (let index = 1; index <= securityCodeMasked.value.length; index++) {
      ccSecurityCode.textContent += "*"
    }
  } else {
    ccSecurityCode.textContent = "123"
  }
})

//Prevent Form default behavior
document
  .querySelector("form")
  .addEventListener("submit", event => event.preventDefault())

//Button Submit
document.querySelector("button").addEventListener("click", () => {
  if (
    (nameInput.value == "") |
    (cardNumber.value == "") |
    (cardNumber.value.length < 19) |
    (expirationDate.value == "") |
    (securityCode.value == "")
  ) {
    alert("Cartão Inválido")
  } else {
    alert("Cartão Adicionado")
  }
})
