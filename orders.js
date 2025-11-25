document.addEventListener('DOMContentLoaded', () => {
  const ordersList = document.getElementById('orders-list');

  fetch('/api/orders')
    .then(response => response.json())
    .then(orders => {
      if (!ordersList) return;

      const pendingOrders = orders
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      if (pendingOrders.length === 0) {
        ordersList.innerHTML = '<p>No orders found.</p>';
        return;
      }

      ordersList.innerHTML = `
        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Card Number</th>
                <th>Location</th>
                <th>Zip Code</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${pendingOrders.map(order => `
                <tr class="${order.status === 'shipment awaiting' ? 'status-pending' : order.status === 'shipped' ? 'status-shipped' : ''}">
                  <td>#${order.id}</td>
                  <td>${order.customer.name}</td>
                  <td>${order.customer.email}</td>
                  <td>${order.customer.phone}</td>
                  <td>${order.customer.address}</td>
                  <td>${order.customer.cardNumber}</td>
                  <td>${order.customer.location}</td>
                  <td>${order.customer.zipCode}</td>
                  <td>
                    <ul class="item-list">
                      ${order.items.map(item => `
                        <li>${item.name} &times; ${item.quantity}</li>
                      `).join('')}
                    </ul>
                  </td>
                  <td>$${order.total.toFixed(2)}</td>
                  <td>${new Date(order.date).toLocaleString()}</td>
                  <td>${order.status}</td>
                  <td><button class="btn-ship" data-order-id="${order.id}" ${order.status === 'shipment awaiting' ? '' : 'disabled'}>${order.status === 'shipment awaiting' ? 'Mark as Shipped' : 'Shipped'}</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      // Add event listener for ship button
      document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-ship') && !e.target.disabled) {
          const orderId = e.target.dataset.orderId;
          fetch(`/api/orders/${orderId}/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'shipped' })
          })
          .then(response => response.json())
          .then(() => {
            const row = e.target.closest('tr');
            row.classList.remove('status-pending');
            row.classList.add('status-shipped');
            e.target.disabled = true;
            e.target.textContent = 'Shipped';
            const statusTd = row.querySelector('td:nth-last-child(2)');
            statusTd.textContent = 'shipped';
          })
          .catch(error => console.error('Error updating status:', error));
        }
      });
    })
    .catch(error => {
      console.error('Error loading orders:', error);
      if (ordersList) {
        ordersList.innerHTML = '<p>Error loading orders. Please try again later.</p>';
      }
    });
});

