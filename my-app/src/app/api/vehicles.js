import type { NextApiRequest, NextApiResponse } from 'next';

interface Vehicle {
  id: string;
  imageUrl: string;
  brand: string;
  model: string;
  pricePerDay: number;
  averageRating?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Vehicle[] | { error: string }>) {
  try {
    const response = await fetch('http://localhost:3001/api/vehicles/top-rated');
    const data: Vehicle[] = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}