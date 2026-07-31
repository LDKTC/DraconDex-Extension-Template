// This extension window never has window.api — only window.extApi, scoped to
// the table(s) this extension declared in dracondex-extension.json.
// See https://github.com/LDKTC/App-DraconDex/blob/main/docs/EXTENSIONS.md
const TABLE = "notes";

const form = document.getElementById("note-form");
const titleInput = document.getElementById("note-title");
const ratingInput = document.getElementById("note-rating");
const list = document.getElementById("note-list");

async function render() {
  const notes = await window.extApi.table.query(TABLE, {});
  list.innerHTML = "";
  for (const note of notes) {
    const li = document.createElement("li");
    li.textContent = `${note.title} (${note.rating ?? "-"})`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Delete";
    removeBtn.onclick = async () => {
      await window.extApi.table.delete(TABLE, note.id);
      render();
    };

    li.appendChild(removeBtn);
    list.appendChild(li);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const rating = ratingInput.value === "" ? null : Number(ratingInput.value);
  await window.extApi.table.insert(TABLE, { title: titleInput.value, rating });
  form.reset();
  render();
});

render();
