import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';

export const ADDTOCART_MUTATION = gql`
  mutation ADD_TO_CART($id: ID!) {
    addToCart(productId: $id) {
        id
    }
  }
`;

export default function AddToCart({ id }) {
    const [addToCart, {loading}] = useMutation(ADDTOCART_MUTATION, {
        variables: { id },
        refetchQueries: [{ query: CURRENT_USER_QUERY }]
    })

    return <button disabled={loading} type='button' onClick={addToCart}>Add{loading && 'ing'} To Cart</button>
}
