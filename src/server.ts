import { Server } from "http";
import app from "./app";
import config from "./app/config";

const port = config.PORT || 5050;

// Connection Related Function
async function main() {
  // Listen Server
  const server: Server = app.listen(port, () => {
    console.log(`Server Is Running O PORT ${port}👨‍💻`);
  });
}

main();
