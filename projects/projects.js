import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

/* — GLOBAL STATE — */
let query = '';          // live search text
let selectedIndex = -1;  // -1 = nothing selected

/* — MAIN — */
async function loadProjects() {
  const allProjects = await fetchJSON('../lib/projects.json');

  /* first draw */
  render(allProjects);

  /* live search */
  document.querySelector('.searchBar')
          .addEventListener('input', e => {
            query = e.target.value.trim().toLowerCase();
            selectedIndex = -1;          // clear highlight
            render(allProjects);
          });
}

loadProjects();

/* — RENDER helper — */
function render(allProjects) {
  /* 1 ▸ filter by search query */
  const visible = allProjects.filter(p =>
    p.title.toLowerCase().includes(query) ||
    p.year.toString().includes(query)     ||
    (p.description ?? '').toLowerCase().includes(query)
  );

  /* 2 ▸ project cards */
  const cardWrap = document.querySelector('.projects');
  cardWrap.innerHTML = '';
  visible.forEach(p => renderProjects(p, cardWrap, 'h2'));
  document.querySelector('.projects-title')
          .textContent = `Projects (${visible.length})`;

  /* 3 ▸ clear old SVG + legend */
  const svg    = d3.select('#projects-pie-plot').html('');
  const legend = d3.select('.legend').html('');

  if (!visible.length) return;   // nothing to draw

  /* 4 ▸ prep pie data (count per year) */
  const pieData = d3.rollups(
                    visible,
                    v => v.length,
                    d => d.year)
                  .map(([year,count]) => ({ label:year, value:count }))
                  .sort((a,b) => d3.ascending(a.label,b.label));

  /* 5 ▸ draw pie slices */
  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  const arcGen = d3.arc().innerRadius(0).outerRadius(50);
  const slices = d3.pie().value(d => d.value)(pieData);

  svg.selectAll('path')
     .data(slices)
     .join('path')
       .attr('d', arcGen)
       .attr('fill', (_, i) => colors(i))
       .attr('style', (_, i) => `--slice-color:${colors(i)}`)  // ★ store colour
       .attr('class', d => d.index === selectedIndex ? 'selected' : null)
       .on('click', (event, d) => {
         const i = d.index;                       // true index
         selectedIndex = (selectedIndex === i) ? -1 : i;
         updateSelection(svg, legend);
       });


  legend.selectAll('li')
  .data(pieData)
  .join('li')
    .attr('class', (_, i) =>
      `legend-item${i === selectedIndex ? ' selected' : ''}`)
    .attr('style', (_, i) => `--color:${colors(i)}`)
    .attr('data-idx', (_, i) => i)
    .html(d => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
    .on('click', function () {
      const i = +this.dataset.idx;
      selectedIndex = (selectedIndex === i) ? -1 : i;
      updateSelection(svg, legend);
    });

    function updateProjectsList() {
      console.log("Updating projects list...");
      const projectsContainer = d3.select('.projects');
      let filteredProjects;
      
      if (selectedIndex === -1) {
        // No filtering: display all projects
        filteredProjects = projects;
      } else {
        // Get the selected year from pieData (each slice corresponds to a year)
        let selectedYear = pieData[selectedIndex].label;
        console.log("Selected year:", selectedYear);
        filteredProjects = projects.filter(d => d.year === selectedYear);
      }
      
      console.log("Filtered projects:", filteredProjects);
      
      // Clear the current project list
      projectsContainer.html('');
      
      // Bind the filtered projects data and append project articles
      projectsContainer.selectAll('article')
        .data(filteredProjects, d => d.id || d.title) // ensure unique key helps with transitions
        .join(
          enter => enter.append('article')
                        .html(d => `<h3>${d.title}</h3><p>Year: ${d.year}</p>`),
          update => update,
          exit  => exit.remove()
        );
    }
  
  // Clear the current project list
  projectsContainer.html('');
  
  // Bind the filtered projects data and append project articles
  projectsContainer.selectAll('article')
    .data(filteredProjects, d => d.id || d.title) // use a unique id or title
    .join(
      enter => enter.append('article')
                    .html(d => `<h3>${d.title}</h3><p>Year: ${d.year}</p>`),
      update => update,
      exit => exit.remove()
    );
}

function updateSelection(svg, legend) {
  // Update pie chart slices classes
  svg.selectAll('path')
     .attr('class', (_, i) => {
       if (selectedIndex === -1) return null;
       return (i === selectedIndex) ? 'selected' : 'dimmed';
     });

  // Update legend items classes
  legend.selectAll('li')
        .attr('class', (_, i) => {
          const base = 'legend-item';
          if (selectedIndex === -1) return base;
          return (i === selectedIndex) ? `${base} selected` : `${base} dimmed`;
        });
  
  // Call function to update the projects list
  updateProjectsList();
}
