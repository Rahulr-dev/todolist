<template>
  <div class="container">
    <!-- Title of the Todo List application -->
    <h1 class="title">TODO LIST</h1>
    <hr />

    <!-- Form to add a new item to the todo list -->
    <form class="row g-3">
      <!-- Input field for entering the new todo item -->
      <div class="col-auto">
        <input
          type="text"
          class="form-control"
          placeholder="Add item..."
          v-model="userInput"
          @keyup.enter="addItem"
        />
      </div>

      <!-- Dropdown to select the priority of the new todo item -->
      <div class="col-auto">
        <label for="inputPassword2" class="visually-hidden">Priority</label>
        <select class="form-select" v-model="priority">
          <option value="">Select Priority</option>
          <option v-for="(value, key) in priority_list" :key="key" :value="key">
            {{ value }}
          </option>
        </select>
      </div>

      <!-- Button to add the new item, disabled if input fields are empty -->
      <div class="col-auto">
        <button
          type="button"
          class="btn btn-success mb-3"
          @click="addItem"
          :disabled="isAddbtnEnabled"
        >
          Add Item
        </button>
      </div>
    </form>

    <!-- Button to clear the entire list, only visible if the list is not empty -->
    <button
      class="btn btn-primary mb-2 me-2"
      @click="clearItem()"
      v-if="isListEmpty"
    >
      Clear List
    </button>

    <!-- Button to toggle the sorting of the todo list by priority -->
    <button
      class="btn btn-outline-info mb-2"
      @click="toggleSort()"
      v-if="isListEmpty"
    >
      {{ sorttext }}
      <!-- Displays the current sorting state -->
    </button>

    <!-- TodoTable component to display the list of items -->
    <TodoTable
      :todoList="list"
      @deleteItem="deleteItem"
      @saveEditItem="saveEditItem"
    />
  </div>
</template>

<script>
import TodoTable from "./todolist_table.vue"; // Import the TodoTable component
import { priority_list } from "../constants/constants.js"; // Import priority

export default {
  name: "TodoList",
  data() {
    return {
      userInput: "", // Holds the value of the current todo item being input
      searchInput: "", // Holds the value of the search query (if implemented)
      list: [], // The main list of todo items
      priority: "", // Holds the priority value of the current todo item
      sorttext: "Sort by priority", // Text for the sort button
      isSortActive: false, // Boolean flag to track if sorting is active
      priority_list: priority_list,
    };
  },
  components: { TodoTable }, // Registers the TodoTable component
  computed: {
    // Computed property to filter the todo list based on the search input
    filteredList() {
      return this.list.filter((item) =>
        item.value.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    },
    // Computed property to check if the list is empty
    isListEmpty() {
      return this.list.length == 0 ? false : true;
    },
    // Computed property to enable/disable the Add Item button
    isAddbtnEnabled() {
      return this.userInput !== "" && this.priority !== "" ? false : true;
    },
  },
  mounted() {
    // Load the todo list from localStorage when the component is mounted
    this.list =
      this.getdatafromlocalstorage() == null
        ? []
        : this.getdatafromlocalstorage();
  },
  methods: {
    // Method to toggle sorting the list by priority
    toggleSort() {
      if (this.isSortActive) {
        // If sorting is active, sort by item ID (original order)
        this.list.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        this.sorttext = "Sort by priority";
        this.isSortActive = false;
      } else {
        // If sorting is inactive, sort by priority
        this.list.sort((a, b) => parseInt(a.priority) - parseInt(b.priority));
        this.sorttext = "Clear Sort";
        this.isSortActive = true;
      }
    },
    // Re-sort the list if sorting is active after editing an item
    sortEditeddata() {
      if (this.isSortActive) {
        this.list.sort((a, b) => parseInt(a.priority) - parseInt(b.priority));
      }
    },
    // Method to add a new todo item to the list
    addItem() {
      if (this.userInput.trim() !== "") {
        const newItem = {
          id: Date.now(), // Unique ID based on the current timestamp
          value: this.userInput.trim(), // The value of the todo item
          priority: this.priority, // The priority of the todo item
        };
        this.list.push(newItem); // Add the new item to the list
        this.storedatatolocalstorage(this.list); // Save the updated list to localStorage
        this.clearInput(); // Clear the input fields after adding the item
      }
    },
    // Method to delete an item from the list
    deleteItem(index) {
      this.list.splice(index, 1); // Remove the item at the specified index
      this.storedatatolocalstorage(this.list); // Save the updated list to localStorage
    },
    // Method to save an edited item in the list
    saveEditItem(data) {
      this.list[data.index].value = data.value; // Update the value of the edited item
      this.list[data.index].priority = data.priority; // Update the priority of the edited item
      this.storedatatolocalstorage(this.list); // Save the updated list to localStorage
      this.sortEditeddata(); // Re-sort the list if sorting is active
    },
    // Method to clear the input fields after adding an item
    clearInput() {
      this.userInput = ""; // Clear the user input
      this.priority = ""; // Clear the priority input
    },
    // Method to clear the entire todo list
    clearItem() {
      this.list = []; // Clear the list array
      this.storedatatolocalstorage(this.list); // Save the empty list to localStorage
    },
    // Method to store the todo list in localStorage
    storedatatolocalstorage(data) {
      localStorage.setItem("data", JSON.stringify(data)); // Save the list as a JSON string
    },
    // Method to retrieve the todo list from localStorage
    getdatafromlocalstorage() {
      return JSON.parse(localStorage.getItem("data")); // Retrieve and parse the JSON string from localStorage
    },
  },
};
</script>
