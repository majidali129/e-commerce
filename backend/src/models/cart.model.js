import mongoose, {Schema} from 'mongoose'


const cartSchema = Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    items: {
        type: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, 'quantity can not be less than 1'],
                    default: 1,
                }
            }
        ],
        default: []
    }
}, {timestamps: true});


export const Cart = mongoose.model('Cart', cartSchema)