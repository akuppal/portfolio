console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: 'index.html', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = "";

for (let p of pages) {
  let url = BASE_PATH + p.url;
  let title = p.title;

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;

  //Highlights the page:
  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );

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
  document.documentElement.style.setProperty('color-scheme', newScheme);
});

if ("colorScheme" in localStorage) {
    const savedScheme = localStorage.colorScheme;
    document.documentElement.style.setProperty('color-scheme', savedScheme);
    select.value = savedScheme;
  }
  
  select.addEventListener('input', function (event) {
    const newScheme = event.target.value;
    console.log('color scheme changed to', newScheme);
    document.documentElement.style.setProperty('color-scheme', newScheme);
    localStorage.colorScheme = newScheme;
  });

  export async function fetchJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching JSON:', error);
    }
  }


  export function renderProjects(project, containerElement, headingLevel = 'h2') {
    const article = document.createElement('article');
  
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;
  
    containerElement.appendChild(article);
  }
  
  
  export async function fetchGithubData(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching GitHub data:', error);
  }
}

