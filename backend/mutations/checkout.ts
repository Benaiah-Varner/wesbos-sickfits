import { CartItemCreateInput } from './../.keystone/schema-types';
import { OrderCreateInput } from '../.keystone/schema-types';
import { KeystoneContext } from '@keystone-next/types';
import StripeConfig from '../lib/stripe';

const graphql = String.raw
interface Arguments {
    token: string
}

async function checkout(
    root: any,
    { token }: Arguments,
    context: KeystoneContext
): Promise<OrderCreateInput> {
    const userId = context.session.itemId;
    if (!userId) {
        throw new Error('Sorry, you must be signed in to create an order!')
    }
    // make sure they are signed in
    const user = await context.lists.User.findOne({
        where: { id: userId },
        resolveFields: graphql`
            id
            name
            email
            cart {
                id
                quantity
                product {
                    name
                    price
                    description
                    id
                    photo {
                        id 
                        image {
                            id 
                            publicUrlTransformed
                        }
                    }
                }
            }
        `
    });
    console.dir(user, {depth: null});
    
    // calc total price
    const cartItems = user.cart.filter(cartItem => cartItem.product);
    const amount = cartItems.reduce((tally: number, cartItem: CartItemCreateInput) => {
        return tally + cartItem.quantity * cartItem.product.price;
    }, 0);
    console.log(amount);
    // create the charge with the stripe library
    const charge = await StripeConfig.paymentIntents.create({
        amount,
        currency: 'USD',
        confirm: true,
        payment_method: token,
    }).catch(err => {
        console.log(err);
        throw new Error(err.message);
    });
    
    // convert the cart items to order items
    const orderItems = cartItems.map(item => {
        console.log(item.product);
        const orderItem = {
            name: item.product.name,
            description: item.product.description,
            price: item.product.price,
            quantity: item.quantity,
            photo: { connect: { id: item.product.photo.id }}
        }
        console.log('Backend ',orderItem.quantity);
        return orderItem
    })
    console.log('debug ',orderItems)
    
    //create the order and return it
    const order = await context.lists.Order.createOne({
        data: {
            total: charge.amount,
            charge: charge.id,
            items: { create: orderItems }
        }
    });
    //save in DB
    const cartItemIds = user.cart.map(item => item.id);
    await context.lists.CartItem.deleteMany({
        ids: cartItemIds
    });

    return order;
}

export default checkout;