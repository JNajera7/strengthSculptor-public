console.log('weak chart initializing...')
// Get weakest muscle group data from analyticsChart
const dataValue = window.smallestValue;
const dataColor = window.smallestColor;
const dataLevelUp = window.smallestLevelUp;
const dataLevelUpColor = window.smallestLevelUpColor.replace('0.2', '1');
const dataLevelUpNum = window.smallestLevelUpNum;

const borderColor = dataColor.replace('0.2', '1');

const ctxWeak = document.getElementById('weakChart');

new Chart(ctxWeak, {
    type: 'bar',
    data: {
        labels: [''],
        datasets: [{
            data: [dataValue],
            backgroundColor: dataColor,
            borderColor: borderColor
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        elements: {
            bar: {
                borderWidth: 1,
            }
        },
        layout: {
            padding: {
                top: 40,
                bottom: 20
            },
        },
        scales: {
            y: {
                max: dataLevelUpNum,
                ticks: {
                    stepSize: 10,
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        xMin: dataLevelUpNum,
                        xMax: dataLevelUpNum,
                        borderColor: dataLevelUpColor,
                        borderWidth: 1,
                        label: {
                            content: 'Next level: ' + dataLevelUp,
                            enabled: true,
                            position: {
                                x: 'center',
                                y: 'center',
                            },
                            xAdjust: 0,
                            yAdjust: -60,
                            backgroundColor: dataLevelUpColor,
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