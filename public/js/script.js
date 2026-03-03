
console.log("✅ script.js is loaded and running.");


const exercises = [
    { name: 'Bench Press (Barbell)', group: 'Chest', muscle: 'Lower Chest', equipment: 'Barbell' },
    { name: 'Incline Bench Press (Barbell)', group: 'Chest', muscle: 'Upper Chest', equipment: 'Barbell' },
    { name: 'Bench Press (Dumbbell)', group: 'Chest', muscle: 'Lower Chest', equipment: 'Dumbbell' },
    { name: 'Incline Bench Press (Dumbbell)', group: 'Chest', muscle: 'Upper Chest', equipment: 'Dumbbell' },
    { name: 'Chest Fly Machine', group: 'Chest', muscle: 'Lower Chest', equipment: 'Machine' },
    { name: 'Push-Up', group: 'Chest', muscle: 'Lower Chest', equipment: 'Bodyweight', noWeight: true },
    { name: 'Chest Press (Machine)', group: 'Chest', muscle: 'Lower Chest', equipment: 'Machine' },
    { name: 'Decline Bench Press (Barbell)', group: 'Chest', muscle: 'Lower Chest', equipment: 'Barbell' },
    { name: 'Decline Bench Press (Dumbbell)', group: 'Chest', muscle: 'Lower Chest', equipment: 'Dumbbell' },

    { name: 'Squat', group: 'Legs', muscle: 'Quadriceps', equipment: 'Barbell' },
    { name: 'Front Squat', group: 'Legs', muscle: 'Quadriceps', equipment: 'Barbell' },
    { name: 'Bulgarian Split Squat', group: 'Legs', muscle: 'Glutes', equipment: 'Dumbbell' },
    { name: 'Seated Leg Curl', group: 'Legs', muscle: 'Hamstrings', equipment: 'Machine' },
    { name: 'Leg Extension', group: 'Legs', muscle: 'Quadriceps', equipment: 'Machine' },
    { name: 'Horizontal Leg Press', group: 'Legs', muscle: 'Glutes', equipment: 'Machine' },
    { name: 'Standing Calf Raise', group: 'Legs', muscle: 'Calves', equipment: 'Machine' },
    { name: 'Hip Abduction', group: 'Legs', muscle: 'Abductors', equipment: 'Machine' },
    { name: 'Hip Adduction', group: 'Legs', muscle: 'Adductors', equipment: 'Machine' },
    { name: 'Hack Squat', group: 'Legs', muscle: 'Quadriceps', equipment: 'Machine' },
    { name: 'Hip Thrust (Barbell)', group: 'Legs', muscle: 'Glutes', equipment: 'Barbell' },
    { name: 'Romanian Deadlift', group: 'Legs', muscle: 'Hamstrings', equipment: 'Barbell' },
    { name: 'Deadlift (Barbell)', group: 'Legs', muscle: 'Hamstrings', equipment: 'Barbell' },
 
    { name: 'Barbell Row', group: 'Back', muscle: 'Lats', equipment: 'Barbell' },
    { name: 'T-Bar Row', group: 'Back', muscle: 'Lats', equipment: 'Machine' },
    { name: 'Lat Pulldown', group: 'Back', muscle: 'Lats', equipment: 'Cable' },
    { name: 'Seated Cable Row', group: 'Back', muscle: 'Upper Back', equipment: 'Cable' },
    { name: 'Pull-Up', group: 'Back', muscle: 'Lats', equipment: 'Bodyweight', noWeight: true },
    { name: 'Face Pull', group: 'Back', muscle: 'Rear Delts', equipment: 'Cable' },

    { name: 'Overhead Press (Barbell)', group: 'Shoulders', muscle: 'Front Delts', equipment: 'Barbell' },
    { name: 'Overhead Press (Dumbbell)', group: 'Shoulders', muscle: 'Front Delts', equipment: 'Dumbbell' },
    { name: 'Lateral Raise', group: 'Shoulders', muscle: 'Middle Delts', equipment: 'Dumbbell' },
    { name: 'Rear Delt Fly', group: 'Shoulders', muscle: 'Rear Delts', equipment: 'Dumbbell' },
    { name: 'Machine Reverse Fly', group: 'Shoulders', muscle: 'Rear Delts', equipment: 'Machine' },
    { name: 'Front Raise (Dumbbell)', group: 'Shoulders', muscle: 'Front Delts', equipment: 'Dumbbell' },

    { name: 'Bicep Curl (Dumbbell)', group: 'Arms', muscle: 'Biceps', equipment: 'Dumbbell' },
    { name: 'Preacher Curl', group: 'Arms', muscle: 'Biceps', equipment: 'Machine' },
    { name: 'Tricep Pushdown', group: 'Arms', muscle: 'Triceps', equipment: 'Cable' },
    { name: 'Skull Crushers', group: 'Arms', muscle: 'Triceps', equipment: 'Barbell' },
    { name: 'Hammer Curl (Dumbbell)', group: 'Arms', muscle: 'Forearms', equipment: 'Dumbbell' },

    { name: 'Plank', group: 'Core', muscle: 'Abdominals', equipment: 'Bodyweight' },
    { name: 'Crunches', group: 'Core', muscle: 'Abdominals', equipment: 'Bodyweight', noWeight: true },
    { name: 'Hanging Leg Raise', group: 'Core', muscle: 'Obliques', equipment: 'Bodyweight', noWeight: true },
    { name: 'Cable Woodchopper', group: 'Core', muscle: 'Obliques', equipment: 'Cable' },
    { name: 'Sit-Ups', group: 'Core', muscle: 'Abdominals', equipment: 'Bodyweight', noWeight: true }
];

