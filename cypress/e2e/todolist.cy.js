describe('Todo List Application', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/'); // Change to the URL where your app is running
    });
  
    it('should allow a user to add a todo item', () => {
      cy.get('input[placeholder="Add item..."]').first().type('New Todo Item');
      cy.get('select').first().select('1'); // Select 'Critical' priority
      cy.get('button.btn-success').click();
  
      cy.get('.list-group-item').should('have.length', 1);
      cy.get('.list-group-item').contains('New Todo Item');
    });
  
    it('should allow a user to delete a todo item', () => {
      // First, add an item to delete
      cy.get('input[placeholder="Add item..."]').first().type('Item to Delete');
      cy.get('select').first().select('2'); // Select 'Moderate' priority
      cy.get('button.btn-success').click();
  
      cy.get('.bi-trash-fill').first().click();
  
      cy.get('.list-group-item').should('have.length', 0);
    });
  
    it('should allow a user to edit a todo item', () => {
      // First, add an item to edit
      cy.get('input[placeholder="Add item..."]').first().type('Editable Todo');
      cy.get('select').first().select('3'); // Select 'Optional' priority
      cy.get('button.btn-success').click();
  
      cy.get('.bi-pencil').first().click();
      cy.get('input#editItem').first().type('Edited Todo Item');
      cy.get('select#editPriority').first().select('1'); // Change priority to 'Critical'
      cy.get('button#updatebtn').click();
      cy.get('.list-group-item').should('contain', 'Edited Todo Item');
      cy.get('.badge').should('contain', 'Critical'); // Retry for the priority badge

    });
  
    it('should allow a user to clear the todo list', () => {
      cy.get('input[placeholder="Add item..."]').first().type('Item 1');
      cy.get('select').first().select('2');
      cy.get('button.btn-success').click();
  
      cy.get('input[placeholder="Add item..."]').first().type('Item 2');
      cy.get('select').first().select('1');
      cy.get('button.btn-success').click();
  
      cy.get('button.btn-primary').contains('Clear List').click();
      cy.get('.list-group-item').should('have.length', 0);
    });
  
    it('should disable the Add Item button when inputs are invalid', () => {
      cy.get('button.btn-success').should('be.disabled');
  
      cy.get('input[placeholder="Add item..."]').first().type('Valid Todo');
      cy.get('button.btn-success').should('be.disabled');
  
      cy.get('select').first().select('1'); // Select 'Critical'
      cy.get('button.btn-success').should('not.be.disabled');
    });
  
    it('should retain todo items in local storage', () => {
      cy.get('input[placeholder="Add item..."]').first().type('Persistent Todo');
      cy.get('select').first().select('1');
      cy.get('button.btn-success').click();
  
      // Refresh the page to check local storage persistence
      cy.reload();
  
      cy.get('.list-group-item').should('have.length', 1);
      cy.get('.list-group-item').contains('Persistent Todo');
    });
    it('should sort items by priority', () => {
        // Add multiple items with different priorities
        cy.get('input[placeholder="Add item..."]').first().type('Low Priority Item');
        cy.get('select').first().select('3'); // 'optional' priority
        cy.get('button.btn-success').click();
    
        cy.get('input[placeholder="Add item..."]').first().type('High Priority Item');
        cy.get('select').first().select('1'); // 'critical' priority
        cy.get('button.btn-success').click();
    
        cy.get('input[placeholder="Add item..."]').first().type('Medium Priority Item');
        cy.get('select').first().select('2'); // 'moderate' priority
        cy.get('button.btn-success').click();
    
        // Ensure all items are added
        cy.get('.list-group-item').should('contain', 'Low Priority Item');
        cy.get('.list-group-item').should('contain', 'High Priority Item');
        cy.get('.list-group-item').should('contain', 'Medium Priority Item');
    
        // Click the 'Sort by priority' button
        cy.get('button.btn-outline-info').click();
    
        // Ensure the items are sorted by priority (Critical > Moderate > Optional)
        cy.get('.list-group-item').first().should('contain', 'High Priority Item');
        cy.get('.list-group-item').eq(1).should('contain', 'Medium Priority Item');
        cy.get('.list-group-item').last().should('contain', 'Low Priority Item');
    
        // Toggle the sort again (to unsorted)
        cy.get('button.btn-outline-info').click();
        cy.get('.list-group-item').should('contain', 'Low Priority Item');
        cy.get('.list-group-item').should('contain', 'High Priority Item');
        cy.get('.list-group-item').should('contain', 'Medium Priority Item');
      });
      it('should allow a user to clear the to-do list', () => {
        // Add a new item
        cy.get('input[placeholder="Add item..."]').first().type('New Todo Item');
        cy.get('select').first().select('2'); // Select 'moderate' priority
        cy.get('button.btn-success').click();
    
        // Clear the list
        cy.get('button.btn-primary.mb-2.me-2').click({ force: true });
    
        // Ensure the list is empty
        cy.get('.list-group-item').should('not.exist');
      });
  });
  