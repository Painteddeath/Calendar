let currentDate = new Date();
const calendarBody = document.getElementById('calendar-body');
const currentMonthSpan = document.getElementById('current-month');

// Load saved data from localStorage
const memosArea = document.getElementById('memos');
const taskList = document.getElementById('task-list');

memosArea.value = localStorage.getItem('memos') || '';

function loadTasks() {
    taskList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task;
        li.addEventListener('click', () => {
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTasks();
        });
        taskList.appendChild(li);
    });
}

loadTasks();

document.getElementById('add-task').addEventListener('click', () => {
    const input = document.getElementById('task-input');
    const value = input.value.trim();
    if (value) {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.push(value);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        input.value = '';
        loadTasks();
    }
});

memosArea.addEventListener('input', () => {
    localStorage.setItem('memos', memosArea.value);
});

function saveEvents(events) {
    localStorage.setItem('events', JSON.stringify(events));
}

function loadEvents() {
    return JSON.parse(localStorage.getItem('events') || '{}');
}

function renderCalendar() {
    calendarBody.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    currentMonthSpan.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const events = loadEvents();

    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            if (i === 0 && j < firstDay) {
                cell.innerHTML = '';
            } else if (date > daysInMonth) {
                break;
            } else {
                const dayDiv = document.createElement('div');
                dayDiv.classList.add('day-number');
                dayDiv.textContent = date;
                cell.appendChild(dayDiv);
                const key = `${year}-${month}-${date}`;
                if (events[key]) {
                    events[key].forEach(evt => {
                        const evtDiv = document.createElement('div');
                        evtDiv.classList.add('event');
                        evtDiv.style.background = evt.color;
                        evtDiv.textContent = evt.desc;
                        cell.appendChild(evtDiv);
                    });
                }
                cell.addEventListener('click', () => openModal(key));
                date++;
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }
}

function openModal(dateKey) {
    const modal = document.getElementById('event-modal');
    modal.classList.remove('hidden');
    document.getElementById('save-event').onclick = () => saveEvent(dateKey);
    document.getElementById('cancel-event').onclick = closeModal;
}

function closeModal() {
    document.getElementById('event-modal').classList.add('hidden');
    document.getElementById('event-desc').value = '';
}

// Ensure modal is hidden on initial load in case CSS fails to apply
closeModal();

function saveEvent(dateKey) {
    const desc = document.getElementById('event-desc').value.trim();
    const color = document.getElementById('event-color').value;
    if (!desc) return;
    const events = loadEvents();
    if (!events[dateKey]) events[dateKey] = [];
    events[dateKey].push({ desc, color });
    saveEvents(events);
    closeModal();
    renderCalendar();
}

renderCalendar();

document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});
