export function createTicket() {
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

export function getTicketById(id) {
  return fetch(`http://localhost:7070?method=ticketById&id=${id}`).then(
    (resp) => resp.json(),
  );
}

export function removeItem(id) {
  fetch(`http://localhost:7070?method=deleteById&id=${id}`).then((response) => {
    if (response.ok) {
      const removeItem = document.getElementById(id);
      removeItem.remove();
      return true;
    }
  });
}

export function updateTicket(id, name, desc) {
  return fetch(`http://localhost:7070?method=updateById&id=${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      name: name,
      description: desc,
    }),
  });
}

// Примеры запросов:
//
// GET    ?method=allTickets - список тикетов
// GET    ?method=ticketById&id=<id> - полное описание тикета (где <id> - идентификатор тикета)
// POST   ?method=createTicket - создание тикета (<id> генерируется на сервере, в теле формы name, description, status)
// Соответственно:
//
// POST   ?method=createTicket - в теле запроса форма с полями для объекта типа Ticket (с id = null)
// POST   <id> - в теле запроса форма с полями для обновления объекта типа Ticket по id
// GET    ?method=allTickets  - массив объектов типа Ticket (т.е. без description)
// GET    ?method=ticketById&id=<id> - объект типа Ticket
// GET    ?method=deleteById&id=<id> - удалить объект типа Ticket по id, при успешном запросе статус ответа 204
