import Joi from 'joi';

const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const messages = error.details.map(detail => ({
                field: detail.path.join('.'),
                messages: detail.message
            }));
            return res.status(400).json({ errors: messages });
        }

        req.validated = value;
        next();
    };
};

export default validate;