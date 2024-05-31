import mongoose from 'mongoose';
import slugify from 'slugify'

const productSchema = mongoose.Schema(
  {
    name: {
      unique: true,
      type: String,
      trim: true,
      minLength: [6, 'product name must be 6 characters long'],
      required: [true, 'product name is required'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'please add some description for your product'],
    },
    price: {
      type: Number,
      required: [true, 'product price is required'],
      min: 0,
      default: 10,
    },
    inStock: Number,
    available: Boolean,
    image: {
      type: String,
      required: [true, 'product image is mendatory'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'category is required']
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    ratings: {
        type: Number,
        min: 1,
        max: 5,
        default: 0
    },
    averageRating: Number,
    brand: String,
    tags: [String],
    warranty: Boolean,
  },
  { timestamps: true }
);

productSchema.pre('save', function(next) {
    if(!this.isModified('name')) return next();

    this.slug = slugify(this.name, {
        replacement: '-',
        lower: true,
        strict: true,
        trim: true
    })
    next()
})

export const Product = mongoose.model('Product', productSchema);
