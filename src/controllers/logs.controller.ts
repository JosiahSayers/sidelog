import express, { Request, Response, NextFunction } from 'express';
import { LogsHelperService } from './logs-helper.service';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await LogsHelperService.createLog(req);
    return res.status(201).send();
  } catch (e) {
    const error = JSON.parse(e.message);
    return res.status(error.responseCode).send(error);
  }
});

export default router;