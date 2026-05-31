import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const products = [
    {
        productName: "Ergonomic Mechanical Keyboard",
        currentPrice: 149.99,
        stock: 25,
    },
    {
        productName: "Ultra-Wide 4K Monitor",
        currentPrice: 599.50,
        stock: 10,
    },
    {
        productName: "Wireless Noise-Cancelling Headphones",
        currentPrice: 299.00,
        stock: 50,
    },
    {
        productName: "Minimalist Desk Lamp",
        currentPrice: 45.00,
        stock: 100,
    },
    {
        productName: "USB-C Hub (7-in-1)",
        currentPrice: 32.99,
        stock: 0, // Useful for testing "Out of Stock" logic
    },
    {
        productName: "Premium Leather Mousepad",
        currentPrice: 19.95,
        stock: 200,
    },
    {
        productName: "Smart Fitness Watch",
        currentPrice: 199.99,
        stock: 15,
    }
]

const main = async () => {
    for (const product of products) {
        await prisma.product.create({
            data: {
                productName: product.productName,
                currentPrice: product.currentPrice,
                stock: product.stock
            }
        })
        console.log(`${product.productName} Added`)
    }
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
}).finally(async () => {
    await prisma.$disconnect()
})