import userRoutes from './userRoutes.js';
import imageRoutes from './imageRoutes.js';
import errorHandler from "../middleware/errorHandler.js";

export default function router(app) {

    app.use("/api/user", userRoutes);
    app.use("/api/image", imageRoutes);
    app.use(errorHandler);
}