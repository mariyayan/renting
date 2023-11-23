
const express=require('express');
const router=express.Router();

const {
	searchHousingByRequest,
	searchApartments,
	searchCottages,
	getMainPage
}=require('../controllers/housings-controller');

router.get('/',getMainPage); 

router.get('/searchHousing', searchHousingByRequest);  

router.get('/apartments', searchApartments); 

router.get('/cottages', searchCottages); 

module.exports=router;