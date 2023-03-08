import express, { Request, Response } from 'express';
import { LogsHelperService } from './logs-helper.service';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    await LogsHelperService.createLog(req);
    return res.status(201).send();
  } catch (e: any) {
    const error = JSON.parse(e.message);
    return res.status(error.responseCode).send(error);
  }
});

export default router;
