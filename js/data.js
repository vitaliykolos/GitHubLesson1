// ===== Blog Data Store (localStorage-backed) =====

const STORAGE_KEY = "myblog_posts";

const DEFAULT_POSTS = [
  {
    id: 1,
    title: "Getting Started with JavaScript ES2024 Features",
    category: "Technology",
    excerpt: "Explore the latest JavaScript features including pipeline operators, record & tuple types, and pattern matching that are reshaping modern web development.",
    content: `<p>JavaScript continues to evolve at a remarkable pace. The ES2024 specification brings several exciting features that make our code cleaner, more expressive, and more maintainable.</p>

<h2>Pipeline Operator</h2>
<p>The pipeline operator (<code>|></code>) allows you to chain function calls in a readable, left-to-right manner. Instead of deeply nested function calls, you can write code that reads naturally.</p>

<h2>Pattern Matching</h2>
<p>Pattern matching brings powerful control flow to JavaScript, similar to what you'd find in languages like Rust or Haskell. It goes far beyond simple switch statements, allowing you to match against complex data structures.</p>

<h2>Record & Tuple Types</h2>
<p>These new immutable data structures provide value-based equality, meaning two records with the same values are considered equal. This is a game-changer for state management in frameworks like React.</p>

<blockquote>The future of JavaScript is not about adding complexity, but about providing better tools to manage the complexity we already face.</blockquote>

<h3>Getting Started</h3>
<p>To start using these features today, you can use Babel with the appropriate plugins or TypeScript's nightly builds. Many of these features are already available behind flags in major browsers.</p>

<p>Stay tuned for more in-depth tutorials on each of these features!</p>`,
    author: "Alex Chen",
    status: "published",
    date: "2026-02-25",
    views: 1243
  },
  {
    id: 2,
    title: "Designing for Accessibility: A Practical Guide",
    category: "Design",
    excerpt: "Learn how to make your web applications accessible to everyone with practical tips on color contrast, keyboard navigation, and screen reader support.",
    content: `<p>Web accessibility isn't just a legal requirement — it's a moral imperative. When we design for accessibility, we create better experiences for <em>everyone</em>, not just people with disabilities.</p>

<h2>Color Contrast</h2>
<p>Ensuring adequate color contrast is one of the simplest yet most impactful accessibility improvements you can make. WCAG 2.1 recommends a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.</p>

<h2>Keyboard Navigation</h2>
<p>Every interactive element on your page should be reachable and operable via keyboard alone. This means proper use of tab order, focus indicators, and keyboard event handlers.</p>

<ul>
  <li>Use semantic HTML elements that are naturally focusable</li>
  <li>Add visible focus indicators (never use <code>outline: none</code> without an alternative)</li>
  <li>Implement keyboard shortcuts for common actions</li>
  <li>Test your entire user flow with keyboard only</li>
</ul>

<h2>Screen Reader Support</h2>
<p>Screen readers interpret your HTML to create an auditory experience. Using semantic HTML, ARIA labels, and proper heading hierarchy ensures your content makes sense when read aloud.</p>

<h3>Tools for Testing</h3>
<p>Use tools like Lighthouse, axe DevTools, and manual testing with actual screen readers (NVDA, VoiceOver) to catch accessibility issues early in development.</p>`,
    author: "Maya Patel",
    status: "published",
    date: "2026-02-22",
    views: 876
  },
  {
    id: 3,
    title: "The Art of Deep Work in a Distracted World",
    category: "Productivity",
    excerpt: "Discover strategies for achieving deep focus and producing your best work, even when surrounded by constant digital distractions.",
    content: `<p>In an age of constant notifications, open offices, and infinite social media feeds, the ability to focus deeply on cognitively demanding tasks has become both increasingly rare and increasingly valuable.</p>

<h2>What is Deep Work?</h2>
<p>Cal Newport defines deep work as "professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit." This is the kind of work that creates real value and is hard to replicate.</p>

<h2>Building Your Deep Work Practice</h2>

<h3>1. Schedule Deep Work Blocks</h3>
<p>Block out specific times in your calendar for deep work. Treat these blocks as non-negotiable appointments with yourself. Start with 90-minute sessions and work up from there.</p>

<h3>2. Create a Shutdown Ritual</h3>
<p>At the end of each workday, perform a systematic review of incomplete tasks and create a plan for the next day. This tells your brain it's safe to disengage, reducing the anxiety that drives us to check email compulsively.</p>

<h3>3. Embrace Boredom</h3>
<p>If you constantly reach for your phone during every moment of downtime, you're training your brain to require stimulation. Practice being bored — wait in line without your phone, sit quietly for a few minutes each day.</p>

<blockquote>The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy.</blockquote>

<p>Start small, be consistent, and watch your capacity for focused work grow over time.</p>`,
    author: "Jordan Kim",
    status: "published",
    date: "2026-02-18",
    views: 2105
  },
  {
    id: 4,
    title: "Building Resilient Microservices with Go",
    category: "Technology",
    excerpt: "A deep dive into patterns for building fault-tolerant microservices using Go, including circuit breakers, retry logic, and graceful degradation.",
    content: `<p>Microservices architecture promises scalability and independence, but it also introduces new failure modes. Network calls fail, services go down, and latency spikes happen. Building resilient services means planning for these failures.</p>

<h2>Circuit Breaker Pattern</h2>
<p>The circuit breaker pattern prevents cascading failures by monitoring for repeated failures and "breaking the circuit" — stopping requests to a failing service until it recovers.</p>

<h2>Retry with Exponential Backoff</h2>
<p>When a request fails, retrying immediately often makes things worse. Exponential backoff spaces out retries with increasing delays, giving the failing service time to recover.</p>

<h2>Graceful Degradation</h2>
<p>When a dependency is unavailable, your service should degrade gracefully rather than failing completely. This might mean returning cached data, using a fallback service, or providing a reduced feature set.</p>

<h3>Observability</h3>
<p>You can't fix what you can't see. Instrument your services with structured logging, distributed tracing, and metrics collection. Tools like Prometheus, Jaeger, and Grafana form a powerful observability stack.</p>

<p>Resilience isn't a feature you add once — it's a mindset you build into every service from day one.</p>`,
    author: "Alex Chen",
    status: "published",
    date: "2026-02-14",
    views: 654
  },
  {
    id: 5,
    title: "Minimalist Living: Less Stuff, More Life",
    category: "Lifestyle",
    excerpt: "How embracing minimalism can reduce stress, save money, and help you focus on what truly matters in life.",
    content: `<p>Minimalism isn't about living with nothing — it's about making room for the things that matter. In a consumer culture that constantly tells us we need more, choosing less can be a radical act of self-care.</p>

<h2>Starting Your Minimalist Journey</h2>
<p>Begin with one area of your life. Maybe it's your closet, your kitchen, or your digital subscriptions. The key is to start small and build momentum.</p>

<h2>The 90/90 Rule</h2>
<p>For each item you own, ask yourself: "Have I used this in the last 90 days? Will I use it in the next 90?" If the answer to both is no, it's time to let it go.</p>

<h2>Digital Minimalism</h2>
<p>Our digital lives need decluttering too. Audit your apps, subscriptions, and notification settings. Each one represents a claim on your attention — make sure it's worth it.</p>

<blockquote>The things you own end up owning you.</blockquote>

<p>Minimalism is a journey, not a destination. Be patient with yourself and enjoy the increasing clarity that comes with each thing you release.</p>`,
    author: "Sam Rivera",
    status: "published",
    date: "2026-02-10",
    views: 1587
  },
  {
    id: 6,
    title: "Draft: Scaling Your Startup Beyond the First 100 Customers",
    category: "Business",
    excerpt: "Lessons learned from taking a B2B SaaS product from early adopters to a scalable growth engine.",
    content: `<p>Getting your first 100 customers is an achievement worth celebrating. But the playbook that got you here won't get you to 1,000. Scaling requires rethinking your approach to sales, support, and product development.</p>

<h2>From Founder-Led Sales to a Sales Team</h2>
<p>As a founder, you've been closing deals with passion and deep product knowledge. To scale, you need to codify your sales process, build a repeatable playbook, and hire people who can execute it.</p>

<h2>Product-Led Growth</h2>
<p>The most efficient scaling engine is a product that sells itself. Invest in self-serve onboarding, in-app education, and features that naturally encourage sharing and collaboration.</p>

<p>More content coming soon...</p>`,
    author: "Jordan Kim",
    status: "draft",
    date: "2026-02-27",
    views: 12
  }
];

