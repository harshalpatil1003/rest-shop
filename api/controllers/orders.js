const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');



exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc.id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}


exports.orders_post_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();

        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Order Stored",
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/" + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                message: "Product Not Found"
            });
        });
};


exports.orders_get_order = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .populate('product')
        .exec()
        .then(doc => {
            console.log("from database", doc);

            if (doc) {
                res.status(200).json({
                    doc: doc,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/orders"
                    }

                });
            }
            else {

                res.status(401).json({
                    "message": "no data"
                });
            }


        })
        .catch(err => {
            res.status(500).json({
                error: err
            });

        });

};

exports.orders_delete_order = (req, res, next) => {

    const id = req.params.orderId;

    Order.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order Deleted',
                id: id,
                request: {
                    type: 'POST',
                    url: "http://localhost:3000/orders",
                    body: { productId: "ID", quantity: "nos" }
                }

            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });


}