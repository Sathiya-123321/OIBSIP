"use strict";

// Temperature scales and their absolute zero limits.
const LIMITS = { C: -273.15, F: -459.67, K: 0 };
const SYMBOLS = { C: "°C", F: "°F", K: "K" };
const NAMES = { C: "Celsius", F: "Fahrenheit", K: "Kelvin" };

const input = document.getElementById("temperature");
const errorEl = document.getElementById("temperature-error");
const messageEl = document.getElementById("message");
const convertBtn = document.getElementById("convert");
const outputs = {
  C: document.getElementById("out-c"),
  F: document.getElementById("out-f"),
  K: document.getElementById("out-k"),
};
const cards = document.querySelectorAll(".result");

// Accept integers, decimals (leading dot allowed) and scientific notation.
const NUMBER_PATTERN = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i;

function toCelsius(value, unit) {
  if (unit === "F") return ((value - 32) * 5) / 9;
  if (unit === "K") return value - 273.15;
  return value;
}

function fromCelsius(celsius, unit) {
  if (unit === "F") return (celsius * 9) / 5 + 32;
  if (unit === "K") return celsius + 273.15;
  return celsius;
}

function formatValue(value) {
  const rounded = Math.round((value + Number.EPSILON) * 1e6) / 1e6;
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 6,
  }).format(rounded);
}

function selectedUnit() {
  return document.querySelector('input[name="from-unit"]:checked').value;
}

function showError(text) {
  errorEl.textContent = text;
  errorEl.hidden = false;
  input.setAttribute("aria-invalid", "true");
  messageEl.textContent = "";
  messageEl.classList.remove("is-error");
}

function clearError() {
  errorEl.textContent = "";
  errorEl.hidden = true;
  input.removeAttribute("aria-invalid");
}

function resetResults() {
  Object.values(outputs).forEach((output) => {
    output.textContent = "—";
  });
  cards.forEach((card) => {
    card.classList.remove("is-source");
    card.querySelector(".result__badge").textContent = "Converted";
  });
}

function updateBadges(unit) {
  cards.forEach((card) => {
    const isSource = card.dataset.unit === unit;
    card.classList.toggle("is-source", isSource);
    card.querySelector(".result__badge").textContent = isSource ? "Input" : "Converted";
  });
}

function validate(raw) {
  const text = raw.trim();

  if (text === "") {
    return { error: "Please enter a temperature value." };
  }

  if (!NUMBER_PATTERN.test(text)) {
    return { error: "Please enter a valid number, for example 25 or -12.5." };
  }

  const value = Number(text);

  if (!Number.isFinite(value)) {
    return { error: "Please enter a valid number, for example 25 or -12.5." };
  }

  return { value };
}

function convert() {
  const result = validate(input.value);

  if (result.error) {
    showError(result.error);
    resetResults();
    input.focus();
    return;
  }

  clearError();

  const unit = selectedUnit();
  const value = result.value;

  // Absolute zero cannot be crossed on any scale.
  if (value < LIMITS[unit] - 1e-9) {
    showError(`Temperature cannot be below absolute zero (${LIMITS[unit]} ${SYMBOLS[unit]}).`);
    messageEl.textContent = "That temperature is colder than absolute zero — please try again.";
    messageEl.classList.add("is-error");
    resetResults();
    input.focus();
    return;
  }

  const celsius = toCelsius(value, unit);

  ["C", "F", "K"].forEach((scale) => {
    outputs[scale].textContent = formatValue(fromCelsius(celsius, scale));
  });

  updateBadges(unit);
  messageEl.classList.remove("is-error");
  messageEl.textContent = `${formatValue(value)} ${SYMBOLS[unit]} converted successfully.`;
}

// Real-time validation: clear stale errors and results as the user types.
input.addEventListener("input", () => {
  clearError();
  messageEl.textContent = "";
  messageEl.classList.remove("is-error");
  resetResults();
});

convertBtn.addEventListener("click", convert);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    convert();
  }
});

document.querySelectorAll('input[name="from-unit"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    messageEl.textContent = "";
    if (input.value.trim() !== "") {
      convert();
    }
  });
});
