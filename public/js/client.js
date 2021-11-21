const form = document.querySelector("form");
const fileInput = document.getElementById("file-input");
const fileError = document.getElementById("file_error");
const unitInput = document.getElementById("unit-value");
const unitTypeInput = document.getElementById("unit-type");
const lifeCheck = document.getElementById("lifeCheck");
const lifeNb = document.getElementById("lifeNb");
const progressBarContainer = document.getElementById("progress-bar-container");
const progressBar = document.getElementById("progress-bar");
const linkDiv = document.getElementById("link");
const linkTable = document.getElementById("link-table");

let isValidForm = false;

// GESTION FICHIER
fileInput.addEventListener("change", () => {
  if (fileInput.files[0].size > 524_288_000) {
    fileError.innerText =
      "Fichier trop volumineux, Il doit faire au maximum 500Mo.";
    isValidForm = false;
  } else {
    fileError.innerText = "";
    isValidForm = true;
  }
});

// GESTION LIMITE DE TEMPS
let multiplier = 60 * 1000; // par défaut "minute"
let timeValue = unitInput.value * multiplier;
function refreshTimeValue() {
  timeValue = unitInput.value * multiplier;
}
refreshTimeValue();
unitInput.addEventListener("change", refreshTimeValue);
unitTypeInput.addEventListener("change", () => {
  switch (unitTypeInput.value) {
    case "minute":
      unitInput.max = 59;
      unitInput.value = 30;
      multiplier = 60 * 1000; // 60 secondes
      break;
    case "heure":
      unitInput.max = 23;
      unitInput.value = 1;
      multiplier = 60 * 60 * 1000; // 60 minutes
      break;
    case "jour":
      unitInput.max = 30;
      unitInput.value = 1;
      multiplier = 24 * 60 * 60 * 1000; // 24 heures
      break;
    default:
      break;
  }
  refreshTimeValue();
});

// GESTION LIMITE D UTILISATION
lifeCheck.addEventListener("change", () => {
  if (lifeCheck.checked) {
    lifeNb.style.display = "block";
    lifeNb.value = 1;
  } else {
    lifeNb.style.display = "none";
    lifeNb.value = null;
  }
});

// GESTION ENVOI
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = fileInput.files[0];
  if (!isValidForm) {
    console.log("Formulaire invalide");
    return;
  }
  try {
    const data = new FormData();
    data.append("file", file, file.name);
    data.append("timeLife", timeValue);
    data.append("useLife", lifeNb.value);
    const res = await axios.post("/upload", data, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        progressBarContainer.style.display = "block";
        progressBar.innerText = percentCompleted + "%";
        progressBar.style.width = percentCompleted + "%";
      },
    });
    form.reset();
    isValidForm = false;
    progressBarContainer.style.display = "none";
    const id = res.data + "";
    const url = window.location.href + id;
    linkTable.insertAdjacentHTML(
      "afterbegin",
      `<tr>
        <td data_link="${url}">
          <a href="${url}"
             title="Ouvrir le lien">
            ${url}
          </a>
          <i onClick='copyToClipboard(this)'
             class="far fa-clipboard"
             title="Ajouter au presse-papier"
          >
        </td>
      </tr>`
    );
    console.log(res);
  } catch (error) {
    console.log(error);
  }
});

// GESTION CLIPBOARD
async function copyToClipboard(el) {
  const url = el.parentElement.getAttribute("data_link");
  try {
    await navigator.clipboard.writeText(url);
    console.log(url, "ajouté au presse-papier");
  } catch (error) {
    console.log("Echec lors de l'ajout au presse-papier");
  }
}
