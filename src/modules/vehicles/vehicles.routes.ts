import { Router } from 'express';
import { VehiclesController } from './vehicles.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();
const vehiclesController = new VehiclesController();

router.post('/', authenticate, authorize('admin'), vehiclesController.createVehicle);
router.get('/', vehiclesController.getAllVehicles);
router.get('/:vehicleId', vehiclesController.getVehicleById);
router.put('/:vehicleId', authenticate, authorize('admin'), vehiclesController.updateVehicle);
router.delete('/:vehicleId', authenticate, authorize('admin'), vehiclesController.deleteVehicle);

export default router;
