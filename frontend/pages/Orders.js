import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import OrderStyles from '../components/styles/OrderStyles';
import OrderItemStyles from '../components/styles/OrderItemStyles';
import ErrorMessage from '../components/ErrorMessage';
import Head from 'next/head';
import Link from 'next/link';
import formatMoney from '../lib/formatMoney';
import styled from 'styled-components';

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    allOrders {
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

const OrderUl = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

const CountItemsInAnOrder = (order) => {
  return order.items.reduce((tally, item) => tally + item.quantity, 0);
};

export default function OrdersPage() {
  const { data, loading, error } = useQuery(USER_ORDERS_QUERY);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  const { allOrders } = data;
  console.log(allOrders);

  return (
    <div>
      <Head>
        <title>Your Orders ({allOrders.length})</title>
      </Head>
      <h2>You have {allOrders.length} orders!</h2>
      <OrderUl>
        {allOrders.map((order) => {
          return (
            <OrderItemStyles>
              <Link href={`/order/${order.id}`}>
                <a>
                  <div className="order-meta">
                    <p>{CountItemsInAnOrder(order)} Items</p>
                    <p>
                      {order.items.length} Product
                      {order.items.length === 1 ? '' : 's'}
                    </p>
                    <p>{formatMoney(order.total)}</p>
                  </div>
                  <div className="images">
                    {order.items.map((item) => {
                      return (
                        <img
                          key={`image-${item.id}`}
                          src={item.photo?.image?.publicUrlTransformed}
                          alt={item.name}
                        />
                      );
                    })}
                  </div>
                </a>
              </Link>
            </OrderItemStyles>
          );
        })}
      </OrderUl>
    </div>
  );
}
