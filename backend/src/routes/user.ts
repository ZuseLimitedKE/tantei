import { Router } from "express";
import { followAgentSchema, registerUserSchema } from "../schema/user";
import { Errors, MyError } from "../constants/errors";
import userController from "../controllers/user";
import agentModel from "../model/agents";
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
        if (err instanceof MyError) {
            if (err.message === Errors.INVALID_HEDERA_ACCOUNT) {
                res.status(400).json({error: [err.message]});
            }
        }
        console.error("Error registering user", err);
        res.status(500).json({error: Errors.INTERNAL_SERVER_ERROR});
    }
})

router.post("/follow", async(req, res) => {
    try {
        const parsed = followAgentSchema.safeParse(req.body);
        if (parsed.success) {
            const data = parsed.data;
            await userController.followAgent(data, agentModel);
            res.status(201).json({message: "User followed agent successfully"});
        } else {
            const errors = parsed.error.issues.map((i) => i.message);
            res.status(400).json({error: errors});
        }
    } catch(err) { 
        if (err instanceof MyError) {
            if (err.message === Errors.AGENT_NOT_EXIST) {
                res.status(400).json({error: [err.message]});
            } else if (err.message === Errors.INVALID_HEDERA_ACCOUNT) {
                res.status(400).json({error: `User data error => ${err.message}`})
            }
        }

        console.error("Error following agent", err);
        res.status(500).json({error: Errors.NOT_FOLLOW_AGENT});
    }
})

export default router;