import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import healthHandler from './api/health.js';
import trafficIncidentsHandler from './api/traffic-incidents.js';
import travelTimesHandler from './api/travel-times.js';
import floodAlertsHandler from './api/flood-alerts.js';
import roadWorksHandler from './api/road-works.js';
import trafficSpeedsHandler from './api/traffic-speeds.js';
import onemapRouteHandler from './api/onemap-route.js';
import weather2hrHandler from './api/weather-2hr.js';
import trafficOverviewHandler from './api/traffic-overview.js';
import trafficImagesHandler from './api/traffic-images.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Mount API endpoints
  app.get('/api/health', (req: Request, res: Response) => healthHandler(req, res));
  app.get('/api/traffic-overview', (req: Request, res: Response) => trafficOverviewHandler(req, res));
  app.get('/api/traffic-incidents', (req: Request, res: Response) => trafficIncidentsHandler(req, res));
  app.get('/api/travel-times', (req: Request, res: Response) => travelTimesHandler(req, res));
  app.get('/api/flood-alerts', (req: Request, res: Response) => floodAlertsHandler(req, res));
  app.get('/api/road-works', (req: Request, res: Response) => roadWorksHandler(req, res));
  app.get('/api/traffic-speeds', (req: Request, res: Response) => trafficSpeedsHandler(req, res));
  app.get('/api/onemap-route', (req: Request, res: Response) => onemapRouteHandler(req, res));
  app.get('/api/weather-2hr', (req: Request, res: Response) => weather2hrHandler(req, res));
  app.get('/api/traffic-images', (req: Request, res: Response) => trafficImagesHandler(req, res));

  if (!isProd) {
    // Development mode with Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
