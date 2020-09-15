const { NotFoundInCatch, error500, error404, error422 } = require('../lib/error');
const { getAllResponse, createResponse, updateResponse } = require('../lib/response');

const Category = require("../models/Category");

const findAll = (req, res, next) => {
  Category.find()
    .then(category => {
        getAllResponse(res, category);
    })
    .catch(err => {
        error500(res, err.message || "Some error occurred while retrieving categories.");
    });
};

const create = (req, res, next) => {
  const userId =  req.user.name;;
  const category = new Category(
    {name : req.body.name,
    createdBy: req.user.name
  });
  category
    .save()
    .then(category => {
        createResponse(res, category);
    })
    .catch(err => {
      error422(res, err);
      error500(res, err.message || "Some error occurred while creating the Category.");
    });
};

const update = (req, res, next) => {
  console.log("Inside update...");
  console.log(req.params.id);
  Category.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
    .then(category => {
      console.log(category);
      if (!category) error404(res, "Category not found with id " + req.params.id);
      updateResponse(res, category, 'Category updated successfully');
    })
    .catch(err => {
      NotFoundInCatch(res, err, `Category not found with id ${err.value}`);
      error500(res, `Error updating category with id ${err.value}`);
    });
};

const deleteCategory = (req, res, next) => {
  Category.findByIdAndRemove(req.params.id)
    .then(category => {
      if (!category)
        error404(res, "Category not found with id " + req.params.id);
      res.send({ message: "Category deleted successfully!" });
    })
    .catch(err => {
      NotFoundInCatch(res, err, `Category not found with id ${err.value}`);
      error500(res, `Could not delete category with id ${err.value}`);
    });
};

module.exports = {
  findAll,
  create,
  update,
  delete: deleteCategory
};
