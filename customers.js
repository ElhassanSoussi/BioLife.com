document.addEventListener('DOMContentLoaded', () => {
  const customersList = document.getElementById('customers-list');

  fetch('/api/customers')
    .then(response => response.json())
    .then(customers => {
      if (!customersList) return;

      if (customers.length === 0) {
        customersList.innerHTML = '<p>No customers found.</p>';
        return;
      }

      customersList.innerHTML = `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Total Items</th>
              <th>Total Spent</th>
              <th>Purchase History</th>
            </tr>
          </thead>
          <tbody>
            ${customers.map(customer => `
              <tr>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.totalItems}</td>
                <td>$${customer.totalSpent.toFixed(2)}</td>
                <td>
                  <ul class="item-list">
                    ${customer.purchaseHistory.map(item => `
                      <li>${item.name} &times; ${item.quantity}</li>
                    `).join('')}
                  </ul>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    })
    .catch(error => {
      console.error('Error loading customers:', error);
      if (customersList) {
        customersList.innerHTML = '<p>Error loading customers. Please try again later.</p>';
      }
    });
});
