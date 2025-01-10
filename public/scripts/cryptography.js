 // Caesar Cipher Encryption
 function caesarCipher(str, shift, action) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const shiftAmount = action === 'encrypt' ? shift : 26 - shift; // Reverse shift for decryption

    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        if (alphabet.indexOf(char.toUpperCase()) !== -1) {
            const isLowerCase = char === char.toLowerCase();
            const charIndex = alphabet.indexOf(char.toUpperCase());
            let newIndex = (charIndex + shiftAmount) % 26;

            // Handle wrapping around alphabet
            let newChar = alphabet[newIndex];
            if (isLowerCase) newChar = newChar.toLowerCase();

            result += newChar;
        } else {
            result += char; // Non-alphabet characters are unchanged
        }
    }

    return result;
}

// Handle Encrypt button
document.getElementById('encryptBtn').addEventListener('click', function () {
    const message = document.getElementById('message').value;
    const shift = parseInt(document.getElementById('shift').value);
    if (message && !isNaN(shift)) {
        const encryptedMessage = caesarCipher(message, shift, 'encrypt');
        document.getElementById('result').value = encryptedMessage;
    } else {
        alert('Please enter a valid message and shift value');
    }
});

// Handle Decrypt button
document.getElementById('decryptBtn').addEventListener('click', function () {
    const message = document.getElementById('message').value;
    const shift = parseInt(document.getElementById('shift').value);
    if (message && !isNaN(shift)) {
        const decryptedMessage = caesarCipher(message, shift, 'decrypt');
        document.getElementById('result').value = decryptedMessage;
    } else {
        alert('Please enter a valid message and shift value');
    }
});