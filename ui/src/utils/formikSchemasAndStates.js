import * as Yup from 'yup';
const addPedValidationShcema = Yup.object({
    name: Yup
        .string()
        .min(2, 'Name should be of minimum 2 characters length')
        .required('Name is required'),
    age: Yup
        .number('Enter Pet Age')
        .integer('Please Provide Whole Number')
        .typeError('Age Must Be A Number')
        .moreThan(-0.1, 'Age Must Be A Positive Number')
        .required('Age is required'),
    category: Yup
        .string()
        .required('Category is required'),
    breed: Yup
        .string()
        .required('Breed is required'),
    sex: Yup
        .string()
        .required('Sex is required'),
    color: Yup
        .string()
        .required('Color is required'),
    size: Yup
        .string()
        .required('Size is required'),
    description: Yup
        .string()
        .required('Description is required'),
});

const addPetInitialValues = {
    name: '',
    age: '',
    color: '',
    description: '',
    category: '',
    breed: '',
    sex: '',
    size: '',
}

const changePasswordsInitialValues = {
    currentPassword: '',
    newPassword: '',
}

const changePasswordsValidationSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .required("No password provided.")
        .min(5, "Password is too short - should be 5 chars minimum.")
        .matches(/(?=.*[0-9])/, "Password must contain a number."),
    newPassword: Yup.string()
        .required("No password provided.")
        .min(5, "Password is too short - should be 5 chars minimum.")
        .matches(/(?=.*[0-9])/, "Password must contain a number."),
})

const editPetValidationSchema = Yup.object({
    name: Yup
        .string()
        .min(2, 'Name should be of minimum 2 characters length')
        .required('Name is required'),
    age: Yup
        .number('Enter Pet Age')
        .integer('Please Provide Whole Number')
        .typeError('Age Must Be A Number')
        .positive('Age Must Be A Positive Number')
        .required('Age is required'),
    category: Yup
        .string()
        .required('Category is required'),
    breed: Yup
        .string()
        .required('Breed is required'),
    sex: Yup
        .string()
        .required('Sex is required'),
    color: Yup
        .string()
        .required('Color is required'),
    size: Yup
        .string()
        .required('Size is required'),
    description: Yup
        .string()
        .required('Description is required'),
});


const editUserValidationSchema = Yup.object().shape({
    firstName: Yup.string()
        .required("Required")
        .min(2, "Name is too short - should be 2 chars minimum."),
    lastName: Yup.string()
        .required("Required")
        .min(2, "Name is too short - should be 2 chars minimum."),
    dob: Yup.date()
        .required('Required')
        .nullable(),
    phone: Yup.string()
        .required()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(10, 'Must be exactly 10 digits')
        .max(10, 'Must be exactly 10 digits'),
    city: Yup.string()
        .required('Must Pick a City')
        .nullable(true)
})


const aboutUsInitialValues = {
    email: "",
    subject: '',
    body: ''
}

const aboutUsValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Email must be a valid email')
        .required("Required"),
    subject: Yup.string(),
    body: Yup.string()
        .min(5, 'Mail should be of minimum 5 characters length')
        .required("Required"),
})

const forgotPasswordInitialValues = {
    email: "",
}

const forgotPasswordValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Email must be a valid email')
        .required("Required"),
})


const loginInitialValues = { userName: "", password: "" }

const loginValidationSchema = Yup.object().shape({
    userName: Yup.string()
        .email('Email must be a valid email')
        .required("Required"),
    password: Yup.string()
        .required("No password provided.")
        .min(5, "Password is too short - should be 5 chars minimum.")
        .matches(/(?=.*[0-9])/, "Password must contain a number.")
})

const registrationInitialValues = {
    firstName: '',
    lastName: '',
    email: "",
    password: "",
    dob: null,
    phone: '',
    city: '',

}

const registrationValidationSchema = Yup.object().shape({
    firstName: Yup.string()
        .required("Required")
        .min(2, "Name is too short - should be 2 chars minimum."),
    lastName: Yup.string()
        .required("Required")
        .min(2, "Name is too short - should be 2 chars minimum."),
    email: Yup.string()
        .email('Email must be a valid email')
        .required("Required"),
    password: Yup.string()
        .required("No password provided.")
        .min(5, "Password is too short - should be 5 chars minimum.")
        .matches(/(?=.*[0-9])/, "Password must contain a number."),
    dob: Yup.date()
        .required('Required')
        .nullable(),
    phone: Yup.string()
        .required()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(10, 'Must be exactly 10 digits')
        .max(10, 'Must be exactly 10 digits'),
    city: Yup.string()
        .required()


})

const resetPasswordInitialValues = {
    currentPassword: '',
    newPassword: '',
}

const resetPasswordValidationSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .required("No password provided.")
        .min(6, "Token is too short - should be 6 chars minimum."),
    newPassword: Yup.string()
        .required("No password provided.")
        .min(5, "Password is too short - should be 5 chars minimum.")
        .matches(/(?=.*[0-9])/, "Password must contain a number."),
})

export {
    addPetInitialValues,
    addPedValidationShcema,
    forgotPasswordInitialValues,
    forgotPasswordValidationSchema,
    loginInitialValues,
    loginValidationSchema,
    resetPasswordInitialValues,
    resetPasswordValidationSchema,
    registrationInitialValues,
    registrationValidationSchema,
    aboutUsInitialValues,
    aboutUsValidationSchema,
    changePasswordsInitialValues,
    changePasswordsValidationSchema,
    editPetValidationSchema,
    editUserValidationSchema
} 