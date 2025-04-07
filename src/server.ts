import { Server } from "http";
import app from "./app";

const port = 5000;

// Connection Related Function
async function main() {
  // Listen Server
  const server: Server = app.listen(port, () => {
    console.log(`Server Is Running O PORT ${port}👨‍💻`);
  });
}

main();
