const fileInput = document.getElementById("monFichier");
const form = document.querySelector("form");
const progressBarContainer = document.getElementById("progress-bar-container");
const progressBar = document.getElementById("progress-bar");
const linkDiv = document.getElementById("link");
const linkTable = document.getElementById("link-table");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = fileInput.files[0];
  if (!file) {
    console.log("Pas de fichier");
    return;
  }
  try {
    const data = new FormData();
    data.append("file", file, file.name);
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
    // form.reset();
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

async function copyToClipboard(el) {
  const url = el.parentElement.getAttribute("data_link");
  try {
    await navigator.clipboard.writeText(url);
    console.log(url, "ajouté au presse-papier");
  } catch (error) {
    console.log("Echec lors de l'ajout au presse-papier");
  }
}
