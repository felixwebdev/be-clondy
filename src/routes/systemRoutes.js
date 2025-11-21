import express from 'express';

const router = express.Router();

router.route("/health").get((req, res) => {
    res.status(200).json({ status: "OK", message: "System is healthy" });
});

export default router;