function renderExercises() { //Changes "Select Exercise" options depending on the filters
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGroup = muscleFilter.value;
    const selectedEquipment = equipmentFilter.value;
    const selectedMuscle = individualMuscleFilter.value;
    exerciseList.innerHTML = '';

    const filtered = exercises.filter(ex => {
        const matchesGroup = !selectedGroup || ex.group === selectedGroup;
        const matchesEquipment = !selectedEquipment || ex.equipment === selectedEquipment;
        const matchesMuscle = !selectedMuscle || ex.muscle === selectedMuscle;
        const matchesSearch = ex.name.toLowerCase().includes(searchTerm);

        return matchesGroup && matchesEquipment && matchesMuscle && matchesSearch;
    });

    filtered.forEach(ex => {
        const li = document.createElement('li');
        li.className = 'list-group-item list-group-item-action';
        li.textContent = ex.name;
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => {
            selectedExercise = ex.name;
            dropdownToggle.textContent = selectedExercise;
            dropdownPanel.style.display = 'none';

            if (ex?.noWeight) {
                weightInput.value = '';
                weightInput.disabled = true;
            } else {
                weightInput.disabled = false;
            }

            if (ex.equipment == 'Dumbbell') {
                dumbbellNotification.hidden = false;
            } else {
                dumbbellNotification.hidden = true;
            }
            repsInput.disabled = false;
            weightDropdown.disabled = false;
        });
        exerciseList.appendChild(li);
    });

    if (filtered.length === 0) {
        exerciseList.innerHTML = '<li class="list-group-item text-muted">No matches found</li>';
    }
}

function getStrengthLevel(percentile) {
    let level = '';

    if (percentile >= 5 && percentile < 20) { level = 'Beginner'; } else if (percentile >= 20 && percentile < 50) {
        level = 'Intermediate';
    } else if (percentile >= 50 && percentile < 80) { level = 'Advanced'; } else if
        (percentile >= 80 && percentile < 95) { level = 'Pro-Level'; } else if (percentile >= 95) {
            level = 'World-Class';
        }

    return level;
}

