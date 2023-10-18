const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Define associations between models

// Products belong to a Category
Product.belongsTo(Category, {
  foreignKey: 'category_id',
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id',
});

// Products belong to many Tags through the ProductTag model (many-to-many relationship)
Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'product_id',
  otherKey: 'tag_id',
  //as: 'joined_product_tag',
});

// Tags belong to many Products through the ProductTag model (many-to-many relationship)
Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id',
  otherKey: 'product_id',
  //as: 'joined_tag_product',
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
