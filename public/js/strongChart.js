
// Get strongest muscle group from analyticsChart
console.log('Strong Chart initializing...')
const dataValueStrong = window.biggestValue;
const dataColorStrong = window.biggestColor;
const dataLevelUpStrong = window.biggestLevelUp;
const dataLevelUpColorStrong = window.biggestLevelUpColor.replace('0.2', '1');
const dataLevelUpNumStrong = window.biggestLevelUpNum;

const borderColorStrong = dataColorStrong.replace('0.2', '1');

const ctxStrong = document.getElementById('strongChart');

new Chart(ctxStrong, {
    type: 'bar',
    data: {
        labels: [''],
        datasets: [{
            data: [dataValueStrong],
            backgroundColor: dataColorStrong,
            borderColor: borderColorStrong
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 40,
                bottom: 20
            },
        },
        elements: {
            bar: {
                borderWidth: 1,
            }
        },
        barThickness: 50,
        scales: {
            y: {
                max: dataLevelUpNum,
                ticks: {
                    stepSize: 10,
                }
            }
        },
        indexAxis: 'y',
        plugins: {
            legend: {
                display: false
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        xMin: dataLevelUpNumStrong,
                        xMax: dataLevelUpNumStrong,
                        borderColor: dataLevelUpColorStrong,
                        borderWidth: 1,
                        label: {
                            content: 'Next Level: ' + dataLevelUpStrong,
                            enabled: true,
                            position: {
                                x: 'center',
                                y: 'start',
                            },
                            xAdjust: 0,
                            yAdjust: -60,
                            backgroundColor: dataLevelUpColorStrong,
                            color: 'white',
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        }
    }
});