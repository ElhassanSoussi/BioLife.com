(() => {
  let promos = {};
  const heroForm = document.getElementById('hero-form');
  const heroTitleInput = document.getElementById('hero-title');
  const heroSubtitleInput = document.getElementById('hero-subtitle');
  const heroBackgroundInput = document.getElementById('hero-background');
  const heroImagesList = document.getElementById('hero-images-list');
  const addHeroImageInput = document.getElementById('add-hero-image');
  const saveChangesBtn = document.getElementById('save-changes');

  const pageTitleInput = document.getElementById('page-title');
  const pageDescriptionInput = document.getElementById('page-description');

  const resolveImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('/')) {
      return path;
    }
    return `http://localhost:3000/${path}`;
  };

  async function loadPromos() {
    try {
      const res = await fetch('http://localhost:3000/api/promos', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load promotions');
      promos = await res.json();
      renderForms();
    } catch (err) {
      console.error('Error loading promotions:', err);
      alert('Could not load promotions. Make sure the server is running.');
    }
  }

  function renderForms() {
    const heroConfig = promos.homepage_hero || {};
    heroTitleInput.value = heroConfig.title || '';
    heroSubtitleInput.value = heroConfig.subtitle || '';
    heroBackgroundInput.value = heroConfig.background || '';

    if (heroConfig.images && heroImagesList) {
      heroImagesList.innerHTML = heroConfig.images.map((img, index) => `
        <div class="image-list-item" data-index="${index}">
          <img src="${resolveImageUrl(img.src)}" alt="Hero image ${index + 1}">
          <button class="remove-btn" data-index="${index}">×</button>
        </div>
      `).join('');
    }

    pageTitleInput.value = promos.page_title || '';
    pageDescriptionInput.value = promos.page_description || '';
  }

  async function addHeroImage() {
    const file = addHeroImageInput.files[0];
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
      if (!promos.homepage_hero) {
        promos.homepage_hero = {};
      }
      if (!promos.homepage_hero.images) {
        promos.homepage_hero.images = [];
      }
      promos.homepage_hero.images.push({ src: data.imageUrl });
      renderForms();
      showSaveButton();
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Image upload failed. Please try again.');
    }
  }

  function removeHeroImage(index) {
    if (promos.homepage_hero && promos.homepage_hero.images) {
      promos.homepage_hero.images.splice(index, 1);
      renderForms();
      showSaveButton();
    }
  }

  async function saveChanges() {
    if (!promos.homepage_hero) {
      promos.homepage_hero = {};
    }
    promos.homepage_hero.title = heroTitleInput.value;
    promos.homepage_hero.subtitle = heroSubtitleInput.value;
    promos.homepage_hero.background = heroBackgroundInput.value;
    if (!promos.homepage_hero.images) {
      promos.homepage_hero.images = [];
    }
    promos.page_title = pageTitleInput.value;
    promos.page_description = pageDescriptionInput.value;

    try {
      const res = await fetch('http://localhost:3000/api/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promos, null, 2)
      });
      if (!res.ok) throw new Error('Failed to save promotions');
      alert('Promotions saved successfully!');
      hideSaveButton();
    } catch (err) {
      console.error('Error saving promotions:', err);
      alert('Could not save promotions. Please check the console and make sure the server is running.');
    }
  }

  function showSaveButton() {
    saveChangesBtn.classList.add('is-visible');
  }

  function hideSaveButton() {
    saveChangesBtn.classList.remove('is-visible');
  }

  function init() {
    loadPromos();
    heroForm.addEventListener('input', showSaveButton);
    addHeroImageInput.addEventListener('change', addHeroImage);
    heroImagesList.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-btn')) {
        const index = parseInt(e.target.dataset.index, 10);
        removeHeroImage(index);
      }
    });
    saveChangesBtn.addEventListener('click', saveChanges);
    pageTitleInput.addEventListener('input', showSaveButton);
    pageDescriptionInput.addEventListener('input', showSaveButton);
    heroBackgroundInput.addEventListener('input', showSaveButton);
  }

  init();
})();
