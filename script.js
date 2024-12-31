"use strict";
class ListItem {
  constructor(task, id, status) {
    this.task = task;
    this.id = id;
    this.status = status;
  }
}

//////////////////////////////////////////
////// APP ACHITECTURE //////////////////

const inputField = document.querySelector(".form__input");
const addBtn = document.querySelector(".form__btn");
const navContainer = document.querySelector(".navigation__list");
const clrBtn = document.querySelector(".navigation__btn");
const listContainer = document.querySelector(".task");
const overlayEl = document.querySelector(".overlay");
const editInputField = document.querySelector(".edit-popup__input");

const testList = ["Go for a run", "Go to the gym", "Make breakfast"];

class ToDoApp {
  #toDoList = [];
  count = 0;
  constructor() {
    addBtn.addEventListener("click", this._addEntry.bind(this));

    listContainer.addEventListener("click", this._deleteEntry.bind(this));

    listContainer.addEventListener("click", this._editEntry.bind(this));
  }

  _renderEntries(list) {
    if (list.length !== 0) {
      listContainer.innerHTML = "";

      list.forEach(function (item) {
        const html = ` <li class="task__row" data-id="${item.id}">
        <div class="task__checkbox">
          <input type="checkbox" class="task__checkbox-input" />
          <div class="task__checkbox-custom"></div>
        </div>
        <p class="task__label">${item.task}</p>
        <div class="task__btn">
          <button class="task__btn--edit btn" data-id="${item.id}">Edit</button>
          <button class="task__btn--delete btn" data-id="${item.id}">Delete</button>
        </div>
      </li>`;

        listContainer.insertAdjacentHTML("afterbegin", html);
      });
    }
  }

  _addEntry(e) {
    e.preventDefault();

    // Add the new item to the array
    if (inputField.value !== "") {
      const item = new ListItem(inputField.value, this.count, "pending");
      this.#toDoList.push(item);

      // Clear input field
      inputField.value = "";
    }

    // Display the updated array
    this._renderEntries(this.#toDoList);

    // Increase the count
    this.count++;
  }

  _deleteEntry(e) {
    // Identify selected button
    if (!e.target.classList.contains("task__btn--delete")) return;
    else {
      let deleteId;
      // Remove item from array
      this.#toDoList.forEach(function (_, i) {
        if (Number(e.target.dataset.id) === i) {
          deleteId = i;
        }
      });
      this.#toDoList.pop(deleteId);

      // Display updated array
      this._renderEntries(this.#toDoList);

      // Decrease count
      this.count--;
    }
  }

  _editEntry(e) {
    let item;
    // Identify selected button
    if (!e.target.classList.contains("task__btn--edit")) return;
    else {
      const id = Number(e.target.dataset.id);

      // show popup
      overlayEl.classList.remove("hidden");

      // Retrieve item from array
      //   editInputField.value = this.#toDoList[id].task;
      item = this.#toDoList;
      console.log(item);
    }
  }

  _setLocalStorage() {
    localStorage.setItem("toDoList", JSON.stringify(this.#toDoList));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("toDoList"));
    console.log(data);
  }
}
const app = new ToDoApp();
