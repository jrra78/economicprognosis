//
var apiUrl = 'https://jrra.pythonanywhere.com';

async function getDataFromBanxicoSIESerie(serie) {
    //console.log(serie)
    var todayDate = Date.now();
    var obs = new Array();
    var obsDelta = new Array();
    var obsChange = new Array();
    let seriesData = serie['datos']
    seriesData.forEach(async(observation) => {
        if (observation['fecha'].includes('/')) {
            let [day, month, year] = observation['fecha'].split('/')
            let obsDate = new Date(+year, month-1, +day);
            if (obsDate<=todayDate) {
                let tmpValue = observation['dato'].replace(/,/g,'')
                if (isNaN(tmpValue)) {
                    obs.push([obsDate, null]) 
                } else {
                    obs.push([obsDate, parseFloat(tmpValue)]) 
                }
            }
        }
    })
    //
    obsDelta.push([obs[0][0], null])
    for (let j=1;j<obs.length; j++) {
        let delta = null;
        if (obs[j-1][1] !== null && obs[j][1] !== null) {
            delta = obs[j][1]-obs[j-1][1];
        }
        obsDelta.push([obs[j][0], delta])
    }
    //
    obsChange.push([obsDelta[0][0], null])
    for (let j=1; j<obsDelta.length; j++) {
        if (obsDelta[j][1] !== null && obs[j-1][1] !== null) {
            let sign = Math.sign(obsDelta[j][1])
            let change = 100*(Math.abs(obsDelta[j][1])/Math.abs(obs[j-1][1]))
            obsChange.push([obsDelta[j][0], sign*change])
        } else {
            obsChange.push([obsDelta[j][0], null])
        }
    }
    //
    serieObject = {'id': serie['idSerie'],
                   'name': serie['titulo'],
                   'shortName': '',
                   'obs': obs,
                   'obsDelta': obsDelta,
                   'obsChange':obsChange}
    return serieObject
} // end of - getDataFromBanxicoSIESerie
