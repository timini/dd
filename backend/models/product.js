module.exports = function(db) {
  var Product = db.define(
    'user',
    {
      name : String,
    },
    {
      methods: {
      },
      validations: {
      }
    }
  );
  return Product;
}
