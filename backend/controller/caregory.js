import categoryModel from "../model/category.js";

export const getCategory = async (req, res) => {
    try {
        let result = await categoryModel.find().sort({createdAt : -1});
        res.status(200).json({
            result
        });
    }
    catch (err) {
        console.log(err);
    }
}

export const addCategory = async (req, res) => {
    try {
        let { name } = req.body;

        let newCate = new categoryModel({
            name
        });

        let result = await newCate.save();
        res.status(201).json({
            message: 'category has been created',
            sucess: true,
            result
        })
    }
    catch (err) {
        console.log(err);
    }

}


export const deleteCategory = async (req, res) => {
    try {
        let { id } = req.params;
        let result = await categoryModel.findByIdAndDelete(id);

        res.status(200).json({
            result,
            success: true,
            message: `${result.name} category deleteted successfully`
        })

    }
    catch (err) {
        console.log(err);
    }

}



export const updateCategory = async (req, res) => {
    try {
        let { id } = req.params;
        let result = await categoryModel.findByIdAndUpdate(id , req.body , {new : true});
        res.status(200).json({
            result,
            success: true,
            message: `category updated successfully`
        })

    }
    catch (err) {
        console.log(err);
    }

}