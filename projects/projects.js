import { fetchJSON, renderProjects } from '../global.js';

async function loadProjects() {
  const projects = await fetchJSON('../lib/projects.json');

  const container = document.querySelector('.projects');
  container.innerHTML = ''; // clear once before adding

  // ✅ Update project title with count
  const titleElement = document.querySelector('.projects-title');
  titleElement.textContent = `Projects (${projects.length})`;

  for (const project of projects) {
    renderProjects(project, container, 'h2');
  }
}

loadProjects();
