import { Button, Checkbox, Col, Divider, Form, InputNumber, Pagination, Rate, Row, Tabs } from "antd";
import { useEffect, useState } from "react";
import { callBooksSortByPriceAsc, callBooksSortByPriceDesc, callBooksSortByPurchased, callBooksSortByRating, callFilterBookByPrice, callGetBook } from "../../services/api/bookAPI";
import { useDispatch, useSelector } from "react-redux";
import { changePageAction, changeTabAction, getBooksAction, getCurrentBookAction } from "../../redux/slice/bookSlice.jsx";
import { Link, useNavigate } from "react-router-dom";
import path from "../../routes/path.jsx";
const Home = () => {
    // const user = useSelector(state => state.account.user);
    const tab = useSelector(state => state.books.tab);
    // const [page, setPage] = useState()
    const page = useSelector(state => state.books.page);
    const dispatch = useDispatch();
    const [isActive, setIsActive] = useState(tab);
    const [hoveredBookId, setHoveredBookId] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [startPrice, setStartPrice] = useState(0);
    const [endPrice, setEndPrice] = useState(0);

    const handleChangeFilter = async (changeValues, values) => {
        // console.log(">>> check handleChangeFilter", changeValues, values);
        const queryParams = [];
        if (values.category) {
            queryParams.push(`genres=${values.category.join(',')}`);
        }
        if (values.range && values.range.start !== undefined && values.range.end !== undefined) {
            queryParams.push(`start=${values.range.start}&end=${values.range.end}`);
            // const req = {
            //     "start": values.range.start,
            //     "end": values.range.end
            // }
            setStartPrice(values.range.start);
            setEndPrice(values.range.end);
            // const res = await callFilterBookByPrice(values.range.start, values.range.end);
            // console.log(">>>check filter: ", res);
        }

        // try {
        //     const res = await callFilteredBooks(queryParams.join('&'));
        //     if (res) {
        //         dispatch(getBooksAction(res));
        //     }
        // } catch (error) {
        //     console.error('Error filtering books:', error);
        // }

    }
    const handlePriceFilter = async () => {
        const res = await callFilterBookByPrice(startPrice, endPrice);
        // console.log(">>>check filter: ", res, " ", startPrice, " ", endPrice);
        if (res) {
            navigate(`?start=${startPrice}&end=${endPrice}`);
            dispatch(getBooksAction(res));
            dispatch(changePageAction(1));
        }
    }
    const onFinish = () => {

    }
    const items = [
        {
            key: "1",
            label: "Phổ biến",
            children: <></>
        },
        {
            key: "2",
            label: "Đánh giá",
            children: <></>
        },
        {
            key: "3",
            label: "Giá thấp đến cao",
            children: <></>
        },
        {
            key: "4",
            label: "Giá cao đến thấp",
            children: <></>
        }
    ]
    const initBooksSortByPurchased = async () => {
        // console.log(">>>check page: ", page);
        const res = await callBooksSortByPurchased(page);
        // console.log("api 1", page, res);
        if (res) {
            dispatch(getBooksAction(res));
            // console.log(">>>dispatch success: ", res);
        }
    }
    const initBooksSortByRating = async () => {
        const res = await callBooksSortByRating(page);
        // console.log("api 2");
        if (res) {
            dispatch(getBooksAction(res));
            // console.log(">>>dispatch success: ", res);
        }
    }
    const initBooksSortByPriceAsc = async () => {
        const res = await callBooksSortByPriceAsc(page);
        // console.log("api 3");
        if (res) {
            dispatch(getBooksAction(res));
            // console.log(">>>dispatch success: ", res);
        }
    }
    const initBooksSortByPriceDesc = async () => {
        const res = await callBooksSortByPriceDesc(page);
        // console.log("api 4", res);
        if (res) {
            dispatch(getBooksAction(res));
            // console.log(">>>dispatch success: ", res);
        }
    }

    useEffect(() => {
        // console.log(">>> useEffect is triggered. isActive =", isActive);
        switch (isActive) {
            case "1":
                initBooksSortByPurchased();
                break;
            case "2":
                initBooksSortByRating();
                break;
            case "3":
                initBooksSortByPriceAsc();
                break;
            case "4":
                initBooksSortByPriceDesc();
                break;
        }
        dispatch(changeTabAction(isActive));
    }, [isActive, page])
    const bookList = useSelector(state => state.books.bookList);
    // console.log(">>>here is bookList: ", bookList);
    const handleMouseEnter = (bookId) => {
        // setIsHovered(true);
        setHoveredBookId(bookId);
        // console.log(">>>check hover: ", bookId, hoveredBookId);
    }
    const handleMouseLeave = () => {
        setHoveredBookId(null);
        // setIsHovered(false);
    }
    const onBookClick = async (bookId) => {
        const res = await callGetBook(bookId);
        if (res) {
            dispatch(getCurrentBookAction(res));

            navigate(`${path.bookDetails}?id=${bookId}`);
            dispatch(changePageAction(1));
        }
    }
    const handleTabClick = () => {
        // console.log(items);
    }
    const onChange = (key) => {
        // console.log(key);
        setIsActive(key);
        // console.log(isActive);
    };
    const handleChangePage = (newPage) => {
        // console.log(newPage);
        dispatch(changePageAction(newPage));
        if (newPage === 1) {
            navigate(path.home);
        } else {
            navigate(`${path.home}?page=${newPage}`);
        }

    }

    return (
        // <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
        <Row className="homepage-container" gutter={[20, 20]} style={{ maxWidth: 1440, margin: '0 auto', minHeight: "70vh" }}>
            <Col className="sidebar" md={4} sm={0} xs={0} style={{ backgroundColor: "white", height: "fit-content", paddingBottom: "10px" }}>
                <div>
                    <p style={{ position: " relative", left: " 5px", fontWeight: "500" }}>Bộ lọc tìm kiếm</p>
                </div>
                <Form
                    onFinish={onFinish}
                    form={form}
                    onValuesChange={(changeValues, values) => handleChangeFilter(changeValues, values)}
                >

                    <Divider />
                    <Form.Item
                        name="price-range"
                        label="Khoảng giá"
                        labelCol={{ span: 24 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: "10px" }}>
                            <Form.Item name={["range", "start"]} style={{ marginLeft: 0 }}>
                                <InputNumber
                                    name="start"
                                    min={0}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />


                            </Form.Item>
                            <span style={{ position: "relative", top: "8px" }}>-</span>
                            <Form.Item name={["range", "end"]} style={{ marginRight: 0 }}>
                                <InputNumber
                                    name="end"
                                    min={0}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />


                            </Form.Item>
                        </div>
                        <div>
                            <button onClick={handlePriceFilter} style={{ width: "100%", backgroundColor: "white", border: "1px solid #0B74E5", color: "#0B74E5", borderRadius: "4px", padding: "7px 0" }} type="primary">
                                Áp dụng
                            </button>
                        </div>
                    </Form.Item>
                </Form>
            </Col>
            <Col className="content" md={20} sm={24} xs={24} >
                <Row className="category-bar" style={{ backgroundColor: "white" }}>
                    <div>
                        <h3 style={{ margin: "5px" }}>UETHUVIENSACH</h3>
                        <Tabs defaultActiveKey={tab} items={items} onTabClick={() => handleTabClick()} onChange={onChange} />
                    </div>
                </Row>
                <Row className="books" style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {/*<Col className="book-cell">*/}
                    {
                        bookList.map(book => (
                            // <Link to="book-details">
                            <div className="book-cell" key={book.id} style={hoveredBookId === book.id ? { boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)", width: "calc(20% - 9px)", backgroundColor: "white", cursor: "pointer", borderRadius: "4px" } : { width: "calc(20% - 9px)", backgroundColor: "white", cursor: "pointer", borderRadius: "4px" }}
                                onMouseEnter={() => handleMouseEnter(book.id)} onMouseLeave={handleMouseLeave}
                                onClick={() => onBookClick(book.id)}>

                                <span style={{ display: "inline" }}>
                                    <div className="thumbnail" >
                                        <img src={book.front_page_url} alt="" style={{ height: "250px", display: "block", margin: "auto", objectFit: "contain", backgroundColor: "white", border: "1px solid black" }} />
                                    </div>
                                    <div className="book-title" style={{ fontSize: "16px", marginTop: "5px" }}>
                                        {book.title}
                                    </div>
                                    <span style={{ fontSize: "12px" }}>
                                        <span className="book-rating">
                                            {book.rating}
                                            <Rate value={Math.floor(book.rating)} disabled style={{ fontSize: "12px", position: "relative", left: "5px" }} />
                                        </span>
                                        <Divider type={"vertical"} style={{ height: "20px", margin: "0 6px" }} />
                                        <span className="book-purchased" style={{ fontSize: "12px" }}>
                                            Đã bán {book.number_of_purchases}
                                        </span>
                                    </span>

                                    <div className="book-price" style={{ marginTop: "30px" }}>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
                                    </div>
                                </span>

                            </div>
                            // </Link>


                        ))
                    }

                    {/*</Col>*/}
                </Row>

            </Col>
            <Pagination defaultCurrent={1} current={page} total={30} onChange={handleChangePage} style={{ margin: "auto" }} />
        </Row>
        // </div>
    )
}

export default Home;