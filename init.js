const { createTable, db } = require('./database/database')
const bcrypt = require('bcrypt');
createTable();

// inserting default data to database 

// async function hashPassword(password) {
//     const saltRounds = 10; // Number of rounds for salting
//     try {
//         const hashedPassword = await bcrypt.hash(password, saltRounds);
//         console.log("Password hashed successfully");
//         return hashedPassword;
//     } catch (err) {
//         console.error("Error hashing password:", err);
//         throw err;
//     }
// }

// async function insertUser() {
//     try {
//         // Hash the password asynchronously before inserting into the database
//         const hashedPassword = await hashPassword("rudze");

//         // Insert the user into the database with the hashed password
//         db.run("INSERT INTO users (username, password, email, type) VALUES (?, ?, ?, ?)", 
//             ["twfbg", hashedPassword, "sadra.rafat1385@gmail.com", 0], 
//             (err) => {
//                 if (err) {
//                     console.error("Error inserting user:", err.message);
//                 } else {
//                     console.log("User inserted successfully!");
//                 }
//             }
//         );
//     } catch (err) {
//         console.error("Error in insertUser:", err);
//     }
// }

// // Call the insertUser function to add the user to the database
// insertUser();
