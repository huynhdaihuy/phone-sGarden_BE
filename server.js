const app = require("./app");
const config = require("./app/config");
const MongoDB = require('./app/utils/mongodb.util');

const db = require("./app/models");
const Role = db.role;
// Test
db.mongoose
    .connect(`mongodb://127.0.0.1:27017/phone_Garden`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to Mongoose.");
        const PORT = config.app.port;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

async function initial() {
    await MongoDB.connect('mongodb://localhost:27017/phone_Garden');
    console.log("Connected to the database!");
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'user' to roles collection");
            });

            new Role({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'moderator' to roles collection");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            });
        }
    });
}
// Test
// async function startServer() {
//     try {
//         await MongoDB.connect('mongodb://localhost:27017/phone_Garden');
//         console.log("Connected to the database!");
//         const PORT = config.app.port;
//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         })
//     } catch (error) {
//         console.log("Cannot connect to the database!", error);
//         process.exit();
//     }
// }
// startServer();