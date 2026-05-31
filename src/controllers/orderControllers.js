import { prisma } from "../config/db.js";

const getAllOrders = async (req, res) => {
    const orders = await prisma.order.findMany({
        where: { userId: req.user.id }
    })

    if (orders.length === 0) {
        return res.status(404).json({ error: "There is no orders" })
    }
    res.status(200).json({
        status: "success",
        data: {
            orders
        }
    })
}


const getOrder = async (req, res) => {
    const order = await prisma.order.findUnique({
        where: { id: req.params.id }
    })

    if (!order) {
        return res.status(404).json({ error: "Order Not Found" })
    }

    res.status(200).json({
        status: "success",
        data: {
            order
        }
    })
}

const addOrder = async (req, res) => {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: "Cart Is Empty" })
        }

        const orderItems = cart.items.map(cartItem => ({
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            unitPrice: cartItem.product.currentPrice
        }))

        const result = await prisma.$transaction(async (tx) => {
            for (const item of cart.items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                    select: { stock: true, productName: true }
                })
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient Stock for ${product.productName}`)
                }
            }
            const order = await tx.order.create({
                data: {
                    status: "PENDING",
                    userId: req.user.id,
                    items: {
                        create: orderItems
                    }
                },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            })

            for (const item of cart.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                })
            }
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id }
            })

            await tx.cart.delete({
                where: { id: cart.id }
            })

            return order
        })


        res.status(201).json({
            status: "success",
            data: {
                result
            }
        })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const updateOrder = async (req, res) => {
    const { status } = req.body
    const validStatus = ["PENDING", "CONFIRMED", "SHIPPED", "CANCELLED", "DELIVERED"]

    if (!validStatus.includes(status)) {
        return res.status(400).json({ error: "Invalid Status" })
    }

    const updatedOrder = await prisma.order.updateMany({
        where: { id: req.params.id },
        data: {
            status: status
        }
    })

    res.status(200).json({
        status: "success",
        data: {
            updatedOrder
        }
    })
}


const deleteOrder = async (req, res) => {
    await prisma.order.delete({
        where: { id: req.params.id }
    })
    res.status(200).json({
        message: "Order Deleted Successfully"
    })
}

export { addOrder, deleteOrder, updateOrder, getOrder, getAllOrders }