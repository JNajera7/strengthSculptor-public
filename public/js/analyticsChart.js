(async () => {
    document.addEventListener('DOMContentLoaded', () => {
        const modal = new bootstrap.Modal(document.getElementById('welcomeModal'));
        modal.show();
    });

    const authDiv = document.getElementById('auth-data');
    const userSignedIn = authDiv?.dataset.userSignedIn === 'true';

    const muscleGroups = ['Chest', 'Shoulders', 'Back', 'Biceps', 'Triceps', 'Core', 'Glutes', 'Quadriceps', 'Hamstrings', 'Calves'];
    let dataValues = new Array(muscleGroups.length).fill(0);

    async function grabMuscleGroupsPercentiles() {
        try {
            const response = await fetch('/api/get-user-muscle-percentiles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.percentiles) {
                dataValues[0] = Math.round((data.percentiles['Chest'] ?? 0) * 100) / 100;
                dataValues[1] = Math.round((data.percentiles['Shoulders'] ?? 0) * 100) / 100;
                dataValues[2] = Math.round((data.percentiles['Back'] ?? 0) * 100) / 100;
                dataValues[3] = Math.round((data.percentiles['Biceps'] ?? 0) * 100) / 100;
                dataValues[4] = Math.round((data.percentiles['Triceps'] ?? 0) * 100) / 100;
                dataValues[5] = Math.round((data.percentiles['Core'] ?? 0) * 100) / 100;
                dataValues[6] = Math.round((data.percentiles['Glutes'] ?? 0) * 100) / 100;
                dataValues[7] = Math.round((data.percentiles['Quadriceps'] ?? 0) * 100) / 100;
                dataValues[8] = Math.round((data.percentiles['Hamstrings'] ?? 0) * 100) / 100;
                dataValues[9] = Math.round((data.percentiles['Calves'] ?? 0) * 100) / 100;

                console.log('Muscle group percentiles:', dataValues);
            } else {
                console.error('Failed to update percentiles');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    if (userSignedIn) {
        await grabMuscleGroupsPercentiles();
    } else {
        dataValues = [19, 35, 45, 40, 35, 50, 24, 27, 33, 21];
    }

    Chart.defaults.font.size = 16;
    const ctxAnalytics = document.getElementById('analyticsChart');

    function getColor(value) {
        if (value >= 0 && value < 20) {
            return 'rgba(255, 206, 86, 0.2)'; // Yellow - Beginner
        }
        if (value >= 20 && value < 40) {
            return 'rgba(255, 159, 64, 0.2)'; // Orange - Novice
        }
        if (value >= 40 && value < 50) {
            return 'rgba(255, 99, 132, 0.2)'; // Red - Intermediate
        }
        if (value >= 50 && value < 80) {
            return 'rgba(200, 45, 80, 0.2)'; // Dark Red - Advanced
        }
        if (value >= 80 && value < 95) {
            return 'rgba(99, 0, 170, 0.2)'; // Purple - Pro-level
        }
        if (value >= 95 && value <= 100) {
            return 'rgba(54, 75, 200, 0.2)'; // Deep Blue - World-Class
        }
    }

    //Get the APPROACHING level for a user's weakest and biggest muscle groups
    function getLevelUp(value) {
        let levelUpColor = '';
        let levelName = '';
        let levelUpNum = 0;

        if (value >= 0 && value < 20) {
            levelUpNum = 20;
            levelUpColor = getColor(levelUpNum);
            levelName = 'Intermediate';
        } else if (value >= 20 && value < 40) {
            levelUpNum = 40;
            levelUpColor = getColor(levelUpNum);
            levelName = 'Intermediate+';
        } else if (value >= 40 && value < 50) {
            levelUpNum = 50;
            levelUpColor = getColor(levelUpNum);
            levelName = 'Advanced';
        } else if (value >= 50 && value < 60) {
            levelUpNum = 80;
            levelUpColor = getColor(levelUpNum);
            levelName = 'Pro-level';
        } else if (value >= 60 && value < 80) {
            levelUpNum = 95;
            levelUpColor = getColor(levelUpNum);
            levelName = 'World-class';
        }

        return { levelName, levelUpColor, levelUpNum };
    }



    function getSmallestValue(value) {
        let smallest = value[0];
        let smallestIndex = 0;

        for (let i = 1; i < value.length; i++) {
            if (value[i] !== 0 && value[i] < smallest) {
                smallest = value[i];
                smallestIndex = i;
            }
        }
        return { smallest, smallestIndex };
    }

    function getBiggestValue(value) {
        let biggest = value[0];
        let biggestIndex = 0;

        for (let i = 0; i < value.length; i++) {
            if (value[i] > biggest) {
                biggest = value[i];
                biggestIndex = i;
            }
        }
        return { biggest, biggestIndex };
    }

    const smallestResult = getSmallestValue(dataValues);
    const { smallest, smallestIndex } = smallestResult;

    const biggestResult = getBiggestValue(dataValues);
    const { biggest, biggestIndex } = biggestResult;

    //log the % of weakest muscle group
    console.log(smallest, smallestIndex);
    //log the % of strongest muscle group
    console.log(biggest, biggestIndex);
    //save the strength level color for both
    const smallestMuscleColor = getColor(smallest);
    const smallestMuscleLevelUp = getLevelUp(smallest);

    const biggestMuscleColor = getColor(biggest);
    const biggestMuscleLevelUp = getLevelUp(biggest);

    //store these to use in other scripts
    window.smallestValue = smallest;
    window.smallestColor = smallestMuscleColor;
    window.smallestLevelUp = smallestMuscleLevelUp.levelName;
    window.smallestLevelUpColor = smallestMuscleLevelUp.levelUpColor;
    window.smallestLevelUpNum = smallestMuscleLevelUp.levelUpNum;

    window.biggestValue = biggest;
    window.biggestColor = biggestMuscleColor;
    window.biggestLevelUp = biggestMuscleLevelUp.levelName;
    window.biggestLevelUpColor = biggestMuscleLevelUp.levelUpColor;
    window.biggestLevelUpNum = biggestMuscleLevelUp.levelUpNum;


    function getMuscleGroup(index) {
        const muscleGroups = [
            'Chest',
            'Shoulders',
            'Back',
            'Biceps',
            'Triceps',
            'Core',
            'Glutes',
            'Quads',
            'Hamstrings',
            'Calves'
        ];
        return muscleGroups[index] || 'Unknown';
    }

    const smallestMuscleGroup = getMuscleGroup(smallestIndex);
    const biggestMuscleGroup = getMuscleGroup(biggestIndex);

    // Log the muscle groups
    console.log(`Weakest muscle group: ${smallestMuscleGroup}`);
    console.log(`Strongest muscle group: ${biggestMuscleGroup}`);

    document.getElementById("weakTitle").textContent += ` ${smallestMuscleGroup}`;
    document.getElementById("strongTitle").textContent += ` ${biggestMuscleGroup}`;

    new Chart(ctxAnalytics, {
        type: 'bar',
        data: {
            labels: ['Chest', 'Shoulders', 'Back', 'Biceps', 'Triceps', 'Core', 'Glutes', 'Quadriceps', 'Hamstrings', 'Calves'],
            datasets: [{
                label: 'Strength Percentile (%)',
                data: dataValues,
                backgroundColor: dataValues.map(getColor),
                borderColor: dataValues.map(value => getColor(value).replace('0.2', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: 60,
                    title: {
                        display: true,
                        text: 'Strength Percentile (%)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        generateLabels: function (chart) {
                            return [
                                {
                                    text: 'Beginner (0-20%)',
                                    fillStyle: 'rgba(255, 206, 86, 0.2)',
                                    strokeStyle: 'rgba(255, 206, 86, 1)',
                                    hidden: false,
                                    index: 0
                                },
                                {
                                    text: 'Intermediate (20-40%)',
                                    fillStyle: 'rgba(255, 159, 64, 0.2)',
                                    strokeStyle: 'rgba(255, 159, 64, 1)',
                                    hidden: false,
                                    index: 1
                                },
                                {
                                    text: 'Intermediate+ (40-50%)',
                                    fillStyle: 'rgba(255, 99, 132, 0.2)',
                                    strokeStyle: 'rgba(255, 99, 132, 1)',
                                    hidden: false,
                                    index: 2
                                },
                                {
                                    text: 'Advanced (50-80%)',
                                    fillStyle: 'rgba(200, 45, 80, 0.2)',
                                    strokeStyle: 'rgba(200, 45, 80, 1)',
                                    hidden: false,
                                    index: 3
                                },
                                {
                                    text: 'Pro-level (80-95%)',
                                    fillStyle: 'rgba(99, 0, 170, 0.2)',
                                    strokeStyle: 'rgba(99, 0, 170, 1)',
                                    hidden: false,
                                    index: 4
                                },
                                {
                                    text: 'World-Class (95-100%)',
                                    fillStyle: 'rgba(54, 75, 200, 0.2)',
                                    strokeStyle: 'rgba(54, 75, 200, 1)',
                                    hidden: false,
                                    index: 5
                                }
                            ];
                        }
                    }
                }
            }
        }
    })
    console.log('Calling weak/strong charts:')
    const loadScript = (src) => {
        //console.log('loadScript called')
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.body.appendChild(s);
        });
    };

    await loadScript('/js/weakChart.js')
        .then(() => loadScript('/js/strongChart.js'))
        .catch(console.error);

})();