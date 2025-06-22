export function createTiket() {
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
