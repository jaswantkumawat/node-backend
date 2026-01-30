import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import apiRoutes from "./routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

// ------------------------------------------------------------------------------------------------------------------------------
//                                                    CREATE AN EXPRESS APPLICATION INSTANCE
// ------------------------------------------------------------------------------------------------------------------------------
const app = express();

// ------------------------------------------------------------------------------------------------------------------------------
//                            MIDDLEWARE: SET SECURITY-RELATED HTTP HEADERS TO PROTECT AGAINST COMMON ATTACKS
// ------------------------------------------------------------------------------------------------------------------------------
app.use(helmet());

// ------------------------------------------------------------------------------------------------------------------------------
//                            MIDDLEWARE: ENABLE CROSS-ORIGIN RESOURCE SHARING (CORS)
//                            ALLOWS FRONTEND APPLICATIONS FROM DIFFERENT ORIGINS TO ACCESS THIS API
// ------------------------------------------------------------------------------------------------------------------------------
app.use(cors());

// ------------------------------------------------------------------------------------------------------------------------------
//                            MIDDLEWARE: PARSES INCOMING JSON REQUEST BODIES AND MAKES THEM AVAILABLE IN REQ.BODY
// ------------------------------------------------------------------------------------------------------------------------------
app.use(express.json());

// ------------------------------------------------------------------------------------------------------------------------------
//                            MIDDLEWARE: LOGS HTTP REQUEST DETAILS (METHOD, URL, STATUS, RESPONSE TIME)
//                            USEFUL FOR DEBUGGING AND MONITORING DURING DEVELOPMENT
// ------------------------------------------------------------------------------------------------------------------------------
app.use(morgan("dev"));

// ------------------------------------------------------------------------------------------------------------------------------
//                                                        HEALTH CHECK ROUTE
//                            USED TO VERIFY SERVER STATUS AND UPTIME (COMMONLY USED BY LOAD BALANCERS / MONITORS)
// ------------------------------------------------------------------------------------------------------------------------------
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
  });
});

// ------------------------------------------------------------------------------------------------------------------------------
//                                                        ROUTES REGISTRATION
//                            ALL APPLICATION ROUTES SHOULD BE REGISTERED ABOVE THE 404 HANDLER
// ------------------------------------------------------------------------------------------------------------------------------
app.use("/api", apiRoutes);

// -------------------- METHOD NOT ALLOWED --------------------
app.use("/api", (req, res, next) => {
  // If we reached here, route path exists under /api
  // but HTTP method didn't match any handler
  res.status(405).json({
    message: "Method not allowed",
  });
});
// ------------------------------------------------------------------------------------------------------------------------------
//                                                        404 NOT FOUND HANDLER
//                            HANDLES ALL UNMATCHED ROUTES AND RETURNS A CONSISTENT JSON RESPONSE
// ------------------------------------------------------------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ------------------------------------------------------------------------------------------------------------------------------
//                                                        GLOBAL ERROR HANDLING MIDDLEWARE
//                            CATCHES ALL ERRORS PASSED VIA next(error) AND PREVENTS APP CRASH
// ------------------------------------------------------------------------------------------------------------------------------
app.use(errorHandler);

// ------------------------------------------------------------------------------------------------------------------------------
//                                                        EXPORT EXPRESS APP INSTANCE
//                            SEPARATES APPLICATION CONFIGURATION FROM SERVER STARTUP LOGIC
// ------------------------------------------------------------------------------------------------------------------------------
export default app;
