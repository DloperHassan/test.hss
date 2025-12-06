import { Request, Response } from 'express';
import { VehiclesService } from './vehicles.service';
import { sendSuccess, sendError } from '../../utils/response';

export class VehiclesController {
  private vehiclesService: VehiclesService;

  constructor() {
    this.vehiclesService = new VehiclesService();
  }

  createVehicle = async (req: Request, res: Response) => {
    try {
      const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

      if (!vehicle_name || !type || !registration_number || !daily_rent_price) {
        return sendError(res, 400, 'Vehicle name, type, registration number, and daily rent price are required');
      }

      if (daily_rent_price <= 0) {
        return sendError(res, 400, 'Daily rent price must be positive');
      }

      const validTypes = ['car', 'bike', 'van', 'SUV'];
      if (!validTypes.includes(type)) {
        return sendError(res, 400, 'Invalid vehicle type. Must be car, bike, van, or SUV');
      }

      const vehicle = await this.vehiclesService.createVehicle({
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status
      });

      return sendSuccess(res, 201, 'Vehicle created successfully', vehicle);
    } catch (error: any) {
      return sendError(res, 400, error.message);
    }
  };

  getAllVehicles = async (_req: Request, res: Response) => {
    try {
      const vehicles = await this.vehiclesService.getAllVehicles();

      if (vehicles.length === 0) {
        return sendSuccess(res, 200, 'No vehicles found', []);
      }

      return sendSuccess(res, 200, 'Vehicles retrieved successfully', vehicles);
    } catch (error: any) {
      return sendError(res, 500, error.message);
    }
  };

  getVehicleById = async (req: Request, res: Response) => {
    try {
      const { vehicleId } = req.params;

      const vehicle = await this.vehiclesService.getVehicleById(vehicleId);

      return sendSuccess(res, 200, 'Vehicle retrieved successfully', vehicle);
    } catch (error: any) {
      return sendError(res, 404, error.message);
    }
  };

  updateVehicle = async (req: Request, res: Response) => {
    try {
      const { vehicleId } = req.params;
      const updateData = req.body;

      if (updateData.type) {
        const validTypes = ['car', 'bike', 'van', 'SUV'];
        if (!validTypes.includes(updateData.type)) {
          return sendError(res, 400, 'Invalid vehicle type. Must be car, bike, van, or SUV');
        }
      }

      if (updateData.daily_rent_price && updateData.daily_rent_price <= 0) {
        return sendError(res, 400, 'Daily rent price must be positive');
      }

      const vehicle = await this.vehiclesService.updateVehicle(vehicleId, updateData);

      return sendSuccess(res, 200, 'Vehicle updated successfully', vehicle);
    } catch (error: any) {
      return sendError(res, 400, error.message);
    }
  };

  deleteVehicle = async (req: Request, res: Response) => {
    try {
      const { vehicleId } = req.params;

      await this.vehiclesService.deleteVehicle(vehicleId);

      return sendSuccess(res, 200, 'Vehicle deleted successfully');
    } catch (error: any) {
      return sendError(res, 400, error.message);
    }
  };
}
