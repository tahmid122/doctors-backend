import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";
async function main() {
    try {
        await prisma.$connect();
        console.log(`Connected to database successfully.`);
        app.listen(config.PORT, () => {
            console.log(`Server running at http://localhost:${config.PORT}/api/v1`);
        });
    }
    catch (error) {
        // console.error(error);
        // process.exit(1);
    }
}
main();
