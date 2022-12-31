# Hi there

# Development Mode
> yarn start:dev

# Deploy
> yarn build
> yarn start

# Envs
 - PORT
 - MONGO_URL - mongoDB connection url
 - JWT_SECRET
 - JWT_EXPIRES_IN

# Useful Decorators
 - @Protected() - route decorator. Ensures that user is logged in.
 - @UserData() - param decorator. If route uses @Protected() then this decorator will provide user data.