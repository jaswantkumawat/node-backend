import http from "http";
import app from "./src/app.js";
import { connectDB } from "./db.js";

const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await connectDB(); 

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start", err);
    process.exit(1);
  }
})();
