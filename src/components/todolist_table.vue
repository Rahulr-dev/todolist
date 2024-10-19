<template>
  <!-- Modal for editing a to-do item -->
  <div class="modal fade" id="editModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal header with title and close button -->
        <div class="modal-header">
          <h5 class="modal-title">Edit Todo Item</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <!-- Modal body containing the form for editing a to-do item and its priority -->
        <div class="modal-body">
          <form class="row g-2">
            <!-- Input field for editing the to-do item text -->
            <div class="col-auto w-100">
              <label>Todo Item</label>
              <input
                id="editItem"
                type="text"
                class="form-control"
                placeholder="Add item..."
                v-model="selecteduserInput"
                @keyup.enter="addItem" 
              />
            </div>
            <!-- Dropdown for selecting the priority of the to-do item -->
            <div class="col-auto w-100">
              <label>Priority</label>
              <select
                class="form-select"
                v-model="selectedpriority"
                id="editPriority"
              >
                <option value="">Select Priority</option>
                <option v-for="(value, key) in priority_list" :key="key" :value="key">
                  {{ value }}
                </option>
              </select>
            </div>
          </form>
        </div>
        <!-- Modal footer with buttons to close or save changes -->
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            id="updatebtn"
            type="button"
            class="btn btn-primary"
            @click="saveEditItem" 
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Display the list of to-do items -->
  <ul class="list-group">
    <li
      class="list-group-item d-flex justify-content-between align-items-end"
      v-for="(item, index) in todoList"
      :key="index"
    >
      <!-- Display the to-do item text and its priority as a badge -->
      <div class="item-text">
        {{ item.value }}
        <span class="badge text-bg-primary rounded-pill">{{
          priority_list[item.priority]
        }}</span>
      </div>
      <!-- Icons for editing and deleting the to-do item -->
      <div class="item-icon">
        <i class="bi bi-pencil me-2 cursor-pointer" @click="editItem(index)"></i>
        <i class="bi bi-trash-fill cursor-pointer" @click="deleteItem(index)"></i>
      </div>
    </li>
  </ul>
</template>

<script>
import { Modal } from 'bootstrap' // Import Bootstrap's modal functionality
import { priority_list } from '../constants/constants.js' // Import priority 

export default {
  name: 'TodoListTable',
  emits: ['deleteItem', 'saveEditItem'], // Define events emitted to parent component
  props: {
    todoList: Object, // Expect todoList as a prop from the parent component
  },
  data() {
    return {
      selecteduserInput: '', // The currently selected to-do item input text
      selectedpriority: '', // The currently selected to-do item priority
      selectedIndex: '', // Index of the currently selected to-do item
      editModal: null, // Modal instance for the edit form
      priority_list: priority_list, // Priority label
    }
  },
  mounted() {
    // Initialize Bootstrap modal when the component is mounted
    this.editModal = new Modal(document.getElementById('editModal'), {
      keyboard: false,
    })
  },
  methods: {
    // Emit the 'deleteItem' event to the parent component
    deleteItem(index) {
      this.$emit('deleteItem', index)
    },
    // Show the modal for editing and populate it with the selected item's data
    editItem(index) {
      this.editModal.show()
      this.selecteduserInput = this.todoList[index].value
      this.selectedpriority = this.todoList[index].priority
      this.selectedIndex = index
    },
    // Save the edited item and emit the 'saveEditItem' event to the parent component
    saveEditItem() {
      const data = {
        index: this.selectedIndex, // Index of the item being edited
        value: this.selecteduserInput, // Updated text value
        priority: this.selectedpriority, // Updated priority value
      }
      this.editModal.hide() // Hide the modal after saving
      this.$emit('saveEditItem', data) // Emit save event with updated data
    },
  },
}
</script>
