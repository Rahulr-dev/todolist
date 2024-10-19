import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TodoList from '@/components/todolist.vue'


vi.mock('bootstrap', () => ({
    Modal: vi.fn().mockImplementation(() => ({
      show: vi.fn(),
      hide: vi.fn(),
      _initializeBackDrop: vi.fn(),
    })),
  }));
  
  describe('TodoList.vue', () => {
    let wrapper;
  
    beforeEach(() => {
      localStorage.clear(); // Clear localStorage before each test
      wrapper = mount(TodoList);
    });
  
    it('renders the title correctly', () => {
      expect(wrapper.find('.title').text()).toBe('TODO LIST');
    });
  
    it('disables the Add Item button if inputs are empty', async () => {
        // Ensure the button is disabled initially
        expect(wrapper.find('button.btn-success').attributes('disabled')).toBe('');
      
        // Now set user input and priority to valid values
        await wrapper.setData({ userInput: 'Test Item', priority: '1' });
      
        // The button should now be enabled
        expect(wrapper.vm.isAddbtnEnabled).toBe(false);
      
        // The button should not have the disabled attribute
        expect(wrapper.find('button.btn-success').attributes('disabled')).toBeUndefined(); 
      });
  
    it('adds a new item to the list when addItem is called', async () => {
      wrapper.setData({ userInput: 'New Task', priority: '2' });
      await wrapper.vm.addItem();
      expect(wrapper.vm.list).toHaveLength(1);
      expect(wrapper.vm.list[0].value).toBe('New Task');
      expect(wrapper.vm.list[0].priority).toBe('2');
    });
  
    it('clears the input fields after adding an item', async () => {
      wrapper.setData({ userInput: 'New Task', priority: '2' });
      await wrapper.vm.addItem();
      expect(wrapper.vm.userInput).toBe('');
      expect(wrapper.vm.priority).toBe('');
    });
  
    it('deletes an item from the list', async () => {
      wrapper.setData({ list: [{ id: 1, value: 'Task 1', priority: '1' }] });
      await wrapper.vm.deleteItem(0);
      expect(wrapper.vm.list).toHaveLength(0);
    });
  
    it('clears the entire list', async () => {
      wrapper.setData({ list: [{ id: 1, value: 'Task 1', priority: '1' }] });
      await wrapper.vm.clearItem();
      expect(wrapper.vm.list).toHaveLength(0);
    });
  
    it('toggles sorting of the list by priority', async () => {
      wrapper.setData({ list: [{ id: 1, value: 'Task 1', priority: '2' }, { id: 2, value: 'Task 2', priority: '1' }] });
      
      await wrapper.vm.toggleSort();
      expect(wrapper.vm.sorttext).toBe('Clear Sort');
      expect(wrapper.vm.list[0].value).toBe('Task 2'); // Check if it sorted by priority correctly
  
      await wrapper.vm.toggleSort();
      expect(wrapper.vm.sorttext).toBe('Sort by priority');
      expect(wrapper.vm.list[0].value).toBe('Task 1'); // Check if it reverted to original order
    });
  
    it('retrieves data from localStorage on mount', () => {
      localStorage.setItem('data', JSON.stringify([{ id: 1, value: 'Task 1', priority: '1' }]));
      wrapper = mount(TodoList);
      expect(wrapper.vm.list).toHaveLength(1);
      expect(wrapper.vm.list[0].value).toBe('Task 1');
    });
  
    it('stores data to localStorage when an item is added', async () => {
        wrapper.setData({ userInput: 'New Task', priority: '2' });
        await wrapper.vm.addItem();
        const storedData = JSON.parse(localStorage.getItem('data'));
        expect(storedData).toHaveLength(1); // Check for length 1 after adding
        expect(storedData[0].value).toBe('New Task');
        expect(storedData[0].priority).toBe('2');
    });
  });