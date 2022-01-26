// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// import * as locations from "data/locations.csv";

import locations from "./data/locations";

type ILocation = {
  name: string;
  location: string;
  description: string;
  organizer: string;
  startTime: string;
  endTime: string;
  latitude: number;
  longitude: number;
  link: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ILocation[]>
) {
  res.status(200).json(locations);
}
