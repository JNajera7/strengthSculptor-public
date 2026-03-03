function checkPasswordStrength(password) {
    var strength = document.getElementById("password-strength"); // checks the strength of the password
    var hasLetter = /[a-zA-Z]/.test(password);
    var hasNumber = /\d/.test(password); // checks if the user password contains at least one number
    var hasSpecialChar = /[-+_!@#$%^&*.,?]/.test(password); // checks if the users password that they created contains at least one special character
    var isEightCharsLong = password.length >= 8; // checks if the password the user created is 8 characters long

    var missingRequirements = [];

    if (!hasLetter) {
        missingRequirements.push("<span style='color: red;'>At least one letter</span>"); //notifies the user what they are missing in order for the password requirement to be met in this case the user is missing an uppercase letter
    }
    if (!hasNumber) {
        missingRequirements.push("<span style='color: red;'>At least one number</span>"); // notifies the user what they are missing in order for the password requirement to be met in this case the user is missing a number
    }
    if (!hasSpecialChar) {
        missingRequirements.push("<span style='color: red;'>At least one special character (-+_!@#$%^&*.,?)</span>"); // notifies the user what they are missing in order for the password requirement to be met in this case the user is missing a special character
    }
    if (!isEightCharsLong) {
        missingRequirements.push("<span style='color: red;'>At least 8 characters long</span>");// notifies the user what they are missing in order for the password requirement to be met in this case the users password is missing characters and has to add characters until it reaches the 8 character requirement
    }

    var registerBtn = document.getElementById("register-btn");
    if (missingRequirements.length > 0) {
        var requirementsText = missingRequirements.join(", "); // if the user has multiple missing requirements this joins the messages together
        strength.innerHTML = "<p><b>Password requirements:</b></p><p>" + requirementsText + "</p>"; //returns a message that notifies the user that their password requirement has not been met and returns what they are missing 
        registerBtn.disabled = true; // makes the register button unaccessible to the user if they are current missing any of the password requirements
    } else {
        strength.innerHTML = "<p><span style='color: green;'>Password requirements met!</span></p>"; //returns a message that notifies the user that their password requirement has been met
        registerBtn.disabled = false;// makes the register button accessible if the user passed all the password requirements
    }
}

document.getElementById('password').addEventListener('keyup', function (event) {
    checkPasswordStrength(event.target.value);
});
