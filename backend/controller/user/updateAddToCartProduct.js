const addToCartModel = require("../../models/cartProduct");

const updateAddToCartProduct = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const addToCartProductId = req?.body?._id;
    // from frontend
    const qty = req.body.quantity;
    // update quantity
    const updateProduct = await addToCartModel.updateOne(
      { _id: addToCartProductId },
      {
        ...(qty && { quantity: qty }),
      }
    );

    res.json({
      message: "Product Updated",
      data: updateProduct,
      error: false,
      success: true,
    });
  } catch (err) {
    res.json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = updateAddToCartProduct;
