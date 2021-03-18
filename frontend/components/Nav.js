import React from 'react';
import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import { useUser } from './User';
import SignOut from './SignOut';
import { useCart } from '../lib/CartState'
import CartCount from './CartCount';

const Nav = () => {
  const user = useUser();
    const { openCart } = useCart()
  return (
    <NavStyles>
      <Link href="/products">Products</Link>
      {
          user && (
              <>
            <Link href="/Sell">Sell</Link>
            <Link href="/Orders">Orders</Link>
            <Link href="/Account">Account</Link>
            <SignOut/>
            <button type='button' onClick={openCart}>My Cart
              <CartCount count={user.cart.reduce((tally, cartItem) => {
                return tally + cartItem.quantity
              }, 0)}/>
            </button>
            </>
          )
      }
      {
          !user && (
              <>
                <Link href='/signin'>Sign In</Link>
            </>
          )
      }
    </NavStyles>
  );
};

export default Nav;
