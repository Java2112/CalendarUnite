import { Request, Response } from 'express';
import { GetPlacesUseCase } from '../../application/use-cases/places/GetPlacesUseCase';

export class PlaceController {
  constructor(private getPlacesUseCase: GetPlacesUseCase) {}

  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const places = await this.getPlacesUseCase.execute();
      return res.json(places);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Error al obtener lugares' });
    }
  };
}
