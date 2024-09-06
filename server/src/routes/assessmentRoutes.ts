import express from 'express'
import { createAssessment } from '../controllers/AssessmentControllers'
import { authenticatToken } from '../middlewares/authToken'

const router = express.Router()

router.post('/create', authenticatToken, createAssessment)

export = router