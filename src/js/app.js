const btn = document.querySelector(".btn");
const taskList = document.querySelector(".task-list");
const desk = document.querySelector(".desk");

btn.addEventListener("click", () => openDialog());
// btn.addEventListener("click", () => {
//   getTicketById('3acfe274-8564-44d3-a092-09cad07b8072').then(ticket => console.log(ticket))});

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

initList();

function createTiket() {
  const name = document.getElementById("name");
  const description = document.getElementById("description");
  return fetch("http://localhost:7070?method=createTicket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ name: name.value, description: description.value }),
  }).then((response) => response.json());
}

function getTicketById(id) {
  return fetch(`http://localhost:7070?method=ticketById&id=${id}`).then(
    (resp) => resp.json(),
  );
}

function addItems(obj) {
  const task = document.createElement("div");
  task.classList.add("task");
  task.id = obj.id;

    const main = document.createElement("div");
  main.classList.add("task-main");

  const input = document.createElement("input");
  input.classList.add("select");
  input.type = "checkbox";

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
