## Project Structure

```text
ecommerce-api/
├── src/
│   ├── app.js                 # Express app setup
│   ├── config/
│   │   ├── database.js        # PostgreSQL connection
│   │   ├── redis.js           # Redis client
│   │   └── stripe.js          # Stripe config
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── validation.js      # Input validation
│   │   ├── errorHandler.js    # Error handling
│   │   └── logger.js          # Request logging
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   ├── Review.js
│   │   └── index.js           # Model associations
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── payments.js
│   │   └── index.js           # Route aggregation
│   ├── services/
│   │   ├── emailService.js
│   │   ├── paymentService.js
│   │   ├── cacheService.js
│   │   └── orderService.js
│   └── utils/
│       ├── validators.js
│       ├── formatters.js
│       └── helpers.js
├── tests/
│   ├── auth.test.js
│   ├── products.test.js
│   ├── cart.test.js
│   └── orders.test.js
├── seeds/
│   └── seedDatabase.js
├── migrations/
│   └── 001_initial_schema.sql
├── logs/
├── package.json
├── .env.example
├── .env (git ignored)
├── jest.config.js
├── index.js
└── README.md