// Initialize or load posts from localStorage
function loadPosts() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  savePosts(DEFAULT_POSTS);
  return DEFAULT_POSTS;
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function getPublishedPosts() {
  return loadPosts().filter(p => p.status === "published");
}

function getAllPosts() {
  return loadPosts();
}

function getPostById(id) {
  return loadPosts().find(p => p.id === id);
}

function createPost(post) {
  const posts = loadPosts();
  post.id = Date.now();
  post.date = new Date().toISOString().split("T")[0];
  post.views = 0;
  posts.unshift(post);
  savePosts(posts);
  return post;
}

function updatePost(id, updates) {
  const posts = loadPosts();
  const index = posts.findIndex(p => p.id === id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updates };
    savePosts(posts);
    return posts[index];
  }
  return null;
}

function deletePost(id) {
  const posts = loadPosts().filter(p => p.id !== id);
  savePosts(posts);
}

function getStats() {
  const posts = loadPosts();
  const published = posts.filter(p => p.status === "published");
  const drafts = posts.filter(p => p.status === "draft");
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
  const authors = [...new Set(posts.map(p => p.author))];

  return {
    totalPosts: posts.length,
    published: published.length,
    drafts: drafts.length,
    totalViews,
    authorCount: authors.length
  };
}

// Toast notification helper
function showToast(message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
