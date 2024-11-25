document.addEventListener("DOMContentLoaded", () => {
  loadTableData();
});

const checkButton = document.getElementById("checkButton");
const resultModal = document.getElementById("resultModal");
const modalResult = document.getElementById("modalResult");
const nameInput = document.getElementById("nameInput");

checkButton.addEventListener("click", function () {
  const name = nameInput.value.trim();

  if (name === "") {
    alert("Masukin namanya kocak!");
    return;
  }

  fetch("khodam/list.txt")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch khodam list");
      }
      return response.text();
    })
    .then((data) => {
      const khodams = data.split("\n").filter((khodam) => khodam.trim() !== "");
      const randomKhodam = khodams[Math.floor(Math.random() * khodams.length)];
      const result = `Khodam untuk <b>${name}</b> adalah <b>${randomKhodam}</b>`;
      modalResult.innerHTML = `<p>${result}</p>`;

      // Add entry to the table
      const tableBody = document.getElementById("checkTableBody");
      const newRow = document.createElement("tr");
      newRow.innerHTML = `<td>${name}</td><td>${randomKhodam}</td>`;
      tableBody.appendChild(newRow);

      saveToLocalStorage(name, randomKhodam);
    })
    .catch((error) => {
      console.error("Error:", error);
      modalResult.innerHTML = `<p>Error loading Khodam list: ${error.message}</p>`;
    });

  // Tampilkan modal
  resultModal.classList.remove("hidden");
});

document.getElementById("clearButton").addEventListener("click", function () {
  localStorage.removeItem("khodamData");
  document.getElementById("checkTableBody").innerHTML = "";
});

function saveToLocalStorage(name, khodam) {
  const data = JSON.parse(localStorage.getItem("khodamData")) || [];
  data.push({ name: name, khodam: khodam });
  localStorage.setItem("khodamData", JSON.stringify(data));
}

function loadTableData() {
  const data = JSON.parse(localStorage.getItem("khodamData")) || [];
  const tableBody = document.getElementById("checkTableBody");
  data.forEach((item) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `<td>${item.name}</td><td>${item.khodam}</td>`;
    tableBody.appendChild(newRow);
  });
}

// Script untuk menutup modal
document.addEventListener("click", (event) => {
  if (event.target.matches(".close-modal")) {
    resultModal.classList.add("hidden");
  }
});
