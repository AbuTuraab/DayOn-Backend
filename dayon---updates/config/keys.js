

const secretKeys = {

    JWT_SECRET: process.env.JWT_SECRET || "123456",
    DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost:27017/Adehex",
}



module.exports={
    secretKeys,
}