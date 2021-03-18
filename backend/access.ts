import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';
// At its simplest, access control is either a yes or no value

export function isSignedIn({ session }: ListAccessArgs) {
    return !!session;
}

const generatedPermissions = Object.fromEntries(permissionsList.map(perm => [
    perm,
    function({session }: ListAccessArgs) {
        return session?.data.role?.[perm]
    }
]));

export const permissions = {
    ...generatedPermissions,
}

// Rule based functions - used for list access
// rules can return a boolean, or a filter which limits which prducts they can CRUD
export const rules = {
    canManageProducts({ session }: ListAccessArgs) {
        if(!isSignedIn({session})) {
            return false
        }

        if(permissions.canManageProducts({ session })) {
            return true
        }

        return { user: {id: session.itemId }};
    },

    canOrder({ session }: ListAccessArgs) {
        if(!isSignedIn({session})) {
            return false
        }

        if(permissions.canManageCart({ session })) {
            return true
        }

        return { user: {id: session.itemId }};
    },

    canManageOrderItems({ session }: ListAccessArgs) {
        if(!isSignedIn({session})) {
            return false
        }

        if(permissions.canManageCart({ session })) {
            return true
        }

        return { order: {user: {id: session.itemId }}};
    },

    canReadProducts({session}: ListAccessArgs) {
        if(!isSignedIn({session})) {
            return false
        }

        if(permissions.canManageProducts({session})) {
            return true
        }
        return { status: 'Available' }
    },

    canManageUsers({ session }: ListAccessArgs) {
        if(!isSignedIn({session})) {
            return false
        }

        if(permissions.canManageUsers({ session })) {
            return true
        }
            
        return {id: session.itemId };
    },
}