// import { useState } from "react";

import { Button, Checkbox, Divider, Form, Input, message, notification } from "antd";
import FormItem from "antd/es/form/FormItem";
import { useNavigate } from "react-router-dom";
import { callRegister } from "../../services/api";
import "./register.scss"


const Register = () => {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        const { email, name, phone, password, address } = values;

        const res = await callRegister(email, name, phone, password, address);
        if (res) {
            console.log(res);
            message.success('Đăng ký thành công!');
            navigate('/dang-nhap');
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
            });
        }


    }

    return (
        <>
            <div className="register-page">
                <main className="main">
                    <div className="container">
                        
                            <h2 className="text text-large">Đăng ký</h2>

                        
                        <Form
                            name="basic"
                            onFinish={onFinish}
                            autoComplete="off"
                        >

                            <FormItem
                                className="input-box"
                                labelCol={{ span: 24 }}
                                label="Email"
                                name="email"

                                rules={[
                                    {
                                        required: true,

                                        message: "Vui lòng điền email"
                                    },
                                    {
                                        type: "email",
                                        message: "Vui lòng điền email hợp lệ"
                                    }
                                ]}
                            >
                                <Input />
                            </FormItem>
                            <FormItem
                                className="input-box"
                                labelCol={{ span: 24 }}
                                label="Tên tài khoản"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng điền tên tài khoản"
                                    },
                                    {
                                        min: 6,
                                        max: 24,
                                        message: "Tên tài khoản dài 6-24 kí tự"
                                    }

                                ]}
                            >
                                <Input />
                            </FormItem>
                            <FormItem
                                className="input-box"
                                labelCol={{ span: 24 }}
                                label="Số điện thoại"
                                name="phone"

                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng điền số điện thoại"
                                    },
                                    {
                                        pattern: new RegExp(/^[0-9]+$/),
                                        message: "Vui lòng điền số điện thoại hợp lệ"
                                    }
                                ]}
                            >
                                <Input />
                            </FormItem>
                            <FormItem
                                className="input-box"
                                labelCol={{ span: 24 }}
                                label="Mật khẩu"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng điền mật khẩu"
                                    },
                                    {
                                        min: 6,
                                        message: "Mật khẩu gồm ít nhất 6 kí tự"
                                    },
                                    {
                                        max: 24,
                                        message: "Mật khẩu gồm tối đa 24 kí tự"
                                    }
                                ]}
                            >
                                <Input.Password />
                            </FormItem>
                            <Form.Item
                                className="input-box"
                                labelCol={{ span: 24 }}
                                name="confirm"
                                label="Xác nhận mật khẩu"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng xác nhận mật khẩu',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu không trùng khớp'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item> 
                            <Form.Item
                                className="input-box"
                                labelCol={{ span: 24 }}
                                name="address"
                                label="Địa chỉ"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng điền địa chỉ"
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                className="input-box"
                                name="agreePolicy"
                                valuePropName="checked"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng đồng ý với chính sách"

                                    },
                                ]}
                            >
                                <Checkbox>
                                    Tôi đã đọc và đồng ý với{" "}
                                    <a href="/chinh-sach-su-dung">chính sách sử dụng</a> và{" "}
                                    <a href="/chinh-sach-bao-mat">chính sách bảo mật</a>
                                </Checkbox>
                            </Form.Item>
                            <Button className="input-box" type="primary" htmlType="submit" style={{ width: "100%" }}>Đăng ký</Button>
                            <Divider />
                            <p className="text text-normal" style={{ textAlign: "center" }}>Đã có tài khoản?&#160;
                                <span>
                                    <a href="/dang-nhap">Đăng nhập</a>
                                </span>
                            </p>
                        </Form>
                    </div>
                </main>
            </div>
        </>
    )

    // const [email, setEMail] = useState("");
    // const [password, setPassword] = useState("")
    // return (
    //     <>
    //         <input value={email} onChange={(e) => setEMail(e.target.value)} />
    //         <input value={password} onChange={(e) => setPassword(e.target.value)} />
    //     </>

    // )
}

export default Register;