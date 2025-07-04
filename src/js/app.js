import { removeItem, createTicket, getTicketById, updateTicket } from "./http";

const btn = document.querySelector(".btn");
const taskList = document.querySelector(".task-list");
const desk = document.querySelector(".desk");

desk.addEventListener("click", (event) => {
  if (event.target.classList.value === "remove") {
    const id = event.target;
    const task = id.closest(".task").id;
    console.log(task);
    confirmDeletion(task);
  }
  if (event.target.classList.value === "edit") {
    const id = event.target;
    const task = id.closest(".task").id;
    getTicketById(task).then((task) => openEditDialog(task));
  }
  if (event.target.classList.value === "select") {
    checkedTask(event);
  }
});

btn.addEventListener("click", () => openDialog());

function getList() {
  return fetch("http://localhost:7070?method=allTickets").then((response) =>
    response.json(),
  );
}

async function initList() {
  let data = await getList().then((data) => data);
  console.log(typeof data);
  for (let key in data) {
    addItems(data[key]);
  }
}

function openDialog() {
  if (!document.querySelector("form")) {
    const dialog = document.createElement("form");
    dialog.classList.add("form");
    dialog.innerHTML =
      '    <div class="form-title">Добавить тикет</div>\n' +
      "    <div>Краткое описание</div>\n" +
      '    <input class="input-text" id="name" type="text">\n' +
      "    <div>Подробное описание</div>\n" +
      '    <input class="input-text" id="description" type="text">';

    const ok = document.createElement("div");
    ok.classList.add("btn");
    ok.textContent = "ok";
    const cancel = document.createElement("div");
    cancel.classList.add("btn");
    cancel.textContent = "Отмена";

    cancel.addEventListener("click", () => {
      dialog.remove();
    });

    ok.addEventListener("click", () => {
      createTicket().then((item) =>
        getTicketById(item.id).then((data) => addItems(data)),
      );
      dialog.remove();
    });

    dialog.append(ok, cancel);

    desk.append(dialog);
  }
}

function openEditDialog(obj) {
  console.log(obj);
  if (!document.querySelector("form")) {
    const dialog = document.createElement("form");
    dialog.classList.add("form");

    const title = document.createElement("div");
    title.classList.add("form-title");
    title.textContent = "Изменить тикет";

    const nameTitle = document.createElement("div");
    nameTitle.classList.add("input-text");
    nameTitle.textContent = "Краткое описание";

    const name = document.createElement("input");
    name.classList.add("input-text");
    name.id = "name";
    name.value = obj.name;
    name.required;

    const discriptionTitle = document.createElement("div");
    discriptionTitle.classList.add("input-text");
    discriptionTitle.textContent = "Полное описание";

    const discription = document.createElement("input");
    discription.classList.add("input-text");
    discription.id = "description";
    discription.value = obj.description;

    const ok = document.createElement("div");
    ok.classList.add("btn");
    ok.textContent = "ok";

    const cancel = document.createElement("div");
    cancel.classList.add("btn");
    cancel.textContent = "Отмена";

    cancel.addEventListener("click", () => {
      dialog.remove();
    });

    ok.addEventListener("click", () => {
      console.log(name);

      updateTicket({ id: obj.id, name: name.value, desc: discription.value })
        .then(updateItems)
        .then(() => initList());

      dialog.remove();
    });

    dialog.append(
      title,
      nameTitle,
      name,
      discriptionTitle,
      discription,
      ok,
      cancel,
    );

    desk.append(dialog);
  }
}

initList();

function addItems(obj) {
  const task = document.createElement("div");
  task.classList.add("task");
  task.id = obj.id;

  const main = document.createElement("div");
  main.classList.add("task-main");

  const information = document.createElement("div");
  information.classList.add("information");

  const input = document.createElement("input");
  input.classList.add("select");
  input.type = "checkbox";
  input.checked = obj.status;

  const name = document.createElement("div");
  name.classList.add("name");
  name.textContent = obj.name;

  const description = document.createElement("div");
  description.classList.add("description");
  description.classList.add("visible");
  description.textContent = obj.description;

  const crud = document.createElement("div");
  crud.classList.add("crud");

  const edit = document.createElement("div");
  edit.classList.add("edit");
  edit.textContent = "✎";

  const remove = document.createElement("div");
  remove.classList.add("remove");
  remove.textContent = "Х";

  const created = document.createElement("div");
  created.classList.add("created");
  created.textContent = formatDate(obj.created);
  crud.append(created, edit, remove);
  information.append(input, name);
  main.append(information, crud);
  task.append(main, description);

  task.addEventListener("click", (event) => {
    if (event.currentTarget.classList.contains("task")) {
      if (event.target.classList.contains("edit")) return;
      if (event.target.classList.contains("remove")) return;
      let desc = event.currentTarget.querySelector(".description");
      if (desc.textContent.length > 0) {
        console.log(desc);
        desc.classList.toggle("visible");
      }
    }
  });
  taskList.append(task);
}

async function updateItems() {
  taskList.innerHTML = "";
}

function confirmDeletion(task) {
  if (!document.querySelector("form")) {
    const cd = document.createElement("form");
    cd.classList.add("form");
    const title = document.createElement("div");
    title.textContent = "Вы действительно хотите удалить эту запись?";

    const ok = document.createElement("div");
    ok.classList.add("btn");
    ok.textContent = "ok";
    const cancel = document.createElement("div");
    cancel.classList.add("btn");
    cancel.textContent = "Отмена";

    cancel.addEventListener("click", () => {
      cd.remove();
    });

    ok.addEventListener("click", () => {
      removeItem(task);
      cd.remove();
    });

    cd.append(title, ok, cancel);
    desk.append(cd);
  }
}

function formatDate(timestamp) {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function checkedTask(event) {
  console.log(event.target.checked);
  console.log(event.target.closest(".task"));
  updateTicket({
    id: event.target.closest(".task").id,
    status: event.target.checked,
  });
}
