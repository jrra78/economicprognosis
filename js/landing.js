//

async function initialInsight(seriesInScope) {

    function addTable() {
        var container = document.getElementById('appContent');
        var table = document.createElement('table');
        var tableBody = document.createElement('tbody');
        var tableHead = document.createElement('thead')
        //
        var columnsInScope = ['serie<br>id', 'descripcion<br>&nbsp;', 'current<br>date', 'current<br>value',
                              'previous<br>date', 'previous<br>Value', 'delta<br>&nbsp;', 'change<br>%']
        for (let j=0; j<columnsInScope.length; j++) {
            let columnHeader = document.createElement('th');
            columnHeader.innerHTML = columnsInScope[j]
            tableHead.appendChild(columnHeader)
        }
        table.appendChild(tableHead);
        // 
        for (let j=0; j<=8; j++) {
            let row = document.createElement('tr');
            for (let k=0; k<columnsInScope.length; k++) {
                let column = document.createElement('td');
                column.id = 'initialInsight_r' + (j+1).toString() + 'c' + (k+1).toString();
                if (k == 0) {
                    var hyperlink = document.createElement('a');
                    hyperlink.id = 'initialInsight_r' + (j+1).toString();
                    hyperlink.classList.add('btn')
                    column.appendChild(hyperlink);
                }
                row.appendChild(column);
            }
            tableBody.appendChild(row);
        }
        table.appendChild(tableBody);
        table.classList.add('table', 'table-bordered', 'table-striped', 'table-sm')
        container.appendChild(table);
    }


    async function mapSeriesToTable(serieObject) {
        // prevObsDate prevObsValue delta change
        let row;
        let shortName;
        let lastPos = serieObject['obs'].length-1;
        let lastObsDate = serieObject['obs'][serieObject['obs'].length-1][0];
        let lastObsValue = serieObject['obs'][serieObject['obs'].length-1][1];
        let prevObsDate = serieObject['obs'][serieObject['obs'].length-2][0];
        let prevObsValue = serieObject['obs'][serieObject['obs'].length-2][1];
        let delta = serieObject['obsDelta'][serieObject['obsDelta'].length-1][1];
        let change = serieObject['obsChange'][serieObject['obsChange'].length-1][1];
        //
        let idInScope = serieObject['id'];
        switch  (serieObject['id']) {
            case 'SF61745':
                row = 1;
                shortName = 'Targeted interest rate';
                break;
            case 'SF331451':
                row = 2;
                shortName = 'Interbank Equilibrium Interest Rate (TIIE)';
                break;
            case 'SF43783':
                row = 3;
                shortName = 'Interbank Equilibrium Interest Rate (TIIE-28)';
                break;
            case 'SF43936':
                row = 4;
                shortName = 'Goverment issued securities (CETES)- 28 days';
                break;
            case 'SF43718':
                row = 5;
                shortName = 'Exchange rate Fix (MXN per USD)';
                break;
            case 'SF43707':
                row = 6;
                shortName = 'International reserves in USD MM';
                break;
            case 'SP30578':
                row = 7;
                shortName = 'National Consumer Price Index (INPC)- Yearly';
                break;
            case 'SP74625':
                row = 8;
                shortName = 'Underlying National Consumer Price Index (INPC-S))';
                break;
            case 'SP68257':
                row = 9;
                shortName = 'Indexed Unit of Funds (UDI)';
        };

        serieKeyDataObject = {'row': row, 'id':serieObject['id'],
                              'shortName': shortName,
                              'lastObsDate': lastObsDate,
                              'lastObsValue': lastObsValue,
                              'prevObsDate': prevObsDate, 
                              'prevObsValue': prevObsValue,
                              'delta': delta,
                              'change': change}
        return serieKeyDataObject;
    } // end of - mapSerietoDict

    function updateTable(serieKeyDataObject) {
        let hyperlink = document.getElementById('initialInsight_r' + serieKeyDataObject['row'])
        hyperlink.innerText = serieKeyDataObject['id'].trim()
        hyperlink.addEventListener('click', function() {
            plotSeries(serieKeyDataObject['id'], serieKeyDataObject['shortName'])
        })
        let shortName = document.getElementById('initialInsight_r' + serieKeyDataObject['row'] + 'c2')
        shortName.innerText = serieKeyDataObject['shortName'].trim()
        let lastObsDate = document.getElementById('initialInsight_r' + serieKeyDataObject['row'] + 'c3');
        lastObsDate.innerText = serieKeyDataObject['lastObsDate'].toISOString().split('T')[0]
        let lastObsValue = document.getElementById('initialInsight_r' + serieKeyDataObject['row'] + 'c4')
        lastObsValue.innerText = serieKeyDataObject['lastObsValue'].toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        let prevObsDate = document.getElementById('initialInsight_r' + serieKeyDataObject['row'] + 'c5');
        prevObsDate.innerText = serieKeyDataObject['prevObsDate'].toISOString().split('T')[0]
        let prevObsValue = document.getElementById('initialInsight_r' + serieKeyDataObject['row'] + 'c6')
        prevObsValue.innerText = serieKeyDataObject['prevObsValue'].toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        let delta = document.getElementById('initialInsight_r' + serieKeyDataObject['row'] + 'c7')
        delta.innerText = serieKeyDataObject['delta'].toFixed(4)
        let change = document.getElementById('initialInsight_r' + serieKeyDataObject['row'] + 'c8')
        change.innerText = serieKeyDataObject['change'].toFixed(4)
    }


    var seriesInScope = 'SF61745,SF331451,SF43783,SF43936,SF43718,SF43707,SP30578,SP74625,SP68257';
    var yearlyIndices = ['SP74625'];
    var inputData = {'seriesInScope': seriesInScope};
    var endPoint = apiUrl + '/brokers/sie_api';
    var apiResponse = null;
    init = {method: 'POST',
            body: JSON.stringify(inputData),
            cache: 'no-cache',
            headers: new Headers ({'content-type': 'application/json'})}
    var apiResponse = fetch(endPoint, init)
    .then(function(response) {
        if (response.status === 200) {
            response.json().then(function(returnedJson) {
                //
                series = returnedJson['bmx']['series']
                deleteChildsInAppContent()
                addTable()
                //
                series.forEach(async(serie) => {
                    //
                    let serieObject = await getDataFromBanxicoSIESerie(serie)
                    let serieId = serieObject['id']
                    if (yearlyIndices.includes(serie['idSerie'])) {
                        let newSeriesObject = await getNewSeriesFromIndices(serieObject);
                        serieObject['obs'] = newSeriesObject['newObs'];
                        serieObject['obsDelta'] = newSeriesObject['newObsDelta'];
                        serieObject['obsChange'] = newSeriesObject['newObsChange'];
                    }
                    //
                    if (sessionStorage.getItem(serieId) === null) {
                        sessionStorage.setItem(serieId, JSON.stringify(serieObject))
                    } else {
                        sessionStorage.removeItem(serieId)
                        sessionStorage.setItem(serieId, JSON.stringify(serieObject))
                    }
                    //
                    let serieKeyDataObject = await mapSeriesToTable(serieObject)
                    updateTable(serieKeyDataObject)
                });
                appLoading.classList.replace('d-block', 'd-none')
                appContent.classList.replace('d-none', 'd-block')
            });
        } else {
            return null;
        }
    })
}; // end of - initialInsight


appLoading.classList.replace('d-none', 'd-block')
appContent.classList.replace('d-block', 'd-none')
document.addEventListener('DOMContentLoaded', () => {
    initialInsight()
});