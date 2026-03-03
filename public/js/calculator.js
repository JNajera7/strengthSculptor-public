const dropdownToggle = document.getElementById('dropdownToggle');
const dropdownPanel = document.querySelector('.dropdown-panel');
const searchInput = document.getElementById('searchInput');
const muscleFilter = document.getElementById('muscleGroupFilter');
const equipmentFilter = document.getElementById('equipmentFilter');
const individualMuscleFilter = document.getElementById('individualMuscleFilter');
const exerciseList = document.getElementById('exerciseList');
const weightInput = document.getElementById('liftWeight');
const dumbbellNotification = document.getElementById('dumbbellNoti');
const weightDropdown = document.getElementById('unitDropdown2');
const repsInput = document.getElementById('liftReps');

let selectedExercise = '';

dropdownToggle.addEventListener('click', () => {
    dropdownPanel.style.display = dropdownPanel.style.display === 'none' ? 'block' : 'none';
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-container')) {
        dropdownPanel.style.display = 'none';
    }
});

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
popoverTriggerList.forEach(el => {
    new bootstrap.Popover(el, {
        trigger: 'focus click'
    });
});

const StrengthForm = document.getElementById('strengthForm');

StrengthForm.addEventListener('submit', function (event) {
    console.log('Calculate strength button hit! executing...');
    event.preventDefault();
    event.stopPropagation();

    // Validate form input
    if (!StrengthForm.checkValidity()) {
        StrengthForm.classList.add('was-validated');
        return;
    }

    // Get user input values
    const userBodyweight = parseFloat(document.getElementById('bodyweight').value);
    const userSetWeight = parseFloat(document.getElementById('liftWeight').value);
    const userSetReps = parseFloat(document.getElementById('liftReps').value);
    const userGender = document.getElementById('gender').value;
    const addDataBoolean = document.getElementById('addToData').checked;
    const repOnlyExercise = Number.isNaN(userSetWeight);

    console.log('Retrieving strength standards for', selectedExercise, 'at bodyweight ', userBodyweight);
    console.log(userSetWeight);
    if (repOnlyExercise) {
        console.log('Rep only exercise detected!');
    }

    var userOneRepMax = userSetReps;

    if (!repOnlyExercise) {
        //Calculate 1RM:
        if (userSetReps != 1) {
            userOneRepMax = userSetWeight * (1 + 0.0333 * userSetReps);
        } else {
            userOneRepMax = userSetWeight;
        }
    }

    getStrengthStandards(userOneRepMax, userBodyweight, selectedExercise, userGender);

    handleUserInteraction();

    async function handleUserInteraction() {
        console.log('Retrieving strength data...');
        const userPercentile = await getStrengthData(userBodyweight, userOneRepMax, selectedExercise, userGender, repOnlyExercise);

        if (addDataBoolean === true) {
            console.log('Save data box checked: ' + addDataBoolean);
            console.log('Storing user set...');
            storeUserSet(selectedExercise, userSetReps, userSetWeight, userOneRepMax, userPercentile);
        } else { console.log('Save data box checked: ' + addDataBoolean); }
    }
});