function getStrengthStandards(userOneRepMax, userBodyweight, exercise, userGender) {
    fetch('/api/get-strength-standards', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            bodyweight: userBodyweight,
            exercise: exercise,
            gender: userGender
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok :(');
            }
            return response.text(); // Parse the response as JSON
        })
        .then(text => {
            if (text.trim() === '') { // Check if the response text is empty
                throw new Error('Empty response body');
            }
            try {
                const data = JSON.parse(text);
                console.log('Strength standards:', data);

                let interpolated = [];
                if (userBodyweight % 10 == 0) { interpolated = data } else {
                    //Create new strength-standards for user's BW:
                    interpolated = interpolateLevels(data, userBodyweight);
                }

                console.log('Interpolated standards:', interpolated);

                const tbody = document.getElementById('results-body');
                tbody.innerHTML = ''; // clear previous rows

                // Create one row with the interpolated data
                const row = document.createElement('tr');

                // Add bodyweight
                const rmCell = document.createElement('th');
                rmCell.scope = 'row';
                rmCell.textContent = Math.round(userOneRepMax);
                row.appendChild(rmCell);

                // Add each level's 1RM
                const levelOrder = ['Beginner', 'Intermediate', 'Advanced', 'Pro-Level', 'World-Class'];
                levelOrder.forEach(level => {
                    const cell = document.createElement('td');
                    const match = interpolated.find(l => l.level === level);
                    cell.textContent = match ? Math.round(match.one_rep_max) : '-';
                    row.appendChild(cell);
                });

                tbody.appendChild(row);

            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function getStrengthData(userBodyweight, userOneRepMax, exercise, userGender, repOnlyExercise) {
    try {
        const response = await fetch('/api/get-strength-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bodyweight: userBodyweight,
                oneRepMax: userOneRepMax,
                exercise: exercise,
                gender: userGender
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const text = await response.text();

        if (text.trim() === '') {
            throw new Error('Empty response body');
        }

        const data = JSON.parse(text);
        console.log('Strength data:', data);

        // Interpolation
        const x1 = data[0].one_rep_max;
        const x2 = data[1].one_rep_max;
        const y1 = data[0].percentile;
        const y2 = data[1].percentile;

        const y = y1 + ((userOneRepMax - x1) * (y2 - y1)) / (x2 - x1);
        const userPercentile = y.toFixed(2);

        const resultContainer = document.getElementById('resultsContainer');
        const resultHeader = resultContainer.querySelector('h3');
        const result1RM = document.getElementById('result1RM');
        const resultPercentile = document.getElementById('resultPercentile');
        const level = getStrengthLevel(userPercentile);

        resultHeader.innerHTML = `Your strength level for ${exercise} is ${level}`;
        const { fullMedals, transparentMedal } = calculateMedals(userPercentile);

        let medalsHTML = '';
        for (let i = 0; i < fullMedals; i++) {
            medalsHTML += '<i class="fa-solid fa-medal" style="font-size: 3rem; color: gold;"></i>';
        }
        if (transparentMedal) {
            let opacity = transparentMedal / 100;
            medalsHTML += `<i class="fa-solid fa-medal" style="font-size: 3rem; color: rgba(255, 215, 0, ${opacity});"></i>`;
        }

        document.getElementById("medals").innerHTML = medalsHTML;
        if (!repOnlyExercise) {
            result1RM.innerHTML = `
            Your estimated 1 rep maximum is <strong>${Math.round(userOneRepMax)}</strong> lbs.
        `;
        }
        resultPercentile.innerHTML = `
            <p>You are stronger than approximately <strong>${userPercentile}%</strong> of lifters at your bodyweight.</p>
        `;

        resultContainer.hidden = false;
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

        return userPercentile;

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function storeUserSet(exercise, setReps, setWeight, set1RM, percentile) {
    const exerciseName = exercise;
    const result = exercises.find(ex => ex.name === exerciseName);
    let muscleGroup = result.group;

    if (!result) {
        console.log('Exercise not found');
    }

    if (muscleGroup == 'Legs' || muscleGroup == 'Arms') {
        muscleGroup = result.muscle;
    }

    fetch('/api/store-user-set', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            exercise: exercise,
            setReps: setReps,
            setWeight: setWeight,
            set1RM: set1RM,
            percentile: percentile,
            muscleGroup: muscleGroup
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok :(');
            }
            return response.text(); // Parse the response as JSON
        })
        .then(text => {
            console.log('user data inserted successfully!');
            updateUserMuscleGroupPercentile(muscleGroup);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function interpolateLevels(data, userBW) {
    // Separate into low and high based on bodyweight
    const lowBW = Math.min(...data.map(d => d.bodyweight_lbs));
    const highBW = Math.max(...data.map(d => d.bodyweight_lbs));

    const lowRows = data.filter(row => row.bodyweight_lbs === lowBW);
    const highRows = data.filter(row => row.bodyweight_lbs === highBW);

    if (lowRows.length !== 5 || highRows.length !== 5) {
        throw new Error("Expected 5 rows for each bodyweight bracket.");
    }

    return lowRows.map((lowRow, i) => {
        const highRow = highRows.find(r => r.level === lowRow.level);
        const est1RM = lowRow.one_rep_max + ((userBW - lowBW) / (highBW - lowBW)) * (highRow.one_rep_max -
            lowRow.one_rep_max);

        return {
            bodyweight_lbs: userBW,
            level: lowRow.level,
            one_rep_max: Math.round(est1RM)
        };
    });
}

function calculateMedals(percentile) {
    let fullMedals = 0;
    let transparentMedal = 0;

    if (percentile >= 5 && percentile < 20) {
        fullMedals = 1;
        transparentMedal = Math.floor(((percentile - 5) / 15) * 99);
    } else if (percentile >= 20 && percentile < 50) {
        fullMedals = 2;
        transparentMedal = Math.floor(((percentile - 20) / 30) * 99);
    } else if (percentile >= 50 && percentile < 80) {
        fullMedals = 3;
        transparentMedal = Math.floor(((percentile - 50) / 30) * 99);
    } else if (percentile >= 80 && percentile < 95) {
        fullMedals = 4;
        transparentMedal = Math.floor(((percentile - 80) / 15) * 99);
    } else if (percentile >= 95) {
        fullMedals = 5;
        transparentMedal = 0; // No transparent medal for the 95th percentile, only full medals
    }

    return { fullMedals, transparentMedal };
}

function setUnitBodyweight(unit) {
    document.getElementById('unitDropdown').innerText = unit;
}

function setUnitLift(unit) {
    document.getElementById('unitDropdown2').innerText = unit;
}

function updateUserMuscleGroupPercentile(muscleGroup) {
    fetch('/update-muscle-group-percentile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ muscleGroup })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log('Muscle percentile updated:', muscleGroup);
            } else {
                console.error('Failed to update percentile');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

window.addEventListener("DOMContentLoaded", () => {
    console.log('Page is fully loaded');

    //Listen for changes in the Select Exercise search
    searchInput.addEventListener('input', renderExercises);
    muscleFilter.addEventListener('change', renderExercises);
    equipmentFilter.addEventListener('change', renderExercises);
    individualMuscleFilter.addEventListener('change', renderExercises);
    renderExercises();

    const container = document.querySelector(".nav-scroll-container");
    const activeBubble = document.querySelector(".bubble.active");

    if (container && activeBubble) {
        const containerRect = container.getBoundingClientRect();
        const bubbleRect = activeBubble.getBoundingClientRect();

        const scrollLeft = activeBubble.offsetLeft - (container.offsetWidth / 2) + (activeBubble.offsetWidth / 2);
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const unitInput = document.getElementById('unit');
    const unitDropdown = document.getElementById('unitDropdown');
    const menu = document.getElementById('unitDropdownMenu');

    menu.querySelectorAll('a.dropdown-item').forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const selectedUnit = item.getAttribute('data-unit');
            unitInput.value = selectedUnit;
            unitDropdown.textContent = selectedUnit;
        });
    });

    const signupSuggestion = document.getElementById('signupSuggestion');
    const closeSignupSuggestion = document.getElementById('closeSignupSuggestion');
    closeSignupSuggestion.addEventListener('click', () => {
        signupSuggestion.hidden = true
    });
});



