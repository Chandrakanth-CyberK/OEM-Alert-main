const express = require('express');
const { body, param, query } = require('express-validator');
const vulnerabilityController = require('../controllers/vulnerabilityController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Validation middleware
const validateVulnerability = [
  body('cveId')
    .matches(/^CVE-\d{4}-\d{4,}$/)
    .withMessage('Invalid CVE ID format'),
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('severity')
    .isIn(['critical', 'high', 'medium', 'low'])
    .withMessage('Invalid severity level'),
  body('cvssScore')
    .isFloat({ min: 0, max: 10 })
    .withMessage('CVSS score must be between 0 and 10'),
  body('oem')
    .trim()
    .isLength({ min: 1 })
    .withMessage('OEM is required'),
  body('department')
    .isIn(['icu', 'emergency', 'surgery', 'radiology', 'laboratory', 'it', 'pharmacy', 'cardiology'])
    .withMessage('Invalid department'),
  body('patientSafetyImpact')
    .isIn(['life-critical', 'high', 'medium', 'low', 'none'])
    .withMessage('Invalid patient safety impact level'),
  body('hipaaRisk')
    .isIn(['high', 'medium', 'low'])
    .withMessage('Invalid HIPAA risk level'),
  body('publishedDate')
    .isISO8601()
    .withMessage('Invalid published date format')
];

const validateId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid vulnerability ID')
];

const validateQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('severity')
    .optional()
    .isIn(['critical', 'high', 'medium', 'low'])
    .withMessage('Invalid severity filter'),
  query('department')
    .optional()
    .isIn(['icu', 'emergency', 'surgery', 'radiology', 'laboratory', 'it', 'pharmacy', 'cardiology'])
    .withMessage('Invalid department filter'),
  query('status')
    .optional()
    .isIn(['new', 'acknowledged', 'in_progress', 'resolved', 'false_positive'])
    .withMessage('Invalid status filter')
];

// Routes
router.get('/', 
  auth, 
  authorize(['view_vulnerabilities']), 
  validateQuery,
  vulnerabilityController.getAllVulnerabilities
);

router.get('/trends', 
  auth, 
  authorize(['view_vulnerabilities']),
  vulnerabilityController.getVulnerabilityTrends
);

router.get('/:id', 
  auth, 
  authorize(['view_vulnerabilities']), 
  validateId,
  vulnerabilityController.getVulnerabilityById
);

router.post('/', 
  auth, 
  authorize(['manage_vulnerabilities']), 
  validateVulnerability,
  vulnerabilityController.createVulnerability
);

router.put('/:id', 
  auth, 
  authorize(['manage_vulnerabilities']), 
  validateId,
  vulnerabilityController.updateVulnerability
);

router.delete('/:id', 
  auth, 
  authorize(['manage_vulnerabilities']), 
  validateId,
  vulnerabilityController.deleteVulnerability
);

router.patch('/bulk-update', 
  auth, 
  authorize(['manage_vulnerabilities']),
  body('ids').isArray().withMessage('IDs must be an array'),
  body('ids.*').isMongoId().withMessage('Invalid vulnerability ID in array'),
  vulnerabilityController.bulkUpdateVulnerabilities
);

module.exports = router;