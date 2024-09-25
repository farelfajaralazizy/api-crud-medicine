import { Router } from "express";
import { createMedicine, deleteMedicine, readMedicine, updateMedicine } from "../controller/medicineController";
import { uploadMedicinePhoto } from "../middleware/uploadMedicinePhoto"
import { updateValidation } from "../middleware/medicineValidation";
import { verifyToken } from "../middleware/authorization";
const router = Router ()

/** route for add new medicine */ 
router.post(`/`,[verifyToken, uploadMedicinePhoto.single(`photo`), createMedicine],createMedicine)
/** route for show all medicine */
router.get(`/`,[verifyToken], readMedicine)
/** route for update medicine */
router.put(`/:id`, [verifyToken, uploadMedicinePhoto.single(`photo`), updateValidation], updateMedicine)
/** route for delete medicine */
router.delete(`/:id`, deleteMedicine)


export default router