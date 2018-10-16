document.addEventListener("DOMContentLoaded", () => {
  const choreList = document.querySelector('#chore-list')
  const form = document.querySelector('#new-chore-form')
  form.addEventListener("submit", createAChore)
  fetchChores()

  function fetchChores(){
    fetch("http://localhost:3000/chores")
    .then(res => res.json())
    .then(chores => chores.forEach(chore => addChoreToPage(chore)))
  }

  function addChoreToPage(chore){
    const newDiv = document.createElement("div")
    newDiv.className = "chore-card"
    newDiv.innerHTML = `<button data-id=${chore.id} class="delete-button">X</button><h3>${chore.title}</h3><p>Duration: ${chore.duration}</p><input value=${chore.priority}></input><button class="edit-button" id="${chore.id}">Edit</button>`
    choreList.append(newDiv)
    let deleteButton = document.querySelector(`button[data-id = "${chore.id}"]`)
    deleteButton.addEventListener("click", deleteChore)
    let editButton = document.getElementById(`${chore.id}`)
    editButton.addEventListener("click", updateChore)
  }

  function createAChore(event){
    event.preventDefault()
    console.log("hit form submit")
    const title = event.target.title.value
    const duration = event.target.duration.value
    const priority = event.target.priority.value
    fetch("http://localhost:3000/chores", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        title,
        duration,
        priority
      })
    })
    .then(res => res.json())
    .then(addChoreToPage)
  }

  function deleteChore(event){
    console.dir(event.target.parentElement)
    let id = event.target.dataset.id
    // let id = event.target.getAttribute("data-id")
    event.target.parentElement.remove()
    fetch(`http://localhost:3000/chores/${id}`, {
      method: "DELETE"
    })
  }

  async function updateChore(event){
    let id = event.target.id
    console.log(id)
    let parent = event.target.parentNode
    let newPriority = parent.querySelector('input').value
    console.dir(newPriority)
    console.log(event.target)
    const oldChore = await fetch(`http://localhost:3000/chores/${id}`).then(res => res.json())
    const newChore = {...oldChore, priority: newPriority}
    console.log(oldChore)
    fetch(`http://localhost:3000/chores/${id}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({priority: newPriority})
    })
  }





})

