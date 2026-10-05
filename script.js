// Select the HTML elements used by this app.
const input = document.getElementById('todo-input');
const dueDateInput = document.getElementById('due-date-input');
const taskForm = document.getElementById('task-form');
const errorMessage = document.getElementById('error-message');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const pendingList = document.getElementById('pending-list');
const inProgressList = document.getElementById('in-progress-list');
const completedList = document.getElementById('completed-list');

const validStatuses = ['pending', 'in-progress', 'completed'];
let todos = loadTodos();

// Load saved tasks safely and fill in fields missing from older tasks.
function loadTodos() {
    try {
        const saved = localStorage.getItem('todos');
        const parsed = saved ? JSON.parse(saved) : [];
        if (!Array.isArray(parsed)) return [];

        return parsed.filter((todo) => todo && typeof todo.text === 'string')
            .map((todo) => {
                let status = validStatuses.includes(todo.status) ? todo.status : 'pending';
                if (todo.completed) status = 'completed';
                return {
                    text: todo.text,
                    dueDate: typeof todo.dueDate === 'string' && isValidDueDate(todo.dueDate) ? todo.dueDate : '',
                    status: status,
                    completed: status === 'completed'
                };
            });
    } catch (error) {
        console.error('Saved todos could not be loaded:', error);
        return [];
    }
}

// Save all tasks in localStorage.
function saveTodos() {
    try {
        // Do not write a task with a malformed non-empty date to storage.
        if (todos.some((todo) => todo.dueDate && !isValidDueDate(todo.dueDate))) {
            showError('A task has an invalid due date and cannot be saved.');
            return false;
        }
        localStorage.setItem('todos', JSON.stringify(todos));
        return true;
    } catch (error) {
        console.error('Todos could not be saved:', error);
        showError('Could not save tasks in this browser.');
        return false;
    }
}

// Restore the previous task data if saving changes fails.
function saveOrRestore(previousTodos) {
    if (saveTodos()) {
        render();
        return true;
    }
    todos = previousTodos;
    render();
    return false;
}

// Show a validation or storage message below the form.
function showError(message) {
    errorMessage.textContent = message;
}

// Validate YYYY-MM-DD and check the actual number of days in the month.
function isValidDueDate(dateText) {
    const parts = dateText.split('-');
    if (parts.length !== 3 || parts[0].length !== 4 || parts[1].length !== 2 || parts[2].length !== 2) return false;

    // Ensure each part contains digits only.
    for (const part of parts) {
        for (const character of part) {
            if (character < '0' || character > '9') return false;
        }
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);
    if (year < 1000 || year > 9999 || month < 1 || month > 12 || day < 1) return false;

    const leapYear = year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
    const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return day <= daysInMonth[month - 1];
}

// Show stored YYYY-MM-DD dates in the requested card format.
function formatDueDate(dateText) {
    if (!dateText) return '';
    const [year, month, day] = dateText.split('-');
    return `${month}/${day}/${year}`;
}

function updateStatus(todo, status) {
    const previousTodos = todos.map((item) => ({ ...item }));
    todo.status = status;
    todo.completed = status === 'completed';
    saveOrRestore(previousTodos);
}

// Create a task card with completion, status, edit, and delete controls.
function createTodoNode(todo) {
    const li = document.createElement('li');
    li.className = 'todo-card';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.status === 'completed';
    checkbox.setAttribute('aria-label', `Mark ${todo.text} as completed`);
    checkbox.addEventListener('change', () => {
        updateStatus(todo, checkbox.checked ? 'completed' : 'pending');
    });

    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;
    if (todo.status === 'completed') textSpan.classList.add('completed-text');

    const dateLabel = document.createElement('small');
    dateLabel.className = 'due-date';
    dateLabel.textContent = todo.dueDate ? `Due: ${formatDueDate(todo.dueDate)}` : 'Due date: not set (older task)';

    const statusSelect = document.createElement('select');
    statusSelect.setAttribute('aria-label', `Status for ${todo.text}`);
    const statusOptions = [
        ['pending', 'Pending'],
        ['in-progress', 'In Progress'],
        ['completed', 'Completed']
    ];
    statusOptions.forEach(([value, label]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        statusSelect.appendChild(option);
    });
    statusSelect.value = todo.status;
    statusSelect.addEventListener('change', () => updateStatus(todo, statusSelect.value));

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    // Open an inline editor and keep the old text until Save is selected.
    editBtn.addEventListener('click', () => {
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = todo.text;
        editInput.setAttribute('aria-label', 'Edit task name');

        const editDateInput = document.createElement('input');
        editDateInput.type = 'date';
        editDateInput.min = '1000-01-01';
        editDateInput.max = '9999-12-31';
        editDateInput.value = todo.dueDate;
        editDateInput.setAttribute('aria-label', 'Edit due date');

        const saveBtn = document.createElement('button');
        saveBtn.type = 'button';
        saveBtn.textContent = 'Save';
        const saveEdit = () => {
            const newText = editInput.value.trim();
            const newDueDate = editDateInput.value;
            if (!newText) {
                showError('Task name cannot be empty.');
                editInput.focus();
                return;
            }
            // Keep an old task's blank date, but validate any date that is entered.
            if (!newDueDate && todo.dueDate) {
                showError('Please choose a due date.');
                editDateInput.focus();
                return;
            }
            if (newDueDate && !isValidDueDate(newDueDate)) {
                showError('Due date must be valid and use a year from 1000 to 9999.');
                editDateInput.focus();
                return;
            }
            const previousTodos = todos.map((item) => ({ ...item }));
            todo.text = newText;
            todo.dueDate = newDueDate;
            showError('');
            saveOrRestore(previousTodos);
        };
        saveBtn.addEventListener('click', saveEdit);
        editInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') saveEdit();
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', render);

        li.replaceChild(editInput, textSpan);
        li.replaceChild(editDateInput, dateLabel);
        li.replaceChild(saveBtn, editBtn);
        li.insertBefore(cancelBtn, deleteBtn);
        editInput.focus();
        editInput.select();
    });
    textSpan.addEventListener('dblclick', () => editBtn.click());

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Delete';
    // Remove this task, save the remaining tasks, and refresh the board.
    deleteBtn.addEventListener('click', () => {
        const previousTodos = todos.map((item) => ({ ...item }));
        todos.splice(todos.indexOf(todo), 1);
        saveOrRestore(previousTodos);
    });

    li.append(checkbox, textSpan, dateLabel, statusSelect, editBtn, deleteBtn);
    return li;
}

