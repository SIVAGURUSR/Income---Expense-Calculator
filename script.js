document.addEventListener('DOMContentLoaded', () => {
    const entriesList = document.getElementById('entries-list');
    const totalIncomeElem = document.getElementById('total-income');
    const totalExpenseElem = document.getElementById('total-expense');
    const netBalanceElem = document.getElementById('net-balance');
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
  
    // Income/Expense Modal
    const incomeModal = document.getElementById('income-modal');
    const expenseModal = document.getElementById('expense-modal');
    const addIncomeBtn = document.getElementById('add-income-btn');
    const addExpenseBtn = document.getElementById('add-expense-btn');
    const closeIncomeModal = document.getElementById('close-income-modal');
    const closeExpenseModal = document.getElementById('close-expense-modal');
  
    let isEdit = false;
    let editId = null;
  
    // Event: Open Modals
    addIncomeBtn.addEventListener('click', () => {
      showModal(incomeModal);
      isEdit = false;
    });
  
    addExpenseBtn.addEventListener('click', () => {
      showModal(expenseModal);
      isEdit = false;
    });
  
    // Event: Close Modals
    closeIncomeModal.addEventListener('click', () => hideModal(incomeModal));
    closeExpenseModal.addEventListener('click', () => hideModal(expenseModal));
  
    // Event: Add/Edit Income
    document.getElementById('income-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const description = document.getElementById('income-description').value;
      const amount = parseFloat(document.getElementById('income-amount').value);
      const type = 'income';
  
      if (description && !isNaN(amount)) {
        if (isEdit) {
          updateEntry(editId, description, amount, type);
        } else {
          const newEntry = { id: Date.now(), description, amount, type };
          entries.push(newEntry);
        }
        localStorage.setItem('entries', JSON.stringify(entries));
        displayEntries(entries);
        hideModal(incomeModal);
        resetForm('income-form');
      }
    });
  
    // Event: Add/Edit Expense
    document.getElementById('expense-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const description = document.getElementById('expense-description').value;
      const amount = parseFloat(document.getElementById('expense-amount').value);
      const type = 'expense';
  
      if (description && !isNaN(amount)) {
        if (isEdit) {
          updateEntry(editId, description, amount, type);
        } else {
          const newEntry = { id: Date.now(), description, amount, type };
          entries.push(newEntry);
        }
        localStorage.setItem('entries', JSON.stringify(entries));
        displayEntries(entries);
        hideModal(expenseModal);
        resetForm('expense-form');
      }
    });
  
    // Function: Display Entries
    function displayEntries(entriesToDisplay) {
      entriesList.innerHTML = ''; // Clear previous entries
      let totalIncome = 0;
      let totalExpense = 0;
  
      entriesToDisplay.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.className = 'flex justify-between mb-2';
        listItem.innerHTML = `
          <span>${entry.description} - ₹${entry.amount.toFixed(2)} (${entry.type})</span>
          <span>
            <button data-id="${entry.id}" class="edit bg-yellow-500 text-white p-1 rounded"><i class="material-symbols-rounded">Edit</i></button>
            <button data-id="${entry.id}" class="delete bg-red-500 text-white p-1 rounded"><i class="material-symbols-rounded">Delete</i></button>
          </span>
        `;
        entriesList.appendChild(listItem);
  
        if (entry.type === 'income') {
          totalIncome += entry.amount;
        } else {
          totalExpense += entry.amount;
        }
      });
  
      totalIncomeElem.textContent = `₹${totalIncome.toFixed(2)}`;
      totalExpenseElem.textContent = `₹${totalExpense.toFixed(2)}`;
      netBalanceElem.textContent = `₹${(totalIncome - totalExpense).toFixed(2)}`;
  
      // Attach event listeners to edit and delete buttons
      document.querySelectorAll('.edit').forEach(button => {
        button.addEventListener('click', (e) => handleEdit(e.target.closest('button').dataset.id));
      });
  
      document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', (e) => handleDelete(e.target.closest('button').dataset.id));
      });
    }
  
    // Function: Edit Entry
    function handleEdit(id) {
      const entryToEdit = entries.find(entry => entry.id == id);
      if (entryToEdit.type === 'income') {
        document.getElementById('income-description').value = entryToEdit.description;
        document.getElementById('income-amount').value = entryToEdit.amount;
        showModal(incomeModal);
      } else {
        document.getElementById('expense-description').value = entryToEdit.description;
        document.getElementById('expense-amount').value = entryToEdit.amount;
        showModal(expenseModal);
      }
      isEdit = true;
      editId = id;
    }
  
    // Function: Update Entry
    function updateEntry(id, description, amount, type) {
      const index = entries.findIndex(entry => entry.id == id);
      if (index !== -1) {
        entries[index] = { id, description, amount, type };
        localStorage.setItem('entries', JSON.stringify(entries));
      }
    }
  
    // Function: Delete Entry
    function handleDelete(id) {
      entries = entries.filter(entry => entry.id != id);
      localStorage.setItem('entries', JSON.stringify(entries));
      displayEntries(entries);
    }
  
    // Function: Filter Entries
    document.querySelectorAll('input[name="filter"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const filterValue = e.target.value;
        let filteredEntries;
  
        if (filterValue === 'all') {
          filteredEntries = entries;
        } else if (filterValue === 'income') {
          filteredEntries = entries.filter(entry => entry.type === 'income');
        } else if (filterValue === 'expense') {
          filteredEntries = entries.filter(entry => entry.type === 'expense');
        }
  
        displayEntries(filteredEntries);
      });
    });
  
    // Function: Show Modal
    function showModal(modal) {
      modal.classList.remove('hidden');
      modal.querySelector('.modal-enter').classList.add('modal-enter-active');
    }
  
    // Function: Hide Modal
    function hideModal(modal) {
      const modalContent = modal.querySelector('.modal-enter');
      modalContent.classList.add('modal-leave-active');
      setTimeout(() => {
        modal.classList.add('hidden');
        modalContent.classList.remove('modal-enter-active', 'modal-leave-active');
      }, 300);
    }
  
    // Function: Reset Form
    function resetForm(formId) {
      document.getElementById(formId).reset();
    }
  
    // Initial Display
    displayEntries(entries);
  });
  