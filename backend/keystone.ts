import { permissionsList } from './schemas/fields';
import { Role } from './schemas/Roles';
import { ProductImage } from './schemas/ProductImage';
import { Product } from './schemas/Product';
import { User } from './schemas/User';
import { createAuth } from '@keystone-next/auth'
import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session'
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail } from './lib/mail';
import { CartItem } from './schemas/CartItem';
import { extendGraphqlSchema } from './mutations/index';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';

const databaseURL = process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial'

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360,
    secret: process.env.COOKIE_SECRET,
}

const { withAuth } = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'email', 'password'],
        // add initial roles here
    },
    passwordResetLink: {
        async sendToken(args) {
            await sendPasswordResetEmail(args.token, args.identity);
            console.log('LOGGING ', args.token, args.identity);

        }
    }
});

export default withAuth(config({
    server: {
        cors: {
            origin: [process.env.FRONTEND_URL],
            credentials: true,
        },
    },
    db: {
        adapter: 'mongoose',
        url: databaseURL,
        async onConnect(keystone) {
            console.log('connected to DB')
            if (process.argv.includes("--seed-data")) {
                await insertSeedData(keystone);
            }
        },
    },
    lists: createSchema({
        //Scheme items here
        User,
        Product,
        ProductImage,
        CartItem,
        OrderItem,
        Order,
        Role
    }),
    extendGraphqlSchema: extendGraphqlSchema,
    ui: {
        // show ui for only authenticated users
        isAccessAllowed: ({ session }) => {
            return !!session?.data
        },
        // isAccessAllowed: () => true
    },
    // add session
    session: withItemData(statelessSessions(sessionConfig), {
        // graphql query
        User: `id name email role { ${permissionsList.join(' ')} }`
    })
}))