// Import d3 library
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@5/+esm";

// Function to load data
function loadData(filePath) {
  return d3.csv(filePath).then(data => {
    return data;
  }).catch(error => {
    console.error('Error loading CSV data:', error);
    return null;
  });
}

// Function to initialize and load data
async function initialize() {
  const citibikeData = await loadData('citibikerides.csv');
  const buildingData = await loadData('MNBuilidng.csv');
  const citibikestationData = await loadData('MNstation.csv');

  if (citibikeData && buildingData && citibikestationData ) {
    console.log('Citibike Data:', citibikeData);
    console.log('Building Data:', buildingData);
    console.log('Citibike station Data:', citibikestationData);
  }
}
// // Donut chart for building age and height
async function generateDonutChart(dataKey, chartId, groupingData) {
  const buildingData = await loadData('MNBuilidng.csv');

  // data from  dataKey
const counts = d3.nest()
.key(function(d) { 
  let value = d[dataKey];
  for (const group of groupingData) {
    if (value >= group.min && value <= group.max) {
      return group.label;
    }
  }
})
.rollup(function(v) { return v.length; })
.entries(buildingData)
.filter(function(d) { return d.key !== null; });

  const total = d3.sum(counts, function(d) { return d.value; });
  const dataset = counts.map(function(d) { 
    return { key: d.key, count: d.value, percentage: (d.value / total * 100).toFixed(2) }; 
  });
  const colors = ["#1b4793", "#ef3c23", "#2178ae", "#fac92c", "#cfe5cc", "#ed8e83","#f15a42"];
  const width = 360, height = 500;
  const radius = Math.min(width, height) / 2;
  const svg = d3.select(chartId).append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 3 + ")");

  const arc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.9);

  const pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.count; });

  svg.selectAll("path")
      .data(pie(dataset))
      .enter().append("path")
      .attr("d", arc)
      .attr("fill", function(d, i) { return colors[i % colors.length]; });

  const label = d3.arc()
      .outerRadius(radius)
      .innerRadius(radius);

// Create legend
const legendXOffset = -width / 2 + 20; // Moves the legend to the left side of the SVG
const legendYOffset = -height / 2 + 460; // Moves the legend towards the top of the SVG

const legend = svg.append("g")
  .attr("font-family", "sans-serif")
  .attr("font-size", 12) // Adjust font size as needed
  .attr("text-anchor", "start")
  .selectAll("g")
  .data(dataset)
  .enter().append("g")
  .attr("transform", (d, i) => `translate(${legendXOffset}, ${legendYOffset + i * 25})`); // Adjust vertical spacing with 'i * 25'

legend.append("rect")
  .attr("x", 0)
  .attr("width", 19)
  .attr("height", 19)
  .attr("rx", 2) // Sets the x-axis radius for the rectangle to create rounded corners
  .attr("ry", 2) // Sets the y-axis radius for the rectangle to create rounded corners
  .attr("fill", (d, i) => colors[i % colors.length]);

legend.append("text")
  .attr("x", 24) // This positions the text to the right of the rectangle
  .attr("y", 9.5)
  .attr("dy", "0.35em") // Adjust for vertical alignment if necessary
  .text(d => `${d.key || 'Unknown'}: ${d.percentage}%`); }


// Data for 'donutChartYearBuilt'
const yearBuiltData = [
  { min: 1900, max: 1999, label: '1900s' },
  { min: 2000, max: 2009, label: '2000s' },
  { min: 2010, max: 2023, label: '2010s' }
];

// Data for 'donutChartNumFloors'
const numFloorsData = [
  { min: 1, max: 10, label: '1-10 floors' },
  { min: 11, max: 20, label: '11-20 floors' },
  { min: 21, max: 30, label: '21-30 floors' },
  { min: 31, max: 40, label: '31-40 floors' },
  { min: 41, max: 50, label: '41-50 floors' },
  { min: 51, max: Infinity, label: '51+ floors' }
];

// callfunction to generate chart
generateDonutChart('yearbuilt', '#donutChartYearBuilt', yearBuiltData);
generateDonutChart('numfloors', '#donutChartNumFloors', numFloorsData);

