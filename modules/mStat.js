//console.log("load mStat");

function mStat() {
    console.log("run mStat");
    $("#appBody").html(`<div style="height:40%; width:50%; display:inline-block;"><canvas id="vulnerStat1"></canvas></div><div style="height:40%; width:50%; display:inline-block;"><canvas id="vulnerStat2"></canvas></div><div id="tabStat" style="display:inline-block;"></div>`
    );
    createTabulatorStat();
    showVulnerStat1();
    showVulnerStat2();
}

//=======================================================================================
// график количества компьютеров с уязвимостями по ИФНС =================================
//=======================================================================================
function showVulnerStat2() {
    let ctx = document.getElementById('vulnerStat2');

    let data = {   labels: "",   datasets: []  };

    let config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    display: false
                },
                title: {
                    display: true,
                    text: 'количество экземпляров уязвимостей по каждой инспекции'
                }
            }
        },
    };

    getVulnerStat2(data, '00', randomColor(100))
        .then((d) => getVulnerStat2(d, '52', randomColor(100)))
        .then((d) => getVulnerStat2(d, '54', randomColor(100)))
        .then((d) => getVulnerStat2(d, '64', randomColor(100)))
        .then((d) => getVulnerStat2(d, '65', randomColor(100)))
        .then((d) => getVulnerStat2(d, '71', randomColor(100)))
        .then((d) => getVulnerStat2(d, '73', randomColor(100)))
        .then((d) => getVulnerStat2(d, '74', randomColor(100)))
        .then((d) => getVulnerStat2(d, '81', randomColor(100)))
        .then((d) => getVulnerStat2(d, '82', randomColor(100)))
        .then((d) => getVulnerStat2(d, '83', randomColor(100)))
        .then((d) => getVulnerStat2(d, '86', randomColor(100)))
        .then((d) => getVulnerStat2(d, '88', randomColor(100)))
        .then((d) => getVulnerStat2(d, '91', randomColor(100)))
        .then((d) => getVulnerStat2(d, '92', randomColor(100)))
        .then((d) => getVulnerStat2(d, '93', randomColor(100)))
        .then((d) => getVulnerStat2(d, '94', randomColor(100)))
        .then((d) => getVulnerStat2(d, '95', randomColor(100)))
        .then((d) => getVulnerStat2(d, '96', randomColor(100)))
        .then((d) => console.log(d))
        .then(() => { Stat2 = new Chart(ctx, config); });
}

//=======================================================================================
// график количества типов уязвимостей по ИФНС ==========================================
//=======================================================================================
function showVulnerStat1() {
    let ctx = document.getElementById('vulnerStat1');

    let data = {   labels: "",   datasets: []  };

    let config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    display: false
                },
                title: {
                    display: true,
                    text: 'количество типов уязвимостей по каждой инспекции'
                }
            }
        },
    };

    getVulnerStat1(data, '00', randomColor(100))
        .then((d) => getVulnerStat1(d, '52', randomColor(100)))
        .then((d) => getVulnerStat1(d, '54', randomColor(100)))
        .then((d) => getVulnerStat1(d, '64', randomColor(100)))
        .then((d) => getVulnerStat1(d, '65', randomColor(100)))
        .then((d) => getVulnerStat1(d, '71', randomColor(100)))
        .then((d) => getVulnerStat1(d, '73', randomColor(100)))
        .then((d) => getVulnerStat1(d, '74', randomColor(100)))
        .then((d) => getVulnerStat1(d, '81', randomColor(100)))
        .then((d) => getVulnerStat1(d, '82', randomColor(100)))
        .then((d) => getVulnerStat1(d, '83', randomColor(100)))
        .then((d) => getVulnerStat1(d, '86', randomColor(100)))
        .then((d) => getVulnerStat1(d, '88', randomColor(100)))
        .then((d) => getVulnerStat1(d, '91', randomColor(100)))
        .then((d) => getVulnerStat1(d, '92', randomColor(100)))
        .then((d) => getVulnerStat1(d, '93', randomColor(100)))
        .then((d) => getVulnerStat1(d, '94', randomColor(100)))
        .then((d) => getVulnerStat1(d, '95', randomColor(100)))
        .then((d) => getVulnerStat1(d, '96', randomColor(100)))
        .then((d) => console.log(d))
        .then(() => { Stat1 = new Chart(ctx, config); });
}

//=======================================================================================
// загрузка данных по компьютеров с уязвимостями для sono ===============================
//=======================================================================================
function getVulnerStat2(dd, sono, color) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT ms.name, SUM(vs.n${sono}) AS n_comps FROM maxscan AS ms JOIN vulner_stat AS vs ON ms.id=vs.id_scan GROUP BY ms.name ORDER BY ms.name`;
        runSQL_p(sql).then((r) => {
            let res = eval(r);
            let scan_name = [];
            res.forEach((d) => { scan_name.push(d.name) });

            let data_vulners = [];
            res.forEach((d) => { data_vulners.push(d.n_comps) });

            dataset = {
                label: '61' + sono,
                backgroundColor: color,
                borderColor: color,
                data: data_vulners,
                tension: 0.2,
            }

            dd.labels = scan_name;
            dd.datasets.push(dataset);
            //console.log(sono,dataset);
            resolve(dd);
        });
    });
}

//=======================================================================================
// загрузка данных по уязвимостям для sono ==============================================
//=======================================================================================
function getVulnerStat1(dd, sono, color) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT ms.name, SUM(IF(vs.id_vulner=0,0,1)*IF(vs.n${sono}=0,0,1)) AS n_vulners FROM maxscan AS ms JOIN vulner_stat AS vs ON ms.id=vs.id_scan GROUP BY ms.name ORDER BY ms.name`;
        runSQL_p(sql).then((r) => {
            let res = eval(r);
            let scan_name = [];
            res.forEach((d) => { scan_name.push(d.name) });

            let data_vulners = [];
            res.forEach((d) => { data_vulners.push(d.n_vulners) });

            dataset = {
                label: '61' + sono,
                backgroundColor: color,
                borderColor: color,
                data: data_vulners,
                tension: 0.2,
            }

            dd.labels = scan_name;
            dd.datasets.push(dataset);
            //console.log(sono,dataset);
            resolve(dd);
        });
    });
}

//=======================================================================================
// табулятор статистики сканирования ====================================================
//=======================================================================================

function createTabulatorStat() {
    tableStat = new Tabulator("#tabStat", {
        ajaxURL: "myphp/loadDataStat.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        layout: "fitDataTable",
        tooltipsHeader: true,
        rowContextMenu: rowMenu(),
        rowFormatter: function (row) {
            if (row.getData().nstat > 95) { row.getElement().style.backgroundColor = "#39ed7e"; }
            if (row.getData().nstat < 50) { row.getElement().style.backgroundColor = "#ff7575"; }
        },
        headerFilterPlaceholder: "",
        columns: [
            { title: "СОНО", field: "sono" },
            { title: "компьютеров", field: "ncomp" },
            { title: "штат", field: "schtat" },
            { title: "%", field: "nstat" },
            {
                title: "%", field: "nstat", width: 300, formatter: "progress", formatterParams: {
                    min: 0,
                    max: 150,
                    color: ["red", "orange", "green"],
                    legendColor: "#000000",
                    legendAlign: "center",
                }
            }
        ],
        //cellContext:function(e, cell){tableStat.print(false, false);e.preventDefault();},
    });
}
