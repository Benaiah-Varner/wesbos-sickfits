import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import OrderStyles from '../../components/styles/OrderStyles';
import OrderItemStyles from '../../components/styles/OrderItemStyles';
import ErrorMessage from '../../components/ErrorMessage';
import Head from 'next/head';
import formatMoney from '../../lib/formatMoney'

const ORDER_QUERY = gql`
  query singleOrder($id: ID!) {
    order: Order(where: { id: $id }) {
      id
      charge
      total
      user {
          id
      }
      items {
        id
        name
        description
        price
        quantity
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

export default function SingleOrdersPage({query}) {
    console.log(query.id);
    const { data, loading, error } = useQuery(ORDER_QUERY, {
        variables: {
            id: query.id
        }
    })

    if(loading) {
        return <p>Loading...</p>
    }

    if(error) {
        return <ErrorMessage error={error} />
    }

    const { order } = data
    const items = order.items
    console.log(items);

  return (
      <OrderStyles>
          <h1>Your Order details</h1>
          <Head>
              <title>
                  Sick Fits - Your Order details
              </title>
          </Head>
          <p>
              <span>Order id:</span>
              <span>{order.id}</span>
          </p>
          <p>
              <span>Charge:</span>
              <span>{order.charge}</span>
          </p>
          <p>
              <span>Order Total:</span>
              <span>{formatMoney(order.total)}</span>
          </p>
          <p>
              <span>Item Count:</span>
              <span>{items.length}</span>
          </p>
          <div className="items">
          {
              items.map((item, idx) => {
               return <div className="order-item" key={idx}>
                    <img src={item.photo.image.publicUrlTransformed} alt={item.title}/>
                    <div className="item-details">
                        <h2>{item.name}</h2>
                        <p>Qty: {item.quantity}</p>
                        <p>Each: {formatMoney(item.price)}</p>
                        <p>Sub Total: {formatMoney(item.price * item.quantity)}</p>
                        <p>{item.description}</p>
                    </div>
                </div>
              })
          }
          </div>
      </OrderStyles>
  );
};
