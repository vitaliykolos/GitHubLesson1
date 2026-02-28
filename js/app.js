// ===== Blog Front-End =====

(function () {
  const blogGrid = document.getElementById("blog-grid");
  const listView = document.getElementById("blog-list-view");
  const detailView = document.getElementById("post-detail-view");
  const backBtn = document.getElementById("back-to-list");

  function formatDate(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  function getInitials(name) {
    return name.split(" ").map(w => w[0]).join("").toUpperCase();
  }

  function renderPostCard(post) {
    const card = document.createElement("article");
    card.className = "card";
    card.style.cursor = "pointer";
    card.innerHTML = `
      <div class="card__body">
        <span class="card__tag">${post.category}</span>
        <h2 class="card__title">${post.title}</h2>
        <p class="card__excerpt">${post.excerpt}</p>
        <div class="card__meta">
          <div class="card__author">
            <div class="card__avatar">${getInitials(post.author)}</div>
            <span>${post.author}</span>
          </div>
          <span>${formatDate(post.date)}</span>
        </div>
      </div>
    `;
    card.addEventListener("click", () => showPost(post.id));
    return card;
  }

  function renderBlog() {
    const posts = getPublishedPosts();
    blogGrid.innerHTML = "";

    if (posts.length === 0) {
      blogGrid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <h3>No posts yet</h3>
          <p>Head to the <a href="dashboard.html">dashboard</a> to create your first post.</p>
        </div>`;
      return;
    }

    posts
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach(post => blogGrid.appendChild(renderPostCard(post)));
  }

  function showPost(id) {
    const post = getPostById(id);
    if (!post) return;

    document.getElementById("detail-tag").textContent = post.category;
    document.getElementById("detail-title").textContent = post.title;
    document.getElementById("detail-author").textContent = post.author;
    document.getElementById("detail-date").textContent = formatDate(post.date);
    document.getElementById("detail-content").innerHTML = post.content;

    listView.style.display = "none";
    detailView.style.display = "block";
    window.scrollTo(0, 0);

    // Track view
    updatePost(id, { views: post.views + 1 });
  }

  function showList() {
    detailView.style.display = "none";
    listView.style.display = "block";
    renderBlog();
  }

  backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showList();
  });

  // Handle browser back/forward
  window.addEventListener("hashchange", () => {
    const id = parseInt(location.hash.replace("#post-", ""));
    if (id) {
      showPost(id);
    } else {
      showList();
    }
  });

  // Initial render
  renderBlog();
})();
