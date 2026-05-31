import { prisma } from "../config/db.js";


const getCart = async (req, res) => {
    const cart = await prisma.cart.findUnique({
        where: { userId: req.user.id }
    })
    if (!cart) {
        return res.status(404).json({ error: "Cart Not Found" })
    }
    res.status(200).json({
        status: "success",
        data: {
            cart
        }
    })
}



const addCart = async (req, res) => {
    const { name, id, quantity } = req.body


    let cart = await prisma.cart.upsert({
        where: { userId: req.user.id },
        create: {
            userId: req.user.id
        },
        update: {}
    })

    const product = await prisma.product.findUnique({
        where: { id: id }
    })
    if (!product) {
        return res.status(404).json({ error: "Item Doesn't Exist" })
    }

    const item = await prisma.cartItem.findFirst({
        where: { productId: id, cartId: cart.id }
    })


    if (!item) {
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: id,
                quantity: quantity
            }
        })
    }
    else {
        await prisma.cartItem.update({
            where: { id: item.id },
            data: {
                quantity: quantity + item.quantity
            }
        })
    }

    res.status(200).json({ message: `item ${name} added to cart` })
}

const updateCart = async (req, res) => {
    const { id, newQuantity } = req.body

    let cart = await prisma.cart.findUnique({
        where: { userId: req.user.id }
    })
    if (!cart) {
        return res.status(404).json({ error: "Cart doesnt Exist" })
    }
    const item = await prisma.cartItem.updateMany({
        where: { productId: id, cartId: cart.id },
        data: {
            quantity: newQuantity
        }
    })
    res.status(200).json({ message: "item updated successfully" })
}

const removeCart = async (req, res) => {
    const { id } = req.body
    const cart = await prisma.cart.findUnique({
        where: { userId: req.user.id }
    })

    if (!cart) {
        return res.status(404).json({ eror: "cart doesnt exist" })
    }

    await prisma.cartItem.deleteMany({
        where: { productId: id, cartId: cart.id }
    })

    res.status(200).json({ message: "Item deleted successfully" })

}

export { addCart, updateCart, removeCart, getCart }