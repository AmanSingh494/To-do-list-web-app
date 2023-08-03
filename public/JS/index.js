const inputToEdit = document.querySelector('.editInput')
const editButton = document.querySelector('.edit')
const listItem = document.querySelector('.para')
const doneBtn = document.querySelector('.done')
editButton.addEventListener('click', () => {
  inputToEdit.classList.toggle('hide')
  doneBtn.classList.toggle('hide')
  listItem.classList.toggle('hide')
})
