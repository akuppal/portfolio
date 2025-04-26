// import { fetchJSON, renderProjects } from './global.js';
import { fetchJSON, renderProjects, fetchGithubData } from './global.js';

const profileStats = document.querySelector('#profile-stats');



async function loadLatestProjects() {
  const projects = await fetchJSON('./lib/projects.json');
  const latestProjects = projects.slice(0, 3);

  const projectsContainer = document.querySelector('.projects');
  projectsContainer.innerHTML = ''; // clear it first

  for (const project of latestProjects) {
    renderProjects(project, projectsContainer, 'h2');
  }
}

async function loadGithubStats() {
    const githubUsername = 'akuppal'; // your username
    const data = await fetchGithubData(githubUsername);
  
    if (data && profileStats) {
      profileStats.innerHTML = `
        <dl>
          <dt>Public Repos:</dt><dd>${data.public_repos}</dd>
          <dt>Public Gists:</dt><dd>${data.public_gists}</dd>
          <dt>Followers:</dt><dd>${data.followers}</dd>
          <dt>Following:</dt><dd>${data.following}</dd>
        </dl>
      `;
    }
  }
  
loadLatestProjects();
loadGithubStats();
