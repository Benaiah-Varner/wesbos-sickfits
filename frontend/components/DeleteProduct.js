/* eslint-disable no-restricted-globals */
/* eslint-disable arrow-body-style */
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

const DELETE_PRODUCT = gql`
  mutation DELETE_PRODUCT($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

function update(cache, payload) {
  console.log(payload);
  console.log('running the update function afte delete');
  cache.evict(cache.identify(payload.data.deleteProduct));
}

const DeleteProduct = ({ id, children }) => {
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT, {
    variables: { id },
    update,
  });
  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        if (confirm('Are you sure you want to delete this item?')) {
          console.log('DElETING');
          deleteProduct().catch((err) => {
            console.log(err.message);
          });
        }
      }}
    >
      {children}
    </button>
  );
};

export default DeleteProduct;
