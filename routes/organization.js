var express = require('express');
var router = express.Router();
const organizationController = require('../controllers/organization')

router.post('/', organizationController.saveOrganization);
router.get('/', organizationController.fetchOrganizations)

module.exports = router;
