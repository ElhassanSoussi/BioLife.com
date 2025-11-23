document.addEventListener('DOMContentLoaded', () => {
  const postsContainer = document.getElementById('posts-container');

  if (postsContainer) {
    fetch('data/blog.json')
      .then(response => response.json())
      .then(posts => {
        if (posts.length > 0) {
          postsContainer.innerHTML = '';
          posts.forEach(post => {
            const postElement = document.createElement('a');
            postElement.href = `post.html?slug=${post.slug}`;
            postElement.classList.add('post-card');
            postElement.innerHTML = `
              <img src="${post.image}" alt="" class="post-card__image">
              <div class="post-card__content">
                <h2 class="post-card__title">${post.title}</h2>
                <p class="post-card__excerpt">${post.excerpt}</p>
                <span class="post-card__author">By ${post.author}</span>
                <span class="post-card__date">${new Date(post.date).toLocaleDateString()}</span>
              </div>
            `;
            postsContainer.appendChild(postElement);
          });
        } else {
          postsContainer.innerHTML = '<p>No posts yet. Check back soon!</p>';
        }
      })
      .catch(error => {
        console.error('Error fetching blog posts:', error);
        postsContainer.innerHTML = '<p>Could not load blog posts. Please try again later.</p>';
      });
  }
});
