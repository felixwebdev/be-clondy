import userRoutes from './userRoutes.js';
import imageRoutes from './imageRoutes.js';
import messageRoutes from './messageRoutes.js';
import relationshipRoutes from './relationshipRoutes.js';
import verificationRoutes from './verificationRoutes.js';
import adminRoutes from './adminRoutes.js';
import errorHandler from "../middleware/errorHandler.js";
import systemRoutes from './systemRoutes.js';

export default function router(app) {

    app.use("/api/user", userRoutes);
    app.use("/api/image", imageRoutes);
    app.use("/api/verify", verificationRoutes);
    app.use("/api/relationship", relationshipRoutes);
    app.use("/api/message", messageRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/system", systemRoutes);

    app.use(errorHandler);
}