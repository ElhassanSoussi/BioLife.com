(() => {
  let products = [];
  const productListEl = document.getElementById('product-list');
  const modal = document.getElementById('product-modal');
  const addProductBtn = document.getElementById('add-product');
  const saveChangesBtn = document.getElementById('save-changes');
  const productForm = document.getElementById('product-form');
  const modalTitle = document.getElementById('modal-title');
  const imagePreview = document.getElementById('image-preview');
  const imageFileInput = document.getElementById('product-image-file');
  const categorySelect = document.getElementById('product-category');

  const resolveImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) {
      return path;
    }
    if (path.startsWith('/')) {
      return `http://localhost:3000${path}`;
    }
    return `http://localhost:3000/${path}`;
  };

  // Fetch initial data
  async function loadProducts() {
    try {
      const res = await fetch('http://localhost:3000/api/products', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load products');
      products = await res.json();
      renderProducts();
    } catch (err) {
      console.error('Error loading products:', err);
      alert('Could not load products. Make sure the server is running.');
    }
  }

  // Render product table
  function renderProducts() {
    if (!productListEl) return;
    productListEl.innerHTML = products.map(p => `
      <tr data-id="${p.id}">
        <td>
          <img src="${resolveImageUrl(p.image)}" alt="${p.alt || p.name}" class="product-thumb">
          <span class="product-name">${p.name}</span>
        </td>
        <td>$${p.price.toFixed(2)}</td>
        <td>${p.category || 'N/A'}</td>
        <td class="product-actions">
          <button class="btn btn--sm js-edit">Edit</button>
          <button class="btn btn--sm btn--danger js-delete">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  // Modal controls
  const openModal = () => modal.classList.add('is-open');
  const closeModal = () => modal.classList.remove('is-open');

  function populateCategoryDropdown() {
    if (categorySelect.tagName !== 'SELECT') return;

    const currentCategory = categorySelect.value; // Preserve selected value if any
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    categorySelect.innerHTML = '<option value="">Select a category</option>';
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      if (cat === currentCategory) {
        option.selected = true;
      }
      categorySelect.appendChild(option);
    });
    // Add option for creating a new category
    const newCategoryOption = document.createElement('option');
    newCategoryOption.value = '__new__';
    newCategoryOption.textContent = 'Add new category...';
    categorySelect.appendChild(newCategoryOption);
  }

  function showEditModal(product) {
    modalTitle.textContent = 'Edit Product';
    productForm.reset();
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-category').value = product.category || '';
    document.getElementById('product-alt').value = product.alt || '';
    
    populateCategoryDropdown(); // Populate dropdown
    document.getElementById('product-category').value = product.category || ''; // Re-select the product's category

    imagePreview.src = resolveImageUrl(product.image);
    imagePreview.style.display = product.image ? 'block' : 'none';
    openModal();
  }

  function showAddModal() {
    modalTitle.textContent = 'Add Product';
    productForm.reset();
    document.getElementById('product-id').value = '';
    
    populateCategoryDropdown();

    imagePreview.src = '';
    imagePreview.style.display = 'none';
    openModal();
  }

  // Event Listeners
  addProductBtn.addEventListener('click', showAddModal);
  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-dismiss]') || e.target.closest('[data-dismiss]')) {
      closeModal();
    }
  });

  categorySelect.addEventListener('change', () => {
    if (categorySelect.value === '__new__') {
      const newCategory = prompt('Enter new category name:');
      if (newCategory && newCategory.trim() !== '') {
        // Add it to the dropdown if it doesn't exist
        if (![...categorySelect.options].some(opt => opt.value === newCategory)) {
          const option = document.createElement('option');
          option.value = newCategory;
          option.textContent = newCategory;
          // Insert before the 'Add new' option
          categorySelect.insertBefore(option, categorySelect.querySelector('option[value="__new__"]'));
        }
        categorySelect.value = newCategory;
      } else {
        // Reset to 'Select a category' if user cancels or enters empty name
        categorySelect.value = '';
      }
    }
  });

  imageFileInput.addEventListener('change', async () => {
    const file = imageFileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Image upload failed');

      const data = await res.json();
      document.getElementById('product-image').value = data.imageUrl;
      imagePreview.src = resolveImageUrl(data.imageUrl);
      imagePreview.style.display = 'block';
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Image upload failed. Please try again.');
    }
  });

  // Handle form submission (Add/Edit)
  productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('product-id').value;
    const productData = {
      id: id || `p${Date.now()}`,
      name: document.getElementById('product-name').value,
      price: parseFloat(document.getElementById('product-price').value),
      image: document.getElementById('product-image').value,
      category: document.getElementById('product-category').value,
      alt: document.getElementById('product-alt').value,
      // Preserve other fields that are not in the form
      tags: [],
      rating: 0,
      reviews: 0,
      skin: ["all"]
    };

    if (id) { // Editing existing product
      const index = products.findIndex(p => p.id === id);
      if (index > -1) {
        const existingProduct = products[index];
        products[index] = { ...existingProduct, ...productData };
      }
    } else { // Adding new product
      products.unshift(productData);
    }

    renderProducts();
    closeModal();
    showSaveButton();
  });

  // Handle product deletion
  productListEl.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (!row) return;
    const id = row.dataset.id;

    if (e.target.matches('.js-edit')) {
      const product = products.find(p => p.id === id);
      if (product) showEditModal(product);
    }

    if (e.target.matches('.js-delete')) {
      if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        renderProducts();
        showSaveButton();
      }
    }
  });

  // Save changes to server
  async function saveChanges() {
    try {
      const res = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products, null, 2)
      });
      if (!res.ok) throw new Error('Failed to save products');
      alert('Products saved successfully!');
      hideSaveButton();
    } catch (err) {
      console.error('Error saving products:', err);
      alert('Could not save products. Please check the console and make sure the server is running.');
    }
  }

  saveChangesBtn.addEventListener('click', saveChanges);

  function showSaveButton() {
    saveChangesBtn.classList.add('is-visible');
  }

  function hideSaveButton() {
    saveChangesBtn.classList.remove('is-visible');
  }

  // Initial load
  loadProducts();
})();
