import express from 'express'
import { createAssessment, evaluateAssessment } from '../controllers/AssessmentControllers'
import { authenticatToken } from '../middlewares/authToken'

const router = express.Router()

router.post('/create', authenticatToken, createAssessment)
router.post('/analyze/:id', authenticatToken, evaluateAssessment)

export = router