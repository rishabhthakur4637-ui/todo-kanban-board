# To-Do Kanban Board

A responsive To-Do Kanban Board built with HTML, CSS, and vanilla JavaScript. The application helps users create, edit, search, sort, and manage tasks across three workflow columns: **Pending**, **In Progress**, and **Completed**. Tasks are saved in the browser using `localStorage`, so they remain available after a page refresh in the same browser.

## Features

- **Add Tasks:** Create a task with a name and due date.
- **Edit Tasks:** Update an existing task using the Edit button or by double-clicking its task name.
- **Delete Tasks:** Remove individual tasks.
- **Task Status Management:** Move tasks between Pending, In Progress, and Completed.
- **Completion Checkbox:** Mark a task as completed or return it to Pending.
- **Clear Completed Tasks:** Remove all tasks currently marked as Completed.
- **Search Tasks:** Search by task name or due date. Date searches support both `YYYY-MM-DD` and the displayed `MM/DD/YYYY` format.
- **Sort Tasks:** Choose the default order, sort tasks by due date (earliest or latest first), or change the status-column order.
- **Date Validation:** Validate dates using the `YYYY-MM-DD` input format, including month lengths and leap years.
- **Persistent Storage:** Save tasks in browser `localStorage`.
- **Responsive Layout:** Use the board on desktop and smaller screens.

## Technologies Used

- HTML
- CSS
- JavaScript
- Browser `localStorage`

## Project Structure

```text
JS Assignment/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Getting Started

### Requirements

A modern web browser is required. No additional packages, libraries, or build tools are needed.

### Run the Project

1. Download or clone the project folder.
2. Open the `JS Assignment` folder.
3. Open `index.html` in your browser.

## How to Use

1. Enter a task name and select a due date.
2. Click **Add Task** to add the task to the Pending column.
3. Use the task's **Edit** button or double-click its name to edit it.
4. Use the status control to move a task between Pending, In Progress, and Completed.
5. Use the checkbox to mark a task as Completed. Unchecking it returns the task to Pending.
6. Click **Delete** to remove an individual task.
7. Use **Clear Completed** to remove all completed tasks.
8. Use the search field to find tasks by name or due date.
9. Use the sorting control to change the due-date order or the status-column order.

## Kanban Workflow

Tasks are displayed in three columns:

- **Pending:** Tasks that have not been started.
- **In Progress:** Tasks currently being worked on.
- **Completed:** Tasks that have been finished.

Changing a task's status moves it to the corresponding column.

## Search and Sorting

- **Search:** Searches task names without case sensitivity and matches due dates in either `YYYY-MM-DD` or `MM/DD/YYYY` format.
- **Default Order:** Preserves the existing order of tasks within each status column.
- **Due Date — Earliest First:** Displays tasks with earlier due dates before later ones within each column. Tasks without a due date appear after dated tasks.
- **Due Date — Latest First:** Displays tasks with later due dates before earlier ones within each column. Tasks without a due date appear after dated tasks.
- **Status — Pending First:** Displays the columns in Pending, In Progress, Completed order.
- **Status — Completed First:** Displays the columns in Completed, In Progress, Pending order.

## Date Validation and Formats

- The date input uses `YYYY-MM-DD`.
- The application validates the year, month, day, month length, and leap-year rules.
- Years must be between `1000` and `9999`.
- Impossible dates, such as `2025-02-30`, are rejected.
- Dates are displayed as `MM/DD/YYYY`.
- Search accepts either the stored `YYYY-MM-DD` format or the displayed `MM/DD/YYYY` format.
- When editing a task that already has a due date, the date must remain set. Older saved tasks without a due date may remain undated.

## Data Storage and Limitations

- Tasks are stored in the browser's `localStorage` under the key `todos`.
- Tasks remain available after refreshing the page in the same browser, as long as the browser's site data is not cleared.
- Tasks are stored locally in the current browser; they are not automatically synchronized across browsers or devices.
- The application handles storage errors. If saved data cannot be parsed or loaded, the error is logged in the browser console and an empty task list is loaded. If saving fails, an error message is displayed in the app and the previous in-memory task data is restored.
- Clearing browser site data may remove saved tasks.

## Manual Testing Checklist

Use this checklist to test the application in a browser:

- [ ] Add a task with a valid name and due date.
- [ ] Try to add a task without a name or due date.
- [ ] Edit a task using the Edit button and by double-clicking its name.
- [ ] Move tasks between all three status columns.
- [ ] Mark a task completed and uncheck it.
- [ ] Delete one task.
- [ ] Clear all completed tasks.
- [ ] Search by part of a task name.
- [ ] Search using both `YYYY-MM-DD` and `MM/DD/YYYY` date formats.
- [ ] Sort by earliest and latest due date.
- [ ] Change the status-column order.
- [ ] Try invalid dates, including impossible month/day combinations and leap-year cases.
- [ ] Refresh the page and confirm that saved tasks remain.
- [ ] Check the layout at desktop and narrow/mobile screen widths.

## Project Walkthrough

**Loom Video:** [https://www.loom.com/share/57cda4e2372049a7acabf61a7b74f18e](https://www.loom.com/share/57cda4e2372049a7acabf61a7b74f18e)
