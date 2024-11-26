<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"></script>

let chart = null;

function calculateFootprint() {
    const softwareName = document.getElementById('software-name').value;
    if (!softwareName.trim()) {
        alert('Please enter a software name');
        return;
    }

    // Get input values and ensure they're valid numbers
    const devHours = parseFloat(document.getElementById('dev-hours').value) || 0;
    const devEnergy = parseFloat(document.getElementById('dev-energy').value) || 0;
    const serverHours = parseFloat(document.getElementById('server-hours').value) || 0;
    const dataTransfer = parseFloat(document.getElementById('data-transfer').value) || 0;
    const dailyUsers = parseFloat(document.getElementById('daily-users').value) || 0;
    const usageTime = parseFloat(document.getElementById('usage-time').value) || 0;

    // Calculate emissions for each phase
    const devEmissions = devHours * devEnergy * 0.5;
    const hostingEmissions = (serverHours * 0.3) + (dataTransfer * 0.2);
    const userEmissions = dailyUsers * (usageTime / 60) * 0.1 * 30;

    const totalEmissions = devEmissions + hostingEmissions + userEmissions;

    // Display results with software name
    document.getElementById('results').style.display = 'block';
    document.getElementById('result-software-name').textContent = softwareName;
    document.getElementById('total-emissions').innerHTML = `
        <h3>Total Monthly Carbon Emissions: ${totalEmissions.toFixed(2)} kg CO2e</h3>
    `;

    document.getElementById('breakdown').innerHTML = `
        <p>Development Phase: ${devEmissions.toFixed(2)} kg CO2e</p>
        <p>Hosting & Deployment: ${hostingEmissions.toFixed(2)} kg CO2e</p>
        <p>User Interaction: ${userEmissions.toFixed(2)} kg CO2e</p>
    `;
    const treefordev = Math.floor(devEmissions/21);
    const treeforhosting = Math.floor(hostingEmissions/21);
    const treeforuser = Math.floor(userEmissions/21);
    const totaltrees = treefordev + treeforhosting + treeforuser;
    document.getElementById('breakdown').innerHTML = `
        <p>You owe the enviornment ${totaltrees} trees to be taken care off for 10 years.</p>
        <p>Development Phase: ${treefordev} trees.</p>
        <p>Hosting & Deployment: ${treeforhosting} trees.</p>
        <p>User Interaction: ${treeforuser} trees.</p>
    `;

    // Chart code remains the same
    const data = {
        labels: ['Development', 'Hosting & Deployment', 'User Interaction'],
        datasets: [{
            label: 'Carbon Emissions (kg CO2e)',
            data: [devEmissions, hostingEmissions, userEmissions],
            backgroundColor: [
                'rgba(46, 125, 50, 0.7)',
                'rgba(129, 199, 132, 0.7)',
                'rgba(200, 230, 201, 0.7)'
            ],
            borderColor: [
                'rgba(46, 125, 50, 1)',
                'rgba(129, 199, 132, 1)',
                'rgba(200, 230, 201, 1)'
            ],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: `Carbon Emissions by Phase - ${softwareName}`
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'CO2e (kg)'
                    }
                }
            }
        }
    };

    const ctx = document.getElementById('emissionsChart').getContext('2d');
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, config);

    generateEcoTips(devEmissions, hostingEmissions, userEmissions);
}

function generateEcoTips(devEmissions, hostingEmissions, userEmissions) {
    const tips = {
        development: [
            "Implement green coding practices to reduce computational complexity",
            "Use energy-efficient development tools and equipment",
            "Enable power-saving modes on development machines",
            "Consider using lightweight IDEs when possible",
            "Implement code optimization techniques to reduce resource usage",
            "Use version control to avoid redundant development efforts",
            "Conduct regular code reviews for efficiency improvements"
        ],
        hosting: [
            "Switch to green hosting providers that use renewable energy",
            "Implement auto-scaling to optimize server resources",
            "Use containerization for better resource utilization",
            "Optimize database queries and implement efficient indexing",
            "Implement CDN for better content delivery and reduced server load",
            "Use server-side caching strategies",
            "Monitor and optimize cloud resource allocation",
            "Implement efficient load balancing strategies"
        ],
        user: [
            "Optimize application performance to reduce client-side processing",
            "Implement efficient caching strategies to reduce data transfer",
            "Compress images and media files without compromising quality",
            "Minimize JavaScript bundle sizes through code splitting",
            "Implement lazy loading for better resource utilization",
            "Use efficient data formats for API responses",
            "Optimize frontend rendering performance",
            "Implement progressive web app features for offline capabilities"
        ],
        general: [
            "Regular monitoring and reporting of carbon emissions",
            "Set environmental KPIs for the development team",
            "Educate team members about green coding practices",
            "Consider carbon impact in architectural decisions",
            "Implement sustainable development lifecycle practices"
        ]
    };

    const selectedTips = [];

    // Add tips based on emissions comparison
    if (devEmissions > hostingEmissions) {
        selectedTips.push(...tips.development.slice(0, 4));
    }
    if (hostingEmissions > userEmissions) {
        selectedTips.push(...tips.hosting.slice(0, 4));
    }
    if (userEmissions > devEmissions) {
        selectedTips.push(...tips.user.slice(0, 4));
    }

    // Always add some general tips
    selectedTips.push(...tips.general.slice(0, 3));

    const tipsList = document.getElementById('eco-tips');
    tipsList.innerHTML = selectedTips.map(tip => `<li>${tip}</li>`).join('');
}
