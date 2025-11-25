(() => {
  let promos = {};
  const backgroundForm = document.getElementById('background-form');
  const heroBackgroundInput = document.getElementById('hero-background');
  const heroBackgroundImageInput = document.getElementById('hero-background-image');
  const heroBackgroundImagePreview = document.getElementById('hero-background-image-preview');
  const saveChangesBtn = document.getElementById('save-changes');

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
    heroBackgroundInput.value = heroConfig.background || '';

    if (heroConfig.background_image_url) {
      heroBackgroundImagePreview.innerHTML = `
        <div class="image-list-item">
          <img src="${resolveImageUrl(heroConfig.background_image_url)}" alt="Hero background image">
        </div>
      `;
    } else {
      heroBackgroundImagePreview.innerHTML = '';
    }
  }

  async function addHeroBackgroundImage() {
    const file = heroBackgroundImageInput.files[0];
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
      promos.homepage_hero.background_image_url = data.imageUrl;
      promos.homepage_hero.background = ''; // Clear background color when image is set
      renderForms();
      showSaveButton();
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Image upload failed. Please try again.');
    }
  }

  async function saveChanges() {
    if (!promos.homepage_hero) {
      promos.homepage_hero = {};
    }
    promos.homepage_hero.background = heroBackgroundInput.value;
    if (heroBackgroundInput.value) {
      promos.homepage_hero.background_image_url = ''; // Clear background image if color is set
    }

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
    backgroundForm.addEventListener('input', showSaveButton);
    heroBackgroundImageInput.addEventListener('change', addHeroBackgroundImage);
    saveChangesBtn.addEventListener('click', saveChanges);
  }

  init();
})();
