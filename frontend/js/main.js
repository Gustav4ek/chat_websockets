const d_noneBlocks = document.querySelectorAll('.d-none');
const nickname = document.querySelector('.signup-form #nickname');
const loginForm = document.querySelector('.signup-form');
const hiddenBlock = document.querySelector('.hidden-block');
const messageForm = document.querySelector('.message-form');
const input = document.querySelector('#msginput');
const messages = document.querySelector('.list-group')
const userList = document.querySelector('#user-list')

console.log(userList)


const socket = io.connect();

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit('login', nickname.value);
});

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('message', {
            inputValue: input.value,
            nicknameValue: nickname.value
        });
        input.value = '';
    }
})

  socket.on('login', (data)=> {
      if (data.status === 'OK') {
          d_noneBlocks.forEach(item => {
              item.classList.remove('d-none')
          })
      }

      else if (data.status === 'FAILED'){
          hiddenBlock.textContent = `Пользователем с ником ${nickname.value} уже подключен!!!`
          setTimeout(()=> {
              hiddenBlock.textContent = ''
          }, 2000)
      }
  })

socket.on('users', (data)=> {
    userList.innerHTML = ''
    data.users.forEach(item => {
        userList.insertAdjacentHTML('afterbegin', `
              <li class="list-group-item">${item}</li>`)
    })
})

socket.on('new message', (data)=> {
    messages.insertAdjacentHTML("afterend", `<a class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-11">${data.nickname}</h5>
                  <small class="text-muted">${new Date()}</small>
                </div>
                <p class="mb-1">${data.message}</p>
              </a>`)
})


