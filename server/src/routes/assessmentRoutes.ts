import express from 'express'
import { createAssessment, evaluateAssessment } from '../controllers/AssessmentControllers'
import { authenticateToken } from '../middlewares/authToken'

const router = express.Router()

router.post('/create', authenticateToken, createAssessment)
router.post('/analyze/:id', authenticateToken, evaluateAssessment)

export = router