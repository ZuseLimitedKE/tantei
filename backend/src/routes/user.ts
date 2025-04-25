import { Router } from "express";
import { registerUserSchema } from "../schema/user";
import { Errors } from "../constants/errors";
import userController from "../controllers/user";
const router: Router = Router();

router.post("/register", async(req, res) => {
    try {
        const parsed = registerUserSchema.safeParse(req.body);
        if (parsed.success) {
            const data = parsed.data;
            await userController.register(data.address);
            res.status(201).json({message: "User registered successfully"});
        } else {
            const errors = parsed.error.issues.map((i) => i.message);
            res.status(400).json({error: errors});
        }
    } catch(err) {
        console.error("Error registering user", err);
        res.status(500).json({error: Errors.INTERNAL_SERVER_ERROR});
    }
})

router.post("/follow", async(req, res) => {
    try {

    } catch(err) {

    }
})

export default router;