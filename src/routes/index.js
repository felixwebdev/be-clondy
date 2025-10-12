import userRoutes from './userRoutes.js';
import errorHandler from "../middleware/errorHandler.js";

export default function router(app) {

    app.use("/api/user", userRoutes);

    app.use(errorHandler);
}