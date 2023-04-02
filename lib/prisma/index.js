// import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require('@prisma/client');

// const client = globalThis.prisma || new PrismaClient()
const prisma = new PrismaClient()

// if (process.env.NODE_ENV !== 'production') {
//     globalThis.prisma = client
// }

// export default client

module.exports = {
    prisma,
};