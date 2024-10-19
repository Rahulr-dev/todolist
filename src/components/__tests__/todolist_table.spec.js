import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TodoListTable from '@/components/todolist_table.vue'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { Modal } from 'bootstrap'

// Mock Bootstrap's Modal function
vi.mock('bootstrap', () => ({
  Modal: vi.fn().mockImplementation(() => ({
    show: vi.fn(),
    hide: vi.fn(),
  })),
}))

describe('TodoListTable.vue', () => {
  let wrapper
  let mockTodoList

  beforeEach(() => {
    mockTodoList = [
      { value: 'Buy groceries', priority: 'high' },
      { value: 'Take out trash', priority: 'medium' },
    ]

    wrapper = mount(TodoListTable, {
      props: {
        todoList: mockTodoList,
      },
    })
  })

  it('opens the edit modal when the edit button is clicked', async () => {
    const editButton = wrapper.find('.bi-pencil')
    await editButton.trigger('click')

    expect(Modal).toHaveBeenCalled()
    expect(wrapper.vm.editModal.show).toHaveBeenCalled()
  })

  it('populates the form with the selected item\'s data when editing', async () => {
    await wrapper.vm.editItem(0)

    expect(wrapper.vm.selecteduserInput).toBe('Buy groceries')
    expect(wrapper.vm.selectedpriority).toBe('high')
  })

  it('emits "saveEditItem" with the correct data when saving changes', async () => {
    await wrapper.vm.editItem(0)

    wrapper.vm.selecteduserInput = 'Buy milk'
    wrapper.vm.selectedpriority = 'low'

    await wrapper.vm.saveEditItem()

    expect(wrapper.emitted().saveEditItem).toBeTruthy()
    expect(wrapper.emitted().saveEditItem[0][0]).toEqual({
      index: 0,
      value: 'Buy milk',
      priority: 'low',
    })
    expect(wrapper.vm.editModal.hide).toHaveBeenCalled()
  })

  it('emits "deleteItem" when the delete button is clicked', async () => {
    const deleteButton = wrapper.find('.bi-trash-fill')
    await deleteButton.trigger('click')

    expect(wrapper.emitted().deleteItem).toBeTruthy()
    expect(wrapper.emitted().deleteItem[0][0]).toBe(0)
  })

  it('closes the modal when "Save changes" is clicked', async () => {
    await wrapper.vm.editItem(0)
    const saveButton = wrapper.find('#updatebtn')
    await saveButton.trigger('click')

    expect(wrapper.vm.editModal.hide).toHaveBeenCalled()
  })
})
