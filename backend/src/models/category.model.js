import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
      },
      slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      description: {
        type: String,
        required: [true, 'Category description is required'],
      },
      image: {
        type: String,
        required: [true, 'Category image is required'],
      },
    //   featuredProducts: [
    //     {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: 'Product',
    //     },
    //   ],
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true }
  );

  export const Category = mongoose.model('Category', categorySchema)