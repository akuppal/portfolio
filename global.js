// ----------------------------------------------------
//  navigation – build root-relative links in pure JS
// ----------------------------------------------------
console.log("IT’S ALIVE!");
function getRoot() {
  const parts = location.pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("portfolio");
  if (idx !== -1) {
    return "/" + parts.slice(0, idx + 1).join("/") + "/";
  }
  return "/";
}

const ROOT = getRoot();
const pages = [
  { url: "index.html", title: "Home" },
  { url: "projects/",  title: "Projects" },
  { url: "contact/",   title: "Contact" },
  { url: "resume/",    title: "Resume" },
  { url: 'meta/', title: 'Meta' }
];

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const nav = document.createElement("nav");
document.body.prepend(nav);

for (const p of pages) {
  const a = document.createElement("a");

  a.href = p.url === "index.html" ? ROOT : ROOT + p.url;

  a.textContent = p.title;

  // highlight current page
  a.classList.toggle(
    "current",
    new URL(a.href).pathname === location.pathname
  );

  a.toggleAttribute("target", new URL(a.href).host !== location.host);

  nav.append(a);
}


document.body.insertAdjacentHTML(
  "afterbegin",
  `
  <label class="color-scheme">
    Theme:
    <select id="theme-switch">
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
`
);

const select = document.querySelector(".color-scheme select");

if ("colorScheme" in localStorage) {
  const saved = localStorage.colorScheme;
  document.documentElement.style.setProperty("color-scheme", saved);
  select.value = saved;
}

select.addEventListener("input", (e) => {
  const scheme = e.target.value;
  console.log("color scheme changed to", scheme);
  document.documentElement.style.setProperty("color-scheme", scheme);
  localStorage.colorScheme = scheme;
});


export async function fetchJSON(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Failed to fetch: ${resp.statusText}`);
    return await resp.json();
  } catch (err) {
    console.error("Error fetching JSON:", err);
  }
}

export function renderProjects(project, containerElement, headingLevel = "h2") {
  const article = document.createElement("article");
  article.innerHTML = `
    <${headingLevel}>${project.title}</${headingLevel}>
    <img src="${project.image}" alt="${project.title}">
    <div>
      <p>${project.description}</p>
      <p style="
        font-style: italic;
        color: #777;
        font-family: Baskerville, serif;
        font-variant-numeric: oldstyle-nums;
      ">
        c. ${project.year}
      </p>
    </div>
  `;
  containerElement.appendChild(article);
}


export async function fetchGithubData(username) {
  try {
    const resp = await fetch(`https://api.github.com/users/${username}`);
    if (!resp.ok) throw new Error(`GitHub API error: ${resp.statusText}`);
    return await resp.json();
  } catch (err) {
    console.error("Error fetching GitHub data:", err);
  }
}
