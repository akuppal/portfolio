import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';


let query = '';
let selectedIndex = -1;

async function loadProjects() {
  const allProjects = await fetchJSON('../lib/projects.json');

  render(allProjects);

  document.querySelector('.searchBar')
          .addEventListener('input', e => {
            query = e.target.value.trim().toLowerCase();
            selectedIndex = -1;
            render(allProjects);
          });
}

loadProjects();


function render(allProjects) {
  /* 1 ▸ filter by search query */
  const visible = allProjects.filter(p =>
    p.title.toLowerCase().includes(query) ||
    p.year.toString().includes(query)     ||
    (p.description ?? '').toLowerCase().includes(query)
  );


  const cardWrap = document.querySelector('.projects');
  cardWrap.innerHTML = '';
  visible.forEach(p => renderProjects(p, cardWrap, 'h2'));
  document.querySelector('.projects-title')
          .textContent = `Projects (${visible.length})`;


  const svg = d3.select('#projects-pie-plot').html('');
  const legend = d3.select('.legend').html('');


  if (!visible.length) return;


  const pieData = d3.rollups(
                    visible,
                    v => v.length,
                    d => d.year
                  )
                  .map(([year, count]) => ({ label: year, value: count }))
                  .sort((a, b) => d3.ascending(a.label, b.label));


  const colors   = d3.scaleOrdinal(d3.schemeTableau10);
  const arcGen   = d3.arc().innerRadius(0).outerRadius(50);
  const slices   = d3.pie().value(d => d.value)(pieData);


  svg.selectAll('path')
    .data(slices)
    .join('path')
      .attr('d', arcGen)
      .attr('fill', (_, i) => colors(i))
      .attr('class', d => d.index === selectedIndex ? 'selected' : null)
      .on('click', (event, d) => {
        const i = d.index;
        selectedIndex = (selectedIndex === i) ? -1 : i;
        updateSelection(svg, legend, slices, arcGen, colors);
      });


  legend.selectAll('li')
    .data(pieData)
    .join('li')
      .attr('class', (_, i) =>
        `legend-item${i === selectedIndex ? ' selected' : ''}`)
      .attr('style', (_, i) => `--color:${colors(i)}`)
      .attr('data-idx', (_, i) => i)
      .html(d => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', function (event) {
        const i = +this.dataset.idx;
        selectedIndex = (selectedIndex === i) ? -1 : i;
        updateSelection(svg, legend, slices, arcGen, colors);
      });

}

function updateSelection(svg, legend, slices, arcGen, colors) {
  svg.selectAll('path')
    .data(slices)
    .join('path')
      .attr('d', arcGen)
      .attr('fill', (_, i) => colors(i))
      .attr('style', (_, i) => `--slice-color:${colors(i)}`)
      .attr('class', d => {
        if (selectedIndex === -1) return null; // No selection
        return d.index === selectedIndex ? 'selected' : 'dimmed';
      })
      .on('click', (event, d) => {
        const i = d.index;
        selectedIndex = (selectedIndex === i) ? -1 : i;
        updateSelection(svg, legend, slices, arcGen, colors);
      });

  legend.selectAll('li')
    .attr('class', (_, i) => {
      const base = 'legend-item';
      if (selectedIndex === -1) return base; // No selection
      return (i === selectedIndex) ? `${base} selected`
                                   : `${base} dimmed`;
    });
}