// Donut chart for building types
async function generateDonutChartForBuildingClass(chartId) {
  const buildingData = await loadData('MNBuilidng.csv');

  const counts = d3.nest()
    .key(function(d) { return d.bldgclass; })
    .rollup(function(v) { return v.length; })
    .entries(buildingData);

  const total = d3.sum(counts, function(d) { return d.value; });
  const dataset = counts.map(function(d) { 
    return { key: d.key, count: d.value, percentage: (d.value / total * 100).toFixed(2) }; 
  });
  const colors = ["#1b4793", "#ef3c23", "#2178ae", "#fac92c", "#cfe5cc", "#ed8e83"];
  const width = 360, height = 500;
  const radius = Math.min(width, height) / 2;
  const svg = d3.select(chartId).append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 3 + ")");

  const arc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.9);

  const pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.count; });

  svg.selectAll("path")
      .data(pie(dataset))
      .enter().append("path")
      .attr("d", arc)
      .attr("fill", function(d, i) { return colors[i % colors.length]; });

  const label = d3.arc()
      .outerRadius(radius)
      .innerRadius(radius);

     // Create legend
const legendXOffset = -width / 2 + 20; // Moves the legend to the left side of the SVG
const legendYOffset = -height / 2 + 460; // Moves the legend towards the top of the SVG

const legend = svg.append("g")
  .attr("font-family", "sans-serif")
  .attr("font-size", 12) // Adjust font size as needed
  .attr("text-anchor", "start")
  .selectAll("g")
  .data(dataset)
  .enter().append("g")
  .attr("transform", (d, i) => `translate(${legendXOffset}, ${legendYOffset + i * 25})`); // Adjust vertical spacing with 'i * 25'

legend.append("rect")
  .attr("x", 0)
  .attr("width", 19)
  .attr("height", 19)
  .attr("rx", 5) // Sets the x-axis radius for the rectangle to create rounded corners
  .attr("ry", 5) // Sets the y-axis radius for the rectangle to create rounded corners
  .attr("fill", (d, i) => colors[i % colors.length]);

legend.append("text")
  .attr("x", 24) // This positions the text to the right of the rectangle
  .attr("y", 9.5)
  .attr("dy", "0.35em") // Adjust for vertical alignment if necessary
.text(d => `${d.key || 'Unknown'}: ${d.percentage}%`); }

// callfunction to generate chart
generateDonutChartForBuildingClass('#donutChartBuildingClass');



// Function to count and display the number of Citibike stations
async function countAndDisplayStations() {
  const citibikeStationsData = await loadData('MNstation.csv');

  if (citibikeStationsData) {
    const numberOfStations = citibikeStationsData.length;
    document.getElementById('station-count').innerHTML = `while there are "${numberOfStations}"Citibike stations in Manhattan. Most are located in downtown.`;
  } else {
    document.getElementById('station-count').innerHTML = 'Error loading Citibike stations data.';
  }
}
// Call the function to count and display the stations
countAndDisplayStations();

async function updateRideTypeCounts() {
  const citibikeData = await loadData('citibikerides.csv');

  // Filter data for classic and electric bikes
  const classicBikes = citibikeData.filter(d => d.rideable_type === 'classic_bike');
  const electricBikes = citibikeData.filter(d => d.rideable_type === 'electric_bike');

  // Get counts
  const classicCount = classicBikes.length;
  const electricCount = electricBikes.length;

  // Select the div and update its content with the counts
  const container = document.querySelector(".step[data-step='3']");
  container.querySelector("#classic-count").textContent = `Classic Bikes: ${classicCount}`;
  container.querySelector("#electric-count").textContent = `Electric Bikes: ${electricCount}`;
}

async function updateMemberTypeCounts() {
  const citibikeData = await loadData('citibikerides.csv');

  // Filter data for casual and member users
  const casualUsers = citibikeData.filter(d => d.member_casual === 'casual');
  const memberUsers = citibikeData.filter(d => d.member_casual === 'member');

  // Get counts
  const casualCount = casualUsers.length;
  const memberCount = memberUsers.length;

  // Select the div and update its content with the counts
  const container = document.querySelector(".step[data-step='3']");
  container.querySelector("#casual-count").textContent = `Casual Users: ${casualCount}`;
  container.querySelector("#member-count").textContent = `Member Users: ${memberCount}`;
}

// Call the functions to update the counts
updateRideTypeCounts();
updateMemberTypeCounts();

const animation = bodymovin.loadAnimation({
  container: document.getElementById('lottie-animation'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'bike.json',
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice' // This will scale your animation to fit the container
  }
});
