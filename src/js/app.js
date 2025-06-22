import { removeItem, createTiket, getTicketById } from "./http";

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
      const a = createTiket().then((item) =>
        getTicketById(item.id).then((data) => addItems(data)),
      );
      dialog.remove();
    });

    dialog.append(ok, cancel);

    desk.append(dialog);
  }
}

function openEditDialog(obj) {
  console.log(obj)
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
      const a = createTiket().then((item) =>
        getTicketById(item.id).then((data) => addItems(data)),
      );
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

  const input = document.createElement("input");
  input.classList.add("select");
  input.type = "checkbox";
  input.checked = obj.status;

  const name = document.createElement("div");
  name.classList.add("name");
  name.textContent = obj.name;

  const description = document.createElement("div");
  description.classList.add("description");
  description.textContent = obj.description;

  const edit = document.createElement("div");
  edit.classList.add("edit");

  const remove = document.createElement("div");
  remove.classList.add("remove");

  const created = document.createElement("div");
  created.classList.add("created");
  created.textContent = obj.created;
  main.append(input, name, created, edit, remove);
  task.append(main, description);
  taskList.append(task);
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

// Примеры запросов:
//
// GET    ?method=allTickets - список тикетов
// GET    ?method=ticketById&id=<id> - полное описание тикета (где <id> - идентификатор тикета)
// POST   ?method=createTicket - создание тикета (<id> генерируется на сервере, в теле формы name, description, status)
// Соответственно:
//
// POST   ?method=createTicket - в теле запроса форма с полями для объекта типа Ticket (с id = null)
// POST   ?method=updateById&id=<id> - в теле запроса форма с полями для обновления объекта типа Ticket по id
// GET    ?method=allTickets  - массив объектов типа Ticket (т.е. без description)
// GET    ?method=ticketById&id=<id> - объект типа Ticket
// GET    ?method=deleteById&id=<id> - удалить объект типа Ticket по id, при успешном запросе статус ответа 204
