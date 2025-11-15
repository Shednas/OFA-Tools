// Password Generator
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numberChars = '0123456789';
const symbolChars = '@!~#$%^&*()_+<>?/.,;:[]{}=|";';

function generatePassword() {
    
    const generatedPassword = document.getElementById("generatedPassword");
    generatedPassword.textContent="";

    const length = Number(document.getElementById("length").value);

    if(length < 8)
        {
            generatedPassword.textContent = "Please Enter a number greater than 7."
            return;
        };

    const includeLowercase = document.getElementById("includeLowercase").checked;
    const includeUppercase = document.getElementById("includeUppercase").checked;
    const includeNumbers = document.getElementById("includeNumbers").checked;
    const includeSymbols = document.getElementById("includeSymbols").checked;

    let password = "";
    let allowedChars = "";

    allowedChars += includeLowercase? lowercaseChars : "";
    allowedChars += includeUppercase? uppercaseChars : "";
    allowedChars += includeNumbers? numberChars : "";
    allowedChars += includeSymbols? symbolChars : "";

    if(allowedChars == ""){
        generatedPassword.textContent = "Please select at least one type of character."
        return;
    }
    
    for (let i=0; i<length; i++){
        const randomIndex = Math.floor(Math.random()*allowedChars.length);
        password +=allowedChars[randomIndex];
    }

    generatedPassword.textContent = password;
}

// Dice Roller
