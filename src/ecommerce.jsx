import { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const EcommerceApp = () => {
  // INPUT FIELDS STATE
  const [formData, setFormData] = useState({
    category: "",
    subCategory: "",
    product: "",
    price: "",
    quantity: "",
  });
  const [items, setItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // RESET FORM
  const resetForm = () => {
    setFormData({
      category: "",
      subCategory: "",
      product: "",
      price: "",
      quantity: "",
    });
    setEditIndex(null);
  };

  // TOGGLE CATEGORY EXPANSION
  const toggleCategory = (categoryId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // HANDLE FORM SUBMISSION
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category || !formData.subCategory) return;

    const updatedItems = [...items];

    // Check if we are in edit mode
    if (editIndex) {
      const { categoryIndex, subCatIndex, prodIndex } = editIndex;
      // Update existing product
      updatedItems[categoryIndex].subCategories[subCatIndex].products[
        prodIndex
      ] = {
        name: formData.product,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      };
    } else {
      // Check if category exists
      const categoryIndex = updatedItems.findIndex(
        (item) => item.category === formData.category
      );

      if (categoryIndex !== -1) {
        // Check if subcategory exists
        const subCategoryIndex = updatedItems[
          categoryIndex
        ].subCategories.findIndex((sub) => sub.name === formData.subCategory);

        if (subCategoryIndex !== -1) {
          // Check if product exists
          const productIndex = updatedItems[categoryIndex].subCategories[
            subCategoryIndex
          ].products.findIndex((prod) => prod.name === formData.product);

          if (productIndex !== -1) {
            // Update existing product
            updatedItems[categoryIndex].subCategories[
              subCategoryIndex
            ].products[productIndex] = {
              name: formData.product,
              price: parseFloat(formData.price),
              quantity: parseInt(formData.quantity),
            };
          } else if (formData.product) {
            // Add new product
            updatedItems[categoryIndex].subCategories[
              subCategoryIndex
            ].products.push({
              name: formData.product,
              price: parseFloat(formData.price),
              quantity: parseInt(formData.quantity),
            });
          }
        } else {
          // Add new subcategory
          updatedItems[categoryIndex].subCategories.push({
            name: formData.subCategory,
            products: formData.product
              ? [
                  {
                    name: formData.product,
                    price: parseFloat(formData.price),
                    quantity: parseInt(formData.quantity),
                  },
                ]
              : [],
          });
        }
      } else {
        // Add new category
        updatedItems.push({
          category: formData.category,
          subCategories: [
            {
              name: formData.subCategory,
              products: formData.product
                ? [
                    {
                      name: formData.product,
                      price: parseFloat(formData.price),
                      quantity: parseInt(formData.quantity),
                    },
                  ]
                : [],
            },
          ],
        });
      }
    }

    setItems(updatedItems);
    resetForm();
  };

  // EDIT ITEM
  const handleEdit = (categoryIndex, subCatIndex, prodIndex) => {
    const category = items[categoryIndex];
    const subCategory = category.subCategories[subCatIndex];
    const product = subCategory.products[prodIndex];

    setFormData({
      category: category.category,
      subCategory: subCategory.name,
      product: product.name,
      price: product.price,
      quantity: product.quantity,
    });

    setEditIndex({ categoryIndex, subCatIndex, prodIndex });
  };

  // DELETE ITEMS
  const deleteItem = (
    type,
    categoryIndex,
    subCatIndex = null,
    prodIndex = null
  ) => {
    const updatedItems = [...items];

    if (type === "product") {
      updatedItems[categoryIndex].subCategories[subCatIndex].products.splice(
        prodIndex,
        1
      );
      // Remove subcategory if no products left
      if (
        updatedItems[categoryIndex].subCategories[subCatIndex].products
          .length === 0
      ) {
        updatedItems[categoryIndex].subCategories.splice(subCatIndex, 1);
      }
    } else if (type === "subCategory") {
      updatedItems[categoryIndex].subCategories.splice(subCatIndex, 1);
    } else {
      // category
      updatedItems.splice(categoryIndex, 1);
    }

    setItems(
      updatedItems.filter(
        (cat) => cat.subCategories.length > 0 || !type === "subCategory"
      )
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              E-Commerce Inventory Manager
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Organize your products with categories and subcategories
            </p>
          </div>

          {/* Form */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200 ease-in-out transform hover:scale-105"
                    placeholder="e.g. Electronics"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subCategory"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Subcategory
                  </label>
                  <input
                    type="text"
                    id="subCategory"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200 ease-in-out transform hover:scale-105"
                    placeholder="e.g. Smartphones"
                  />
                </div>
                {formData.category && formData.subCategory && (
                  <>
                    <div>
                      <label
                        htmlFor="product"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Product
                      </label>
                      <input
                        type="text"
                        id="product"
                        name="product"
                        value={formData.product}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200 ease-in-out transform hover:scale-105"
                        placeholder="e.g. iPhone 13"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Price ($)
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200 ease-in-out transform hover:scale-105"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="quantity"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Quantity
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200 ease-in-out transform hover:scale-105"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="mt-6 flex items-center justify-end gap-x-3">
                {editIndex !== null && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-105"
                  >
                    <FiX className="mr-2" />
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-105"
                >
                  {editIndex !== null ? (
                    <>
                      <FiEdit2 className="mr-2" />
                      Update Product
                    </>
                  ) : (
                    <>
                      <FiPlus className="mr-2" />
                      {formData.product ? "Add Product" : "Add Category"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Inventory List */}
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                <h3 className="text-lg font-medium text-gray-900">
                  No inventory items added yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start by adding a category above
                </p>
              </div>
            ) : (
              items.map((category, categoryIndex) => (
                <div
                  key={`category-${categoryIndex}`}
                  className="bg-white shadow-lg rounded-lg transition-transform duration-200 transform hover:scale-105"
                >
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {category.category}
                      <span className="ml-2 px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                        {category.subCategories.length} subcategories
                      </span>
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleCategory(categoryIndex)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {expandedItems[categoryIndex] ? (
                          <FiChevronUp size={20} />
                        ) : (
                          <FiChevronDown size={20} />
                        )}
                      </button>
                      <button
                        onClick={() => deleteItem("category", categoryIndex)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                  {expandedItems[categoryIndex] && (
                    <div className="border-t border-gray-200 divide-y divide-gray-200">
                      {category.subCategories.map(
                        (subCategory, subCatIndex) => (
                          <div
                            key={`subcat-${categoryIndex}-${subCatIndex}`}
                            className="px-4 py-4 sm:px-6"
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-md font-medium text-gray-800">
                                {subCategory.name}
                                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                                  {subCategory.products.length} products
                                </span>
                              </h4>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setFormData({
                                      category: category.category,
                                      subCategory: subCategory.name,
                                      product: "",
                                      price: "",
                                      quantity: "",
                                    });
                                    setEditIndex(null);
                                  }}
                                  className="text-indigo-600 hover:text-indigo-900 text-sm flex items-center"
                                >
                                  <FiPlus className="mr-1" size={14} />
                                  Add Product
                                </button>
                                <button
                                  onClick={() =>
                                    deleteItem(
                                      "subCategory",
                                      categoryIndex,
                                      subCatIndex
                                    )
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            </div>
                            {subCategory.products.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Product
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Price
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Quantity
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Total
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                      >
                                        Actions
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {subCategory.products.map(
                                      (product, prodIndex) => (
                                        <tr
                                          key={`prod-${categoryIndex}-${subCatIndex}-${prodIndex}`}
                                          className="hover:bg-gray-100 transition duration-200"
                                        >
                                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {product.name}
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            ${product.price.toFixed(2)}
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {product.quantity}
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            $
                                            {(
                                              product.price * product.quantity
                                            ).toFixed(2)}
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-3">
                                              <button
                                                onClick={() =>
                                                  handleEdit(
                                                    categoryIndex,
                                                    subCatIndex,
                                                    prodIndex
                                                  )
                                                }
                                                className="text-indigo-600 hover:text-indigo-900"
                                              >
                                                <FiEdit2 size={16} />
                                              </button>
                                              <button
                                                onClick={() =>
                                                  deleteItem(
                                                    "product",
                                                    categoryIndex,
                                                    subCatIndex,
                                                    prodIndex
                                                  )
                                                }
                                                className="text-red-600 hover:text-red-900"
                                              >
                                                <FiTrash2 size={16} />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">
                                No products in this subcategory yet
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EcommerceApp;
