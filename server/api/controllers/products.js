const {
  NotFoundInCatch,
  error500,
  error404,
  error422
} = require("../lib/error");
const {
  getAllResponse,
  createResponse,
  updateResponse,
  getOneResponse,
  response
} = require("../lib/response");


const Products = require("../models/Products");
const excelToJson = require('convert-excel-to-json');
const Product = require("../models/Products");

global.__basedir = __dirname;

const create = (req, res, next) => {
  console.log("req.file");
  console.log(req.file); //form files
  console.log(req.files); 
  const products = new Products(
    {
    productName : req.body.productName,
    category: req.body.category,
    price: req.body.price,
    quantity: req.body.quantity,
    image1: req.files[0] && req.files[0].filename ? req.files[0].filename : '',
    //image2: req.files[1] && req.files[1].filename ? req.files[1].filename : '',
    createdBy: req.user.name
  });
  products
    .save()
    .then(product => {
      console.log(product);
      createResponse(res, product);
    })
    .catch(err => {
      error422(res, err);
      error500(
        res,
        err.message || "Some error occurred while creating the product."
      );
    });
};


// -> Import Excel File to MongoDB database
const importExcelData2MongoDB = async(filePath) => {
  // -> Read Excel File to Json Data
  const excelData = excelToJson({
      sourceFile: filePath,
      sheets:[{
          // Excel Sheet Name
          name: 'Products',

          // Header Row -> be skipped and will not be present at our result object.
          header:{
             rows: 1
          },
    
          // Mapping columns to keys
          columnToKey: {
              A: '_id',
              B: 'productName',
              C: 'category',
              D: 'price',
              E: 'quantity'
          }
      }]
  });
  return excelData;
}

  

const createExcelProduct = async (req, res, next) => {
  
  const excelData = await importExcelData2MongoDB(__basedir + '/uploads/' + req.file.filename);
  // -> Log Excel Data to Console
  console.log(excelData);
  res.json({
      'msg': 'File uploaded/import successfully!', 'file': req.file
  });

  // const products = new Products(
  //   {
  //   productName : excelData.productName,
  //   category: excelData.productName,
  //   price: excelData.productName,
  //   quantity: excelData.productName,
  //   createdBy: req.user.name
  // });

  Product.insertMany(excelData.Products)
    .then(docs => {
      console.log(docs);
      createResponse(res, docs);
    })
    .catch(err => {
      error422(res, err);
      error500(
        res,
        err.message || "Some error occurred while creating the product."
      );
    });
};


const findAll = (req, res, next) => {
  const filter = req.body.filter || '';
  Products.find()
  .where(filter)
  .populate('category')
    .then(products => {
      getAllResponse(res, products);
    })
    .catch(err => {
      error500(
        res,
        err.message || "Some error occurred while retrieving product."
      );
    });
};

const getProduct = (req, res, next) => {
  const filter = req.body.filter || '';
  const sort = {
    [req.body.sortKey || "_id"]: req.body.sortOrder || 1
  };
  console.log(sort);
  const pageOptions = {
    page: req.body.page || 0,
    limit: req.body.limit || 10
  }
  Products.find()
  .where(filter)
  .sort(sort)
  .skip(pageOptions.page * pageOptions.limit)
  .limit(pageOptions.limit)
  .populate('category')
  .then(products => {
    Products.collection.countDocuments(filter).then(totalCount => {
      const data = {
        products,
        totalCount,
        ...pageOptions
      };
      getAllResponse(res, data);
    });
  })
  .catch(err => {
    error500(
      res,
      err.message || "Some error occurred while retrieving product."
    );
  });
};

const findOne = (req, res, next) => {
  Products.findById(req.params.id)
  .populate('Category')
    .then(product => {
      if (!product) error404(res, "Product not found with id " + req.params.id);
      getOneResponse(res, product);
    })
    .catch(err => {
      NotFoundInCatch(res, err, `Product not found with id ${err.value}`);
      error500(res, `Error retrieving product with id ${err.value}`);
    });
};

const update = (req, res, next) => {
  Products.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
    .then(product => {
      if (!product) error404(res, "Product not found with id " + req.params.id);
      updateResponse(res, product, 'Product updated successfully');
    })
    .catch(err => {
      NotFoundInCatch(res, err, `Product not found with id ${err.value}`);
      error500(res, `Error updating product with id ${err.value}`);
    });
};

const deleteProduct = (req, res, next) => {
  Products.findByIdAndRemove(req.params.id)
    .then(product => {
      if (!product) error404(res, "Product not found with id " + req.params.id);
      response(res, "Product deleted successfully!");
    })
    .catch(err => {
      NotFoundInCatch(res, err, `Product not found with id ${err.value}`);
      error500(res, `Could not delete product with id ${err.value}`);
    });
};

module.exports = {
  create,
  createExcelProduct,
  findAll,
  findOne,
  update,
  getProduct,
  delete: deleteProduct
};
