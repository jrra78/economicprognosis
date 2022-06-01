//

async function plotSeries(id, shortName) {
            
    async function deleteChildsInModalWindowBody() {
        console.log('deleting child elements if any')
        if (modalWindowBody.hasChildNodes()==true) {
            while (modalWindowBody.firstChild) {
                modalWindowBody.removeChild(modalWindowBody.firstChild)
            }
        }
        return true
    }

    async function addContainersToModalWindowBody() {
        var divsToAdd = ['obsPlotButtonsCont','obsPlotCont', 'obsDeltaPlotCont', 'obsChangePlotCont', 'inProgressCont'];
        for (let j=0; j<divsToAdd.length; j++) {
            let newDiv = document.createElement('div');
            newDiv.classList.add('container-fluid');
            newDiv.id = divsToAdd[j].trim();
            modalWindowBody.appendChild(newDiv)
        }
        return true
    }

    async function addChart(serieAsArray,containerInScope) {
                        
        function drawChart() {
            var data = google.visualization.arrayToDataTable([['Year', 'Sales', 'Expenses'],
                                                              ['2004',  1000,      400],
                                                              ['2005',  1170,      460],
                                                              ['2006',  660,       1120],
                                                              ['2007',  1030,      540]]);

            var options = {title: 'Company Performance',
                           curveType: 'function',
                           legend: { position: 'bottom' }};
            var chart = new google.visualization.LineChart(document.getElementById(containerInScope));
            chart.draw(data, options);
        };

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

    }

    console.log(id, shortName)
    var result;
    var modalWindow = new bootstrap.Modal(document.getElementById("modalWindow"), {});
    if (modalWindow) {
        modalWindowTitle.innerText = id + ' - ' + shortName;
        modalWindow.show();
        result = await deleteChildsInModalWindowBody();
        result = await addContainersToModalWindowBody();
        console.log(id)
        if (sessionStorage.getItem(id) !== null) {
            let serieInScope = sessionStorage.getItem(id);
            if (typeof(serieInScope) !== 'undefined' || serieInScope !== null) {
                seriesObject = JSON.parse(serieInScope)
                obs = seriesObject['obs'];
                addChart(obs,'obsPlotCont')   // adds plot to obsPlotCont
                obsDelta = seriesObject['obsDelta'];
                obsChange = seriesObject['obsChange'];
                console.log(obs, obsDelta, obsChange)
            }
        }
    }
}