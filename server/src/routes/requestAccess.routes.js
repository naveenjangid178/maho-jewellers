import express from 'express';
import { createRequestAccess, getAllRequestAccesses } from '../controllers/requestAccess.controller.js';

const router = express.Router();

// POST /api/request-access
router.post('/', createRequestAccess);
router.get('/', getAllRequestAccesses);

export default router;
