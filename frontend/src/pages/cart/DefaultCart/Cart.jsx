import { useDispatch, useSelector } from "react-redux";
import FilledCart from "../FilledCart/FilledCart.jsx";
import EmptyCart from "../EmptyCart.jsx";
import "./cart.scss"
import { getCartAction } from "../../../redux/slice/cartSlice.jsx";

const Cart = () => {
    const dispatch = useDispatch();
    const total = useSelector(state => state.cart.total);
    return (
        <>
            <div className="cart-page">
                <div className="page-title">
                    <h4>Giỏ hàng</h4>
                </div>
                <main className="cart-main">
                    <div className="cart-container">
                        {total ? <FilledCart /> : <EmptyCart />}

                    </div>
                </main>

            </div>
        </>
    )
}

export default Cart;