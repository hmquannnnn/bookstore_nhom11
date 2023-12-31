import { Avatar, Button, Col, Divider, Form, Input, Row, Upload, message } from "antd";
import { AiOutlineUser, AiOutlineMail } from "react-icons/ai";
import { FiSmartphone, FiLock } from "react-icons/fi"
import { BiPencil } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux";
import "./UserProfile.scss"
import { callChangeAddress, callChangeAvatar, callChangeName, callFetchAccount } from "../../services/api/userAPI";
import { useEffect, useState } from "react";
import { doChangeAddressAction, doChangeNameAction, doGetAccountAction, updateAvatar } from "../../redux/slice/accountSlice";
import { Link } from "react-router-dom";
import path from "../../routes/path";

// const props = {
//     beforeUpload: (file) => {
//         const isPNG = file.type === 'image/jpg';
//         if (!isPNG) {
//             message.error(`${file.name} is not a png file`);
//         }
//         return isPNG || Upload.LIST_IGNORE;
//     },
//     onChange: (info) => {
//         console.log(info.fileList);
//     },
// };
const removeCircularReferences = (object) => {
    const seen = new WeakSet();
    return JSON.parse(JSON.stringify(object, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    }));
};

const UserProfile = () => {
    const dispatch = useDispatch();
    const [key, setKey] = useState(0);
    const [user, setUser] = useState(useSelector(state => state.account.user))
    const fetchAccount = async () => {
        const res = await callFetchAccount();
        // console.log("check info: ", res);
        dispatch(doGetAccountAction(res));
        setUser(res);
    }

    useEffect(() => {
        fetchAccount();
    }, [])
    const onFinish = async ({ name, address }) => {
        if (name !== undefined) {
            const nameRes = await callChangeName(name);
            if (nameRes.message === "update success") {
                dispatch(doChangeNameAction(name));
                // console.log(">>> call name")
            }
        }

        if (address !== undefined) {
            const addressRes = await callChangeAddress(address);
            if (addressRes.message === "update success") {
                doChangeAddressAction(address);
                // console.log(">>> call address")
            }
        }


        window.location.reload();
    };
    // const handleChangeName = (e) => {
    //     setUserName(e.target.value);
    // }
    // const customRequest = async (imageFile) => {
    //     const res = await callChangeAvatar(imageFile);
    //     console.log("check avatar: ", res);
    //     if (res.payload) {
    //         console.log("image: ", res);
    //     }
    // };
    const customRequest = async (imageFile) => {
        // Kiểm tra và làm sạch đối tượng trước khi gửi
        // const cleanedObject = removeCircularReferences(imageFile);
        // console.log(cleanedObject);
        const formData = new FormData();
        formData.append('image', imageFile);
        const res = await callChangeAvatar(formData);
        console.log("check avatar: ", res);
        if (res.payload) {
            console.log("image: ", res);
        }
    };

    const handleImage = (e) => {
        const file = e.target;
        console.log(file);
    }

    return (
        <>
            <div className="profile-page" style={{ margin: "auto", width: "1440px", height: "66vh" }}>
                <h3 style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "22px" }}>Thông tin tài khoản</h3>
                <div className="main" style={{ backgroundColor: "white", borderRadius: "5px", height: "400px", border: "none" }}>
                    <Row>
                        <Col className="info" md={14} style={{ height: "400px" }}>
                            <h4 style={{ fontSize: "20px", color: "#64646D", fontWeight: "400", margin: "5px 0 0 10px" }}>Thông tin cá nhân</h4>
                            {/* <Divider/> */}
                            <Row>
                                <Col className="avatar" span={5} >

                                </Col>
                                <Col md={1} />
                                <Col className="user-info" span={23} >
                                    <Form
                                        name="form"
                                        onFinish={onFinish}
                                    >
                                        <Form.Item
                                            name="name"
                                            label="Tên tài khoản"
                                            labelCol={{ span: 24 }}
                                        >
                                            <Input value={user.name} placeholder={user.name}
                                                //  onChange={handleChangeName} 
                                                style={{ borderRadius: "2px" }} />
                                        </Form.Item>
                                        {/* <Form.Item
                                            name="email"
                                            label="Email"
                                            labelCol={{ span: 24 }}
                                        >
                                            <Input placeholder={user.email} style={{ borderRadius: "2px" }} />
                                        </Form.Item>
                                        <Form.Item
                                            name="phone"
                                            label="Số điện thoại"
                                            labelCol={{ span: 24 }}
                                        >
                                            <Input placeholder={user.phone} style={{ borderRadius: "2px" }} />
                                        </Form.Item> */}
                                        <Form.Item
                                            name="address"
                                            label="Địa chỉ"
                                            labelCol={{ span: 24 }}
                                        >
                                            <Input value={user.address} placeholder={user.address} style={{ borderRadius: "2px" }} />
                                        </Form.Item>
                                        <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
                                    </Form>
                                </Col>

                            </Row>

                        </Col>
                        <Divider type="vertical" style={{ height: "350px" }} />
                        <Col className="abc" md={9} style={{ height: "400px" }}>
                            <Row>
                                <div>
                                    <h4 style={{ fontSize: "20px", color: "#64646D", fontWeight: "400", margin: "5px 0 0 0" }}>Email và Số điện thoại</h4>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div className="container">
                                            <AiOutlineMail className="icon" style={{ top: "14px" }} />
                                            <div className="text">
                                                <p>Email</p>
                                                <p>{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div className="container">
                                            <FiSmartphone className="icon" style={{ top: "12px" }} />
                                            <div className="text">
                                                <p>Số điện thoại</p>
                                                <p>{user.phone}</p>
                                            </div>

                                        </div>
                                        <Button style={{ position: "relative", left: "340px", top: "10px" }}>
                                            <Link to={path.changePhone}>
                                                Cập nhật
                                            </Link>
                                        </Button>
                                    </div>


                                </div>

                            </Row>
                            <Divider />
                            <Row>
                                <div>
                                    <h4 style={{ fontSize: "20px", color: "#64646D", fontWeight: "400", margin: "5px 0 0 0" }}>Bảo mật</h4>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div className="container">
                                            <FiLock className="icon" style={{ top: "12px" }} />
                                            <p className="text">Đổi mật khẩu</p>
                                        </div>
                                        <Button style={{ position: "relative", left: "342px", top: "10px" }}>
                                            <Link to={path.changePassword}>
                                                Cập nhật
                                            </Link>

                                        </Button>
                                    </div>

                                </div>
                            </Row>
                        </Col>
                    </Row>
                </div>

            </div>

        </>
    )
}

export default UserProfile;
