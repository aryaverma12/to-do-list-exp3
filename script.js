
document.addEventListener('DOMContentLoaded', () => {

    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const noTasksImage = document.getElementById('noTasksImage');
    const progressbar = document.getElementById('progress');
    const progressnumbers = document.getElementById('numbers');

    // Save tasks in LocalStorage
    const saveTasks = () => {
        const tasks = [];

        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.querySelector('.checkbox').checked
            });
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Show or hide empty task image
    const toggleImageVisibility = () => {
        if (taskList.children.length === 0) {
            noTasksImage.style.display = 'block';
        } else {
            noTasksImage.style.display = 'none';
        }
    };

    // Confetti animation
    const launchConfetti = () => {
        confetti({
            particleCount: 200,
            spread: 100,
            startVelocity: 30,
            origin: {
                y: 0.6
            }
        });
    };

    // Update progress bar
    const updateProgress = () => {
        const totalTasks = taskList.children.length;

        const completedTasks =
            taskList.querySelectorAll('.checkbox:checked').length;

        const percentage = totalTasks
            ? (completedTasks / totalTasks) * 100
            : 0;

        progressbar.style.width = `${percentage}%`;

        progressnumbers.textContent =
            `${completedTasks} / ${totalTasks}`;

        if (totalTasks > 0 && completedTasks === totalTasks) {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: {
                    y: 0.6
                }
            });
        }
    };

    // Create a task
    const createTask = (taskText, isCompleted = false) => {

        const li = document.createElement('li');

        li.innerHTML = `
            <input type="checkbox" class="checkbox">
            <span></span>

            <div class="task-buttons">

                <button type="button" class="edit-btn">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button type="button" class="delete-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');
        const taskSpan = li.querySelector('span');

        taskSpan.textContent = taskText;

        let isEditing = false;

        // Restore completed status
        checkbox.checked = isCompleted;

        li.classList.toggle('completed', isCompleted);

        editBtn.disabled = isCompleted;

        if (isCompleted) {
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }

        // Checkbox event
        checkbox.addEventListener('change', () => {

            const isChecked = checkbox.checked;

            li.classList.toggle('completed', isChecked);

            editBtn.disabled = isChecked;

            if (isChecked) {
                editBtn.style.opacity = '0.5';
                editBtn.style.pointerEvents = 'none';
            } else {
                editBtn.style.opacity = '1';
                editBtn.style.pointerEvents = 'auto';
            }

            updateProgress();
            saveTasks();
        });

        // Delete event
        deleteBtn.addEventListener('click', () => {

            li.remove();

            toggleImageVisibility();
            updateProgress();
            saveTasks();
        });

        // Edit event
        editBtn.addEventListener('click', () => {

            if (checkbox.checked) {
                return;
            }

            if (!isEditing) {

                const input = document.createElement('input');

                input.type = 'text';
                input.value = taskSpan.textContent;
                input.className = 'edit-input';

                taskSpan.replaceWith(input);

                input.focus();

                editBtn.innerHTML =
                    '<i class="fa-solid fa-check"></i>';

                isEditing = true;

            } else {

                const input = li.querySelector('.edit-input');

                const newText = input.value.trim();

                if (newText !== '') {

                    taskSpan.textContent = newText;

                    input.replaceWith(taskSpan);

                    editBtn.innerHTML =
                        '<i class="fa-solid fa-pen"></i>';

                    isEditing = false;

                    saveTasks();
                }
            }
        });

        taskList.appendChild(li);
    };

    // Add new task
    const addTask = (event) => {

        event.preventDefault();

        const taskText = taskInput.value.trim();

        if (!taskText) {
            return;
        }

        createTask(taskText);

        taskInput.value = '';

        toggleImageVisibility();
        updateProgress();
        saveTasks();
    };

    // Load saved tasks from LocalStorage
    const loadTasks = () => {

        const savedTasks = JSON.parse(
            localStorage.getItem('tasks')
        ) || [];

        savedTasks.forEach(task => {
            createTask(task.text, task.completed);
        });

        toggleImageVisibility();
        updateProgress();
    };

    // Form submission
    const form = document.getElementById('input-area');

    form.addEventListener('submit', addTask);

    // Load tasks when page opens
    loadTasks();

});
