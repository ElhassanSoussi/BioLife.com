document.addEventListener('DOMContentLoaded', () => {
  const postContentContainer = document.getElementById('post-content');
  const params = new URLSearchParams(window.location.search);
  const postSlug = params.get('slug');

  if (!postContentContainer) {
    return;
  }

  if (!postSlug) {
    postContentContainer.innerHTML = '<p>No post specified.</p>';
    return;
  }

  fetch('data/blog.json')
    .then(response => response.json())
    .then(posts => {
      const post = posts.find(p => p.slug === postSlug);
      if (post) {
        document.title = `${post.title} — Foireme`;
        postContentContainer.innerHTML = `
          <h1 class="post-full__title">${post.title}</h1>
          <p class="post-full__meta">By ${post.author} on ${new Date(post.date).toLocaleDateString()}</p>
          <img src="${post.image}" alt="${post.title}" class="post-full__image">
          <div class="post-full__content">${post.content}</div>
        `;
      } else {
        postContentContainer.innerHTML = '<p>Post not found.</p>';
      }
    })
    .catch(error => {
      console.error('Error fetching post:', error);
      postContentContainer.innerHTML = '<p>Could not load post. Please try again later.</p>';
    });
});
