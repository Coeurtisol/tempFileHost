const fileInput = document.getElementById("monFichier");
const form = document.querySelector("form");
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
        progressBar.innerText = percentCompleted + "%";
        progressBar.style.width = percentCompleted + "%";
      },
    });
    // form.reset();
    progressBar.innerText = "";
    const id = res.data + "";
    linkTable.insertAdjacentHTML(
      "afterbegin",
      `<tr><td data_link="${id}"><a href="/${id}">/${id}</a><i onClick='copyToClipboard(this)' class="far fa-clipboard"></td></tr>`
    );
    console.log(res);
  } catch (error) {
    console.log(error);
  }
});

async function copyToClipboard(el) {
  const id = el.parentElement.getAttribute("data_link");
  const link = `http://127.0.0.1:8080/${id}`;
  navigator.clipboard.writeText(link).then(
    () => {
      console.log(link, "ajouté au presse-papier");
    },
    () => {
      console.log("Echec lors de l'ajout au presse-papier");
    }
  );
}
