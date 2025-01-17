const display = document.getElementById("calculator-display");
const buttons = document.querySelectorAll(".btn");

let currentInput = "";
let previousInput = "";
let operator = null;
let result = 0;

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.getAttribute("data-value");

    // Botón C (Clear)
    if (value === "C") {
      currentInput = "";
      previousInput = "";
      operator = null;
      display.textContent = "0";
      return;
    }

    // Botón =
    if (value === "=") {
      if (operator && currentInput !== "") {
        result = calcular(parseFloat(previousInput), parseFloat(currentInput), operator);
        display.textContent = result;
        previousInput = result;
        currentInput = "";
        operator = null;
      }
      return;
    }

    // Si es un operador básico (+, -, *, /)
    if (btn.classList.contains("operator")) {
      if (currentInput === "") return; // Evitar operador sin número
      if (previousInput && currentInput && operator) {
        // Calcula parcialmente antes de nuevo operador
        result = calcular(parseFloat(previousInput), parseFloat(currentInput), operator);
        display.textContent = result;
        previousInput = result;
        currentInput = "";
      } else {
        previousInput = currentInput;
        currentInput = "";
      }
      operator = value;
      return;
    }

    // Si es una función científica
    if (btn.classList.contains("scientific")) {
      // Primero, si no hay nada en currentInput, no hacemos nada
      if (!currentInput && !previousInput) return;

      // Convierto a número
      let number = parseFloat(currentInput || previousInput || 0);
      let resultSci = 0;

      switch (value) {
        case "sin":
          // Normalmente la calculadora trabaja en radianes, pero Casio a veces en grados
          // Para emular Casio en modo DEG, convertir: degrees -> radian = degrees * (Math.PI / 180)
          // Suponiendo modo DEG, ajusta si quieres radianes:
          resultSci = Math.sin(toRadians(number));
          break;
        case "cos":
          resultSci = Math.cos(toRadians(number));
          break;
        case "tan":
          resultSci = Math.tan(toRadians(number));
          break;
        case "ln":
          resultSci = Math.log(number); // log natural
          break;
        case "log":
          resultSci = Math.log10(number); // log base 10
          break;
        case "^2":
          resultSci = Math.pow(number, 2);
          break;
        case "^3":
          resultSci = Math.pow(number, 3);
          break;
        case "sqrt":
          resultSci = Math.sqrt(number);
          break;
        case "inv":
          resultSci = (number !== 0) ? 1 / number : "Error";
          break;
        case "sign":
          resultSci = -number;
          break;
        default:
          resultSci = number;
      }

      // Asignamos el resultado al display
      display.textContent = +resultSci.toFixed(10);  // + para convertir a número, .toFixed(10) si quieres redondear
      // Guardamos este resultado en currentInput (u previousInput)
      currentInput = `${resultSci}`;
      previousInput = "";
      operator = null;
      return;
    }

    // Si es un número o punto (.)
    if (value === "." && currentInput.includes(".")) {
      return; // evito doble punto
    }

    currentInput += value;
    display.textContent = currentInput;
  });
});

// Función para operar (+, -, *, /)
function calcular(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b !== 0 ? a / b : "Error";
    default: return b;
  }
}

// Función para pasar de grados a radianes (si quieres emular modo DEG)
function toRadians(deg) {
  return deg * (Math.PI / 180);
}
