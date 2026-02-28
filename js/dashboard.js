// ===== Dashboard Logic =====

(function () {
  // --- Section Navigation ---
  const sidebarLinks = document.querySelectorAll("[data-section]");
  const sections = {
    overview: document.getElementById("section-overview"),
    posts: document.getElementById("section-posts"),
    analytics: document.getElementById("section-analytics")
  };

  function switchSection(name) {
    Object.values(sections).forEach(s => (s.style.display = "none"));
    sections[name].style.display = "block";

    sidebarLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("data-section") === name);
    });

    if (name === "overview") renderOverview();
    if (name === "posts") renderPostsTable();
    if (name === "analytics") renderAnalytics();
  }

  sidebarLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      switchSection(link.getAttribute("data-section"));
    });
  });

  // --- Helpers ---
  function formatDate(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // --- Overview ---
  function renderOverview() {
    const stats = getStats();

    document.getElementById("stats-grid").innerHTML = `
      <div class="stat-card">
        <div class="stat-card__label">Total Posts</div>
        <div class="stat-card__value">${stats.totalPosts}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">Published</div>
        <div class="stat-card__value">${stats.published}</div>
        <div class="stat-card__change stat-card__change--up">Active</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">Drafts</div>
        <div class="stat-card__value">${stats.drafts}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">Total Views</div>
        <div class="stat-card__value">${stats.totalViews.toLocaleString()}</div>
        <div class="stat-card__change stat-card__change--up">+12% this week</div>
      </div>
    `;

    // Weekly chart
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklyData = [145, 232, 189, 312, 278, 165, 210];
    const maxVal = Math.max(...weeklyData);

    document.getElementById("chart-weekly").innerHTML = weeklyData
      .map((val, i) => `
        <div class="chart-bar" style="height:${(val / maxVal) * 100}%;">
          <span class="chart-bar__value">${val}</span>
          <span class="chart-bar__label">${days[i]}</span>
        </div>
      `).join("");

    // Recent posts table
    const posts = getAllPosts().slice(0, 5);
    document.getElementById("recent-posts-table").innerHTML = posts
      .map(p => `
        <tr>
          <td><strong>${escapeHtml(p.title)}</strong></td>
          <td><span class="badge badge--${p.status}">${p.status}</span></td>
          <td>${formatDate(p.date)}</td>
          <td>${p.views.toLocaleString()}</td>
        </tr>
      `).join("");
  }

  // --- Posts Management ---
  function renderPostsTable() {
    const posts = getAllPosts();
    const tbody = document.getElementById("all-posts-table");

    if (posts.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="6">
          <div class="empty-state">
            <h3>No posts yet</h3>
            <p>Click "New Post" to create your first post.</p>
          </div>
        </td></tr>`;
      return;
    }

    tbody.innerHTML = posts.map(p => `
      <tr>
        <td><strong>${escapeHtml(p.title)}</strong></td>
        <td><span class="card__tag">${p.category}</span></td>
        <td><span class="badge badge--${p.status}">${p.status}</span></td>
        <td>${formatDate(p.date)}</td>
        <td>${p.views.toLocaleString()}</td>
        <td>
          <button class="btn btn--outline btn--sm" onclick="editPost(${p.id})">Edit</button>
          <button class="btn btn--danger btn--sm" onclick="confirmDelete(${p.id}, '${escapeHtml(p.title).replace(/'/g, "\\'")}')">Delete</button>
        </td>
      </tr>
    `).join("");
  }

  // --- Post Modal ---
  const postModal = document.getElementById("post-modal");
  const deleteModal = document.getElementById("delete-modal");
  let deleteTargetId = null;

  function openPostModal(post) {
    document.getElementById("modal-title").textContent = post ? "Edit Post" : "New Post";
    document.getElementById("post-id").value = post ? post.id : "";
    document.getElementById("post-title").value = post ? post.title : "";
    document.getElementById("post-category").value = post ? post.category : "Technology";
    document.getElementById("post-excerpt").value = post ? post.excerpt : "";
    document.getElementById("post-content").value = post ? stripHtml(post.content) : "";
    document.getElementById("post-status").value = post ? post.status : "published";
    postModal.classList.add("open");
  }

  function closePostModal() {
    postModal.classList.remove("open");
  }

  function stripHtml(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  function wrapContentInParagraphs(text) {
    return text
      .split("\n\n")
      .filter(p => p.trim())
      .map(p => `<p>${p.trim()}</p>`)
      .join("\n");
  }

  document.getElementById("btn-new-post").addEventListener("click", () => openPostModal(null));
  document.getElementById("modal-close").addEventListener("click", closePostModal);
  document.getElementById("modal-cancel").addEventListener("click", closePostModal);

  document.getElementById("modal-save").addEventListener("click", () => {
    const title = document.getElementById("post-title").value.trim();
    const category = document.getElementById("post-category").value;
    const excerpt = document.getElementById("post-excerpt").value.trim();
    const rawContent = document.getElementById("post-content").value.trim();
    const status = document.getElementById("post-status").value;
    const editId = document.getElementById("post-id").value;

    if (!title) {
      showToast("Please enter a post title.");
      return;
    }

    const content = wrapContentInParagraphs(rawContent);
    const author = "Admin";

    if (editId) {
      updatePost(parseInt(editId), { title, category, excerpt, content, status });
      showToast("Post updated successfully!");
    } else {
      createPost({ title, category, excerpt, content, author, status });
      showToast("Post created successfully!");
    }

    closePostModal();
    renderPostsTable();
    renderOverview();
  });

  // Close modal on backdrop click
  postModal.addEventListener("click", (e) => {
    if (e.target === postModal) closePostModal();
  });

  // --- Delete Confirmation ---
  window.confirmDelete = function (id, title) {
    deleteTargetId = id;
    document.getElementById("delete-post-title").textContent = title;
    deleteModal.classList.add("open");
  };

  function closeDeleteModal() {
    deleteModal.classList.remove("open");
    deleteTargetId = null;
  }

  document.getElementById("delete-modal-close").addEventListener("click", closeDeleteModal);
  document.getElementById("delete-cancel").addEventListener("click", closeDeleteModal);
  document.getElementById("delete-confirm").addEventListener("click", () => {
    if (deleteTargetId) {
      deletePost(deleteTargetId);
      showToast("Post deleted.");
      closeDeleteModal();
      renderPostsTable();
      renderOverview();
    }
  });

  deleteModal.addEventListener("click", (e) => {
    if (e.target === deleteModal) closeDeleteModal();
  });

  // Expose edit function globally
  window.editPost = function (id) {
    const post = getPostById(id);
    if (post) openPostModal(post);
  };

  // --- Analytics ---
  function renderAnalytics() {
    const posts = getAllPosts();
    const stats = getStats();

    const avgViews = stats.totalPosts > 0 ? Math.round(stats.totalViews / stats.totalPosts) : 0;
    const topPost = [...posts].sort((a, b) => b.views - a.views)[0];

    document.getElementById("analytics-stats").innerHTML = `
      <div class="stat-card">
        <div class="stat-card__label">Total Views</div>
        <div class="stat-card__value">${stats.totalViews.toLocaleString()}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">Avg. Views / Post</div>
        <div class="stat-card__value">${avgViews.toLocaleString()}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">Top Post</div>
        <div class="stat-card__value" style="font-size:1rem;">${topPost ? escapeHtml(topPost.title).substring(0, 30) + "..." : "N/A"}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">Authors</div>
        <div class="stat-card__value">${stats.authorCount}</div>
      </div>
    `;

    // Monthly chart
    const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
    const monthlyData = [2800, 3450, 4120, 3890, 5230, stats.totalViews];
    const maxMonthly = Math.max(...monthlyData);

    document.getElementById("chart-monthly").innerHTML = monthlyData
      .map((val, i) => `
        <div class="chart-bar" style="height:${(val / maxMonthly) * 100}%;">
          <span class="chart-bar__value">${(val / 1000).toFixed(1)}k</span>
          <span class="chart-bar__label">${months[i]}</span>
        </div>
      `).join("");

    // Top posts table
    const sorted = [...posts].sort((a, b) => b.views - a.views);
    document.getElementById("top-posts-table").innerHTML = sorted
      .map((p, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${escapeHtml(p.title)}</strong></td>
          <td><span class="card__tag">${p.category}</span></td>
          <td>${p.views.toLocaleString()}</td>
        </tr>
      `).join("");
  }

  // --- Initial Render ---
  renderOverview();
})();
