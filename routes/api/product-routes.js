const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// Get all products with associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Tag, through: ProductTag, as: 'tags' },
        { model: Category, as: 'category' },
      ],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a single product by its `id` with associated Category and Tag data
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Tag, through: ProductTag, as: 'tags' },
        { model: Category, as: 'category' },
      ],
    });

    if (!product) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const { product_name, price, stock, tagIds } = req.body;
    const product = await Product.create({ product_name, price, stock });

    if (tagIds && tagIds.length) {
      const productTagIdArr = tagIds.map((tag_id) => ({
        product_id: product.id,
        tag_id,
      }));
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update product data by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const { product_name, price, stock, tagIds } = req.body;
    await Product.update(
      { product_name, price, stock },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (tagIds && tagIds.length) {
      const existingProductTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });

      const existingTagIds = existingProductTags.map(({ tag_id }) => tag_id);

      const tagsToAdd = tagIds.filter((tag_id) => !existingTagIds.includes(tag_id));
      const tagsToRemove = existingTagIds.filter((tag_id) => !tagIds.includes(tag_id));

      await ProductTag.destroy({ where: { tag_id: tagsToRemove } });

      if (tagsToAdd.length) {
        const productTagIdArr = tagsToAdd.map((tag_id) => ({
          product_id: req.params.id,
          tag_id,
        }));
        await ProductTag.bulkCreate(productTagIdArr);
      }
    }

    res.status(200).json({ message: `Product with id ${req.params.id} updated successfully!` });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete a product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const deletedRowCount = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (deletedRowCount === 0) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }

    res.status(200).json({ message: `Product with id ${req.params.id} deleted successfully!` });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
