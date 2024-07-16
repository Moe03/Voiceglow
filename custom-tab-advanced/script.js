// the following script only runs once on loading the tab.
// We heavily use tailwind so you can use it as well! https://tailwindui.com/ (Not all classes are available, inline styles/custom css more reliable.)
// More advanced example here: https://github.com/Moe03/Voiceglow
function updateDom(dashboardVars) {
    const renderDiv = document.getElementById(`render-div`);
    if (!renderDiv) {
        console.error(`No render-div found in the document.`);
        return;
    }
    document.getElementById(`render-div`).innerHTML = `
    <h1>Hello world!</h1>
    <p>Selected Agent: ${dashboardVars?.selectedAgent.title}</p>
    <p>Client Email: ${dashboardVars?.userData?.email}</p>
    <p>Org Name: ${dashboardVars?.orgData?.name}</p>
    <div class="flex flex-col gap-4">
        <p>Org Agents:</p>
        ${dashboardVars?.orgAgents?.map(agent => `
        <div class="flex gap-2">
            <img class="rounded-full object-cover w-5 h-5" src="${agent.roundedImageURL}" />
            <p>${agent.title}</p>
        </div>
        `).join("")}
    </div>

    <br />
    <p>DEBUG: ${JSON.stringify(dashboardVars)}</p>
`;
}
try {
    if (window.VG_DASHBOARD) {
        updateDom(window.VG_DASHBOARD);
    }
    window.addEventListener('dashboard-event', (event) => {
        const dashboardVars = event.detail;   // this contains all information about the logged in user.
        updateDom(dashboardVars);
    });
} catch (error) {
    console.log(`error: `, error)
}
