import { Router } from "express";
import { createMedicine, readMedicine, updateMedicine } from "../controller/medicineController";
const router = Router ()

// route for add new medicine
router.post(`/`,[createMedicine],createMedicine)
// 
router.get(`/`, readMedicine)
/** route for update medicine */
router.put(`/`, [createMedicine], updateMedicine)

export default router