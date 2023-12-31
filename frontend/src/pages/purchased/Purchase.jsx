import { useDispatch, useSelector } from "react-redux";
import "./Purchase.scss"
import { callGetOrder } from "../../services/api/orderAPI";
import { useEffect, useState } from "react";
import { Button, Col, Divider, Modal, Radio, Result, Row, Space } from "antd";
import { calcDeliveryCost, getOrderAction } from "../../redux/slice/orderSlice";
import { callPayment } from "../../services/api/paymentAPI";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import path from "../../routes/path";
const Purchase = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const user = useSelector(state => state.account.user);
    const orderId = localStorage.getItem("orderId");
    // const amount = localStorage.getItem("amount");
    const [amount, setAmount] = useState(Number(localStorage.getItem("amount")));
    const [orderList, setOrderList] = useState([]);
    const [value, setValue] = useState(0);
    const deliveryCost = useSelector(state => state.order.deliveryCost);
    // console.log("check amount: ", deliveryCost);
    // let orderList = [];
    const getOrderList = async () => {
        const res = await callGetOrder();
        if (res) {
            const allOrder = res.payload;
            const filteredOrderList = allOrder.filter(book => book.id == orderId);
            setOrderList(filteredOrderList);
            const orderInfo = {
                orderId: orderId,
                amount: amount,
                orderList: filteredOrderList
            };
            dispatch(getOrderAction(orderInfo));
        }
    }
    useEffect(() => {
        getOrderList();
    }, [value]);
    // console.log("order list: ", orderList);

    const onChange = (value) => {
        // console.log('radio checked', e.target.value);
        setValue(value);
        dispatch(calcDeliveryCost(value));
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const showALert = () => {
        setIsAlertOpen(true);
    }

    const handleOk = () => {
        setIsModalOpen(false);
        setIsAlertOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsAlertOpen(false);
    };
    const handlePurchase = async () => {
        if (value) {
            const res = await callPayment(orderId, Number(amount + deliveryCost));
            if (res) {
                // console.log("check call api: ", res);
                showModal();
                // setResultStatus('success');
                // setResultVisible(true);
            }
        } else {
            showALert();
        }

    }
    const donePayment = () => {
        navigate(path.home);
        localStorage.removeItem("orderId");
        localStorage.removeItem("amount");
    }
    return (
        <>
            <h4 style={{ display: "block", margin: "auto", width: "1400px", marginBottom: "15px", fontSize: "20px", fontFamily: "Arial, Helvetica, sans-serif" }}>Thanh toán</h4>
            <Row className="filled-cart-container" style={{ width: "1440px", margin: "auto" }}>
                <Col className="left" md={17} style={{ margin: "0 20px", height: "fit-content" }}>
                    <Col style={{ backgroundColor: "white", borderRadius: "4px", padding: "10px 0 10px" }}>
                        <p style={{ margin: "0 0 0 20px", fontSize: "20px", fontWeight: "600" }}>Đơn hàng của bạn</p>
                        <Col style={{ border: "1px solid #cfcece", margin: "15px 20px", borderRadius: "10px" }}>
                            {
                                orderList.map((book, index) => (

                                    <Row key={book.book_id} className="book-in-order">
                                        {/* <div className={"book-image"}>{book.front_page_url}</div> */}

                                        <Col md={10}>
                                            <Row>
                                                <img className="book-image" src={book.front_page_url} alt="image" />
                                                <div className="book-title" >{book.title}</div>
                                            </Row>
                                        </Col>
                                        <Col md={4}>
                                            <div className="price-each center">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price_each)}</div>
                                        </Col>
                                        <Col md={4}>
                                            <Row className="quantity-ordered center" style={{ border: "none", position: "relative", top: "1px" }}>

                                                SL: {book.quantity_ordered}

                                            </Row>
                                        </Col>
                                        <Col md={4}>
                                            <div className="amount center">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price_each * book.quantity_ordered)}</div>
                                        </Col>
                                        {index < orderList.length - 1 && <Divider />}
                                    </Row>



                                ))
                            }
                        </Col>
                    </Col>
                    <Col style={{ backgroundColor: "white", borderRadius: "4px", marginTop: "15px" }}>
                        <p style={{ margin: "0 0 0 20px", fontSize: "20px", fontWeight: "600" }}>Chọn phương thức giao hàng</p>
                        <Radio.Group
                            onChange={(e) => onChange(e.target.value)}
                            value={value}
                            style={{ margin: "10px 0 10px 20px" }}
                        >
                            <Space direction="vertical">
                                <Radio value={1}>Giao hàng tiêu chuẩn</Radio>
                                <Radio value={2}>Giao hàng hỏa tốc (Nhận hàng trong 2h)</Radio>
                            </Space>
                        </Radio.Group>
                    </Col>
                </Col>
                <Col className="right" md={6} style={{ height: "fit-content", marginRight: "20px" }}>
                    <Row className="user-info">
                        <h4>Giao tới</h4>
                        <div className="user-name" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                            <p>Tên người nhận: {user.name}</p>

                        </div>
                        <div className="user-phone" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                            <p>Số điện thoại: {user.phone}</p>

                        </div>
                        <div className="user-address" style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: "10px" }}>
                            <p>Địa chỉ: {user.address}</p>

                        </div>
                    </Row>
                    <Col className="order-info">
                        <h4 style={{ paddingLeft: "30px", position: "relative", top: "10px" }}>Đơn hàng</h4>
                        <Col>
                            <Row style={{ display: "flex", justifyContent: "space-between", margin: "5px 30px", maxHeight: "26px", position: "relative", bottom: "10px" }}>
                                <p style={{ fontSize: "16px", maxHeight: "26px", }}>Tạm tính: </p>
                                <p style={{ fontSize: "16px", maxHeight: "26px", }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}</p>
                            </Row>
                            <Row style={{ display: "flex", justifyContent: "space-between", margin: "5px 30px", maxHeight: "26px", }}>
                                <p style={{ fontSize: "16px", maxHeight: "26px", }}>Phí vận chuyển: </p>
                                <p style={{ fontSize: "16px", maxHeight: "26px", }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(deliveryCost)}</p>
                            </Row>
                            <Divider style={{ margin: "30px 40px 10px 70px", width: "220px", minWidth: "220px" }} />
                        </Col>
                        <Row style={{ display: "flex", justifyContent: "space-between", margin: "5px 30px", maxHeight: "26px", position: "relative", bottom: "10px" }}>
                            <p style={{ fontSize: "16px", fontWeight: "500" }}>Tổng tiền: </p>
                            <p style={{ fontWeight: "500", color: " rgb(255, 66, 78)", fontSize: "20px" }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount + deliveryCost)}</p>
                        </Row>

                        <button className="order-btn" type="submit" onClick={handlePurchase} >Đặt hàng</button>
                        {/* <Result
                            status={resultStatus}
                            title={resultStatus === 'success' ? 'Thanh toán thành công' : 'Có lỗi xảy ra'}
                            subTitle={resultStatus === 'success' ? 'Cảm ơn bạn đã mua hàng!' : 'Vui lòng thử lại sau'}
                            // extra={[
                            //     <Button type="primary" key="back" onClick={() => setResultVisible(false)}>
                            //         Quay lại cửa hàng
                            //     </Button>,
                            //     // Các nút hoặc thành phần extra khác
                            // ]}
                            visible={resultVisible}
                        /> */}
                        <Modal title="Đặt hàng thành công" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={[
                            <Button key="ok" type="primary" onClick={() => donePayment()}>
                                Tiếp tục mua sắm
                            </Button>,
                        ]}>
                            <FaCheckCircle style={{ display: "block", color: "rgb(15, 226, 15)", margin: "10px auto", fontSize: "70px" }} />
                            <div>Mã đơn hàng: {orderId}</div>
                            <div>Hình thức giao hàng: {value === 1 ? "Giao hàng tiêu chuẩn" : "Giao hàng hỏa tốc (Nhận hàng trong 2h)"}</div>
                            <div>Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount + deliveryCost)}</div>
                        </Modal>

                        <Modal title="Chưa chọn phương thức giao hàng" open={isAlertOpen} onOk={handleOk} onCancel={handleCancel} footer={[
                            <Button key="ok" type="primary" onClick={handleOk}>
                                Quay lại
                            </Button>,
                        ]}>
                            <p>Vui lòng chọn phương thức giao hàng để đặt hàng</p>
                        </Modal>
                    </Col>
                </Col>
            </Row>

        </>
    )
}

export default Purchase;