// Search tasks, sort the visible tasks, and render each status in its column.
function render() {
    pendingList.replaceChildren();
    inProgressList.replaceChildren();
    completedList.replaceChildren();

    const searchText = searchInput.value.trim().toLowerCase();
    const visibleTodos = todos.filter((todo) =>
        todo.text.toLowerCase().includes(searchText) ||
        todo.dueDate.includes(searchText) ||
        formatDueDate(todo.dueDate).toLowerCase().includes(searchText)
    );

    // Reorder whole columns for status sorting; tasks keep their real status.
    const statusColumnOrder = sortSelect.value === 'statusCompleted'
        ? [completedList, inProgressList, pendingList]
        : [pendingList, inProgressList, completedList];
    statusColumnOrder.forEach((list) => list.parentElement.parentElement.appendChild(list.parentElement));

    const compareDueDates = (first, second) => {
        if (!first.dueDate && !second.dueDate) return 0;
        if (!first.dueDate) return 1;
        if (!second.dueDate) return -1;
        const dateOrder = first.dueDate.localeCompare(second.dueDate);
        if (sortSelect.value === 'dueDateDesc') return -dateOrder;
        if (sortSelect.value === 'dueDateAsc') return dateOrder;
        return 0;
    };

    // Sort within each column so changing sort never changes a task's status.
    const tasksByStatus = {
        pending: [],
        'in-progress': [],
        completed: []
    };
    visibleTodos.forEach((todo) => {
        const status = validStatuses.includes(todo.status) ? todo.status : 'pending';
        tasksByStatus[status].push(todo);
    });

    [
        [tasksByStatus.pending, pendingList],
        [tasksByStatus['in-progress'], inProgressList],
        [tasksByStatus.completed, completedList]
    ].forEach(([statusTodos, list]) => {
        statusTodos.sort(compareDueDates).forEach((todo) => {
            list.appendChild(createTodoNode(todo));
        });
    });
}

// Validate and add a task to the Pending column.
function addTodo() {
    const text = input.value.trim();
    const dueDate = dueDateInput.value;
    if (!text) {
        showError('Please enter a task name.');
        input.focus();
        return;
    }
    if (!dueDate) {
        showError('Please choose a due date.');
        dueDateInput.focus();
        return;
    }
    if (!isValidDueDate(dueDate)) {
        showError('Enter a valid date in YYYY-MM-DD format with a year from 1000 to 9999.');
        dueDateInput.focus();
        return;
    }

    const previousTodos = todos.map((todo) => ({ ...todo }));
    todos.push({ text: text, dueDate: dueDate, status: 'pending', completed: false });
    if (!saveOrRestore(previousTodos)) return;

    input.value = '';
    dueDateInput.value = '';
    showError('');
    input.focus();
}

// Handle form submission from the button or Enter key without reloading the page.
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addTodo();
});
input.addEventListener('input', () => showError(''));
dueDateInput.addEventListener('input', () => showError(''));
dueDateInput.addEventListener('change', () => showError(''));
searchInput.addEventListener('input', render);
sortSelect.addEventListener('change', render);
// Remove completed tasks and keep the remaining tasks saved.
clearCompletedBtn.addEventListener('click', () => {
    const previousTodos = todos.map((todo) => ({ ...todo }));
    todos = todos.filter((todo) => todo.status !== 'completed');
    saveOrRestore(previousTodos);
});

render();
