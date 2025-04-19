console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Define all your site pages
let pages = [
  { url: 'index.html', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
];

// Create and add the <nav> to the top of the body
let nav = document.createElement('nav');
document.body.prepend(nav);

// Set the base path to the /portfolio/ folder
const BASE_PATH = "/portfolio/";

// Loop through pages and build <a> links
for (let p of pages) {
  let url = p.url;
  let title = p.title;

  // Prefix BASE_PATH if it's a relative link
  if (!url.startsWith('http')) {
    url = BASE_PATH + url;
  }

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;

  // Highlight current page
  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );

  // Open external links in a new tab
  a.toggleAttribute('target', a.host !== location.host);

  nav.append(a);
}


document.body.insertAdjacentHTML(
    'afterbegin',
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
  

const select = document.querySelector('.color-scheme select');

select.addEventListener('input', function (event) {
  const newScheme = event.target.value;
  console.log('color scheme changed to', newScheme);

  // Apply the new color scheme to the root <html> element
  document.documentElement.style.setProperty('color-scheme', newScheme);
});

// ✅ 1. If there's a saved preference, apply it on page load
if ("colorScheme" in localStorage) {
    const savedScheme = localStorage.colorScheme;
    document.documentElement.style.setProperty('color-scheme', savedScheme);
    select.value = savedScheme; // Set the dropdown to match
  }
  
  // ✅ 2. Save the user's preference when changed
  select.addEventListener('input', function (event) {
    const newScheme = event.target.value;
    console.log('color scheme changed to', newScheme);
  
    // Apply the new color scheme
    document.documentElement.style.setProperty('color-scheme', newScheme);
  
    // Save the preference
    localStorage.colorScheme = newScheme;
  });

