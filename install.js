const readline = require('readline');
const exec = require('child_process').exec;

function installDB() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Veuillez indiquer l'adresse à laquelle vous souhaitez installer votre environnement : ./", (bdURL) => {
        if (!bdURL.endsWith('.db')) { bdURL += '.db'; }
        exec(`echo DATABASE_URL="file:./${bdURL}" > .env`)
        exec(`npx prisma migrate dev`)
        rl.close();
    });
}

installDB();