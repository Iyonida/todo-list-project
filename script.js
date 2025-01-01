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
const applyBtn = document.querySelector(".edit-popup__btn--apply");
const closeBtn = document.querySelector(".edit-popup__btn--cancel");
const taskLabel = document.querySelector(".task__label");

const testList = ["Go for a run", "Go to the gym", "Make breakfast"];

class ToDoApp {
  #toDoList = [];
  count = 0;
  itemId;
  pending;
  completed;
  constructor() {
    this._getLocalStorage();

    addBtn.addEventListener("click", this._addEntry.bind(this));

    listContainer.addEventListener("click", this._deleteEntry.bind(this));

    listContainer.addEventListener("click", this._editEntry.bind(this));

    listContainer.addEventListener("click", this._check.bind(this));

    navContainer.addEventListener("click", this._handleNavigation.bind(this));

    applyBtn.addEventListener("click", this._applyEdit.bind(this));

    closeBtn.addEventListener("click", this._closePopup.bind(this));

    clrBtn.addEventListener("click", this._clearLocalStorage.bind(this));
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
        <p class="task__label label-${item.id}">${item.task}</p>
        <div class="task__btn">
          <button class="task__btn--edit btn" data-id="${item.id}">Edit</button>
          <button class="task__btn--delete btn" data-id="${item.id}">Delete</button>
        </div>
      </li>`;

        listContainer.insertAdjacentHTML("afterbegin", html);

        if (item.status === "completed") {
          document.querySelector(`.label-${item.id}`).style.textDecoration =
            "line-through";

          document.querySelector(".task__checkbox-input").checked = true;
        }
      });
    } else {
      listContainer.innerHTML = "";
    }
  }

  _renderOptions() {
    if (
      document
        .querySelector(".navigation__item--pending")
        .classList.contains("navigation__item--active")
    ) {
      this._renderEntries(this.pending);
    } else if (
      document
        .querySelector(".navigation__item--completed")
        .classList.contains("navigation__item--active")
    ) {
      this._renderEntries(this.completed);
    } else {
      this._renderEntries(this.#toDoList);
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

    // add to localstorage
    this._setLocalStorage();
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
      this._renderOptions();

      // Decrease count
      this.count--;

      // add to localstorage
      this._setLocalStorage();
    }
  }

  _editEntry(e) {
    let item;
    // Identify selected button
    if (!e.target.classList.contains("task__btn--edit")) return;
    else {
      const id = Number(e.target.dataset.id);
      this.itemId = id;
      // show popup
      overlayEl.classList.remove("hidden");

      // Retrieve item from array
      item = this.#toDoList.find((entry) => entry.id === id);
      editInputField.value = item.task;
    }
  }

  _applyEdit(e) {
    e.preventDefault();

    //Set the new task into the array
    this.#toDoList.find((entry) => entry.id === this.itemId).task =
      editInputField.value;

    // close popup
    overlayEl.classList.add("hidden");

    // status as pending
    this.#toDoList.find((entry) => entry.id === this.itemId).status = "pending";

    // Display updated array
    this._renderOptions();

    // add to localstorage
    this._setLocalStorage();
  }

  _closePopup() {
    overlayEl.classList.add("hidden");
  }

  _check(e) {
    if (!e.target.classList.contains("task__checkbox-input")) return;
    else {
      // identify selected checkbox
      const id = Number(e.target.closest(".task__row").dataset.id);

      // Change the status of the selected entry to completed
      this.#toDoList.find((entry) => entry.id === id).status = "completed";

      // Display the updated entries
      this._renderOptions();

      // add to localstorage
      this._setLocalStorage();
    }
  }

  _handleNavigation(e) {
    const clicked = e.target;
    const removeActiveClass = function () {
      document
        .querySelectorAll(".navigation__item")
        .forEach((el) => el.classList.remove("navigation__item--active"));
    };

    if (clicked.classList.contains("navigation__item--all")) {
      // remove active class from all option
      removeActiveClass();

      // add active class to selected option
      clicked.classList.add("navigation__item--active");

      // render all the entries on the list
      this._renderEntries(this.#toDoList);
    } else if (clicked.classList.contains("navigation__item--pending")) {
      // remove active class from all option
      removeActiveClass();

      // add active class to selected option
      clicked.classList.add("navigation__item--active");

      // render all the pending entries on the list
      const pendingEntries = this.#toDoList.filter(
        (entry) => entry.status === "pending"
      );
      this.pending = pendingEntries;
      this._renderEntries(pendingEntries);
    } else if (clicked.classList.contains("navigation__item--completed")) {
      // remove active class from all option
      removeActiveClass();

      // add active class to selected option
      clicked.classList.add("navigation__item--active");

      // render all the completed entries on the list
      const completedEntries = this.#toDoList.filter(
        (entry) => entry.status === "completed"
      );
      this.completed = completedEntries;
      this._renderEntries(completedEntries);
    }
  }

  _setLocalStorage() {
    localStorage.setItem("toDoList", JSON.stringify(this.#toDoList));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("toDoList"));

    if (!data) return;

    this.#toDoList = data;
    this._renderEntries(this.#toDoList);
  }
  _clearLocalStorage() {
    localStorage.clear();

    this.#toDoList = [];

    this._renderEntries(this.#toDoList);
  }
}

const app = new ToDoApp();
