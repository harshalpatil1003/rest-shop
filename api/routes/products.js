const express = require('express');
const router = express.Router();



const ProductsControllers = require('../controllers/products');

const multer = require('multer');

const checkAuth = require('../middleware/check-auth');



const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    
    }
});


const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};



const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    filefilter: filefilter
});




router.get('/', ProductsControllers.products_get_all);



router.post('/', checkAuth, upload.single('productImage'), ProductsControllers.products_post);


router.get("/:productId", checkAuth, ProductsControllers.products_get_product);



router.patch('/:productId', checkAuth, ProductsControllers.products_patch_product);


router.delete('/:productId', checkAuth, ProductsControllers.product_delete_product);




module.exports = router;