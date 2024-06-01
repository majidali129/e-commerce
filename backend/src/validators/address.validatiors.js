import { body } from 'express-validator';

export const createAddrssValidator = () => {
  return [
    body('addressLine1').trim().notEmpty().withMessage('Address line 1 is required'),
    body('city').trim().notEmpty().withMessage('city is required'),
    body('country').trim().notEmpty().withMessage('country is required'),
    body('pincode')
      .trim()
      .notEmpty()
      .withMessage('pincode is required')
      .isNumeric()
      .isLength({ min: 5, max: 6 })
      .withMessage('invalid pincode'),
    body('state').trim().notEmpty().withMessage('sate is required'),
  ];
};
