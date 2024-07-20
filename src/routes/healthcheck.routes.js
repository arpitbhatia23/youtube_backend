import { Router } from "express";
import { healthchecker } from "../controllers/healthchecker.controler.js";

const router=Router()
router.route("/healthcheck").get(healthchecker)
export default router