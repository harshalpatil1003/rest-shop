const mongoose = require('mongoose');
const Product = require('../models/product');





exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {

                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });

        });


}


exports.products_post = (req, res, next) => {
    console.log(req.file);

    const product = new Product({

        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path

    });

    product.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                'message': 'Created Product Successfully',
                createdProdct: result
            });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });


        });



}


exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)

        .exec()
        .then(doc => {
            console.log("from database", doc);

            if (doc) {
                res.status(200).json(doc);
            }
            else {
                res.status(404).json({ message: 'no valid id' });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: error });

        });

}

exports.products_patch_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                error: err
            });
        });

}


exports.product_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.staus(200).json(result);
        })
        .catch(err => {
            console.log(400).json({
                error: err
            });

        });


    res.status(200).json({
        'message': ' Product Deleted',
        id: id
    });

}
