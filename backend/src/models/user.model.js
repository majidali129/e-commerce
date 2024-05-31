import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userSchema = Schema({
    userName: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
        required: [true, 'username is required'],
        minLength: [5, 'username must be equal or grater than 8 characters']
    },
    fullName: {
        type: String,
        required: [true, 'username is required'],
        minLength: [5, 'fullname must be equal or grater than 5 characters']
    },
    email: {
        type: String,
        required: [true, 'email address is required'],
        validate: {
            validator: value => value.includes('@'),
            message: 'Invalid mail address'
        }
    },
    phone: {
        type: String,
        required: [true, 'phone number is mendatory']
    },
    password: {
        required: [true, 'password is required'],
        type: String,
        minLength: [8, 'password needs to be 8 characters long']
    },
    confirmPassword: {
        type: String,
        validate: {
            validator: function(value){
                return value === this.password;
            },
            message: 'passwords does not match'
        }
    },
    avatar: {
        type: String,
        required: [true, 'avatar is required']
    },
    role: {
        type: String,
        required: [true, 'role is mendatory'],
        enum: {
            values: ['user', 'admin'],
            message: 'role can be either user or admin',
            // default: 'user'
        }
    },
    refreshToken: String
    // shippingAddress:{
    //     firstName: {
    //         type: String,
    //         required: true
    //     },
    //     lastName: {
    //         type: String,
    //         required: true
    //     },
    //     address1: {
    //         type: String,
    //         required: [true, 'please enter your address for delivery']
    //     },
    //     address2: String,
    //     city: String,
    //     zipCode: {
    //         type: String,
    //         requird: [true, 'zipcode is required']
    //     },
    //     country: String,
    // },
    // billingAddress:{
    //     firstName: {
    //         type: String,
    //         required: true
    //     },
    //     lastName: {
    //         type: String,
    //         required: true
    //     },
    //     address1: {
    //         type: String,
    //         required: [true, 'please enter your address for delivery']
    //     },
    //     address2: String,
    //     city: String,
    //     zipCode: {
    //         type: String,
    //         requird: [true, 'zipcode is required']
    //     },
    //     country: String,
    // }
},{timestamps: true});


userSchema.pre('save', async function(next){
    this.confirmPassword=undefined
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12);

    next()
})

userSchema.methods.isPasswordCorrect = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign({
        _id: this._id,
        username: this.userName,
        email: this.email
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
};

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
        _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}
export const User = mongoose.model('User', userSchema)