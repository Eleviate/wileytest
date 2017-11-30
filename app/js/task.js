function init() {
    let ul = document.createElement('ul'),
        form = document.createElement('div'),
        btnCreate = document.createElement('button'),
        btnClearStore = document.createElement('button');

    ul.className = 'form-list';
    ul.id = 'list';

    btnCreate.textContent = 'Create';
    btnCreate.className = 'form-button-add';
    btnCreate.onclick = createTask;

    btnClearStore.textContent = 'Remove all';
    btnClearStore.className = 'window-button-right';
    btnClearStore.onclick = () => {
        localStorage.clear();
        updateStorage();
    };

    form.className = 'form';
    form.id = 'form';
    form.append(ul);
    form.append(btnCreate);
    form.append(btnClearStore);

    document.getElementById('root').appendChild(form)
}

function showWindow(state) {
    let wnd = document.getElementById('window'),
        form = document.getElementById('form'),
        wrap = document.getElementById('wrap');

    form.append(wrap);
    form.append(wnd);

    wnd.style.display = state;
    wrap.style.display = state;
}

function hiddenWindow() {
    let fields = document.getElementsByClassName('window-input');

    for (let i = 0; i < fields.length; i++) fields[i].value = '';

    showWindow('none')
}

function saveTask(id) {
    let fields = document.getElementsByClassName('window-input'),
        task = {},
        valid = true;

    if (fields.length) {
        for (let i = 0; i < fields.length; i++) {
            let {name, value} = fields[i];

            if (!value) {
                fields[i].style.border = '2px solid red';
                valid = false;
            } else {
                task[name] = value;
                task['complete'] = '';
                fields[i].style.border = '0';
            }
        }
        if (valid) {
            task['id'] = id instanceof MouseEvent ? localStorage.length : id;
            localStorage.setItem(task['id'] + '', JSON.stringify(task));
            updateStorage();
            hiddenWindow();
        }
    }
}

function createTask() {
    let btnSave = document.getElementById('save');
    btnSave.onclick = saveTask.bind(this);
    showWindow('block');
}

function editTask(id) {
    let task = JSON.parse(localStorage.getItem(id)),
        fields = document.getElementsByClassName('window-input'),
        btnSave = document.getElementById('save');

    if (task) {
        for (let i = 0; i < fields.length; i++) {
            fields[i].value = task[fields[i].name]
        }
    }
    showWindow('block');
    btnSave.onclick = saveTask.bind(this, id)
}

function removeTask(id) {
    localStorage.removeItem(JSON.parse(localStorage.getItem(id)).id);
    updateStorage(document.getElementsByClassName('form-list')[0])
}

function completeTask(id) {
    let store = JSON.parse(localStorage.getItem(id));
    store['complete'] ? store['complete'] = '' : store['complete'] = 'true';
    localStorage.setItem(store.id, JSON.stringify(store));
    updateStorage(document.getElementsByClassName('form-list')[0])
}

function updateStorage() {
    let ul = document.getElementById('list');

    if (localStorage.length) {
        let ls = SortLocalStorage();
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }

        for (let i = 0; i < ls.length; i++) {
            let storeToObject = ls[i],
                {id, title, description, complete} = storeToObject,
                li = document.createElement('li');

            li.innerHTML =
                `<h2 id="title">${title}</h2><div id="description">${description}</div>
             <button class="form-button-edit" onclick="editTask(${id})">Edit</button>
             <button class="form-button-delete" onclick="removeTask(${id})">Remove</button>
             <button class="form-button-complete" onclick="completeTask(${id})">${complete ? 'Create again' : 'Complete'}</button>`;
            li.id = i + '';
            li.className = 'form-list-task';
            if (complete) li.style.background = 'green';

            ul.appendChild(li)
        }
    } else {
        ul.innerHTML = '<h2 style="margin: auto; width: 20%">The list is empty</h2>'
    }

    function SortLocalStorage() {
        let obj = {}, localStorageArray = [];
        for (let i = 0; i < localStorage.length; i++) {
            let parseStore = JSON.parse(localStorage.getItem(localStorage.key(i))),
                {title} = parseStore;

            obj[title] = parseStore;
        }
        Object.keys(obj).sort((a, b) => {
            if (a.toLowerCase() > b.toLowerCase()) return 1;
            if (a.toLowerCase() < b.toLowerCase()) return -1;
            return 0;
        }).forEach((key, i)=>{
            localStorageArray[i] = obj[key];
        });
        return localStorageArray
    }
}

window.onload = () => {
    init();
    updateStorage();
};




