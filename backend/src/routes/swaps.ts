import { Router } from "express";
const router: Router = Router();

router.get("/test", (req, res) => {
    res.send("Done");
})

export default router;