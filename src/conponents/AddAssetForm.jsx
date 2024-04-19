import {
    Select,
    Space,
    Divider,
    Form,
    Button,
    InputNumber,
    DatePicker,
    Result,
} from 'antd';
import { useState, useRef } from 'react';
import { useCrypto } from '../context/crypto-context';
import CoinInfo from './CoinInfo';

export default function AddAssetForm({ onClose }) {
    const [form] = Form.useForm();
    const { crypto, addAsset } = useCrypto();
    const [coin, setCoin] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const assetRef = useRef();

    if (submitted) {
        return (
            <Result
                status="success"
                title="New Asset was added!"
                subTitle={`Added ${assetRef.current.amount} of ${coin.name} by price ${assetRef.current.price}`}
                extra={[
                    <Button type="primary" key="console" onClick={onClose}>
                        Close
                    </Button>,
                ]}
            />
        );
    }

    const validateMessage = {
        required: '${label} is required!',
        types: {
            number: '${label} is not valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };

    if (!coin) {
        return (
            <Select
                style={{ width: '100%' }}
                placeholder={'Select coin'}
                onSelect={(v) => {
                    setCoin(crypto.find((c) => c.id === v));
                }}
                options={crypto?.map((coin) => ({
                    label: coin.name,
                    value: coin.id,
                    icon: coin.icon,
                }))}
                optionRender={(option) => (
                    <Space>
                        <img
                            style={{ width: 20 }}
                            src={option.data.icon}
                            alt={option.data.label}
                        />{' '}
                        {option.data.label}
                    </Space>
                )}
            />
        );
    }
    function onFinish(value) {
        const newAsset = {
            id: coin.id,
            amount: value.amount,
            price: value.price,
            date: value.data?.$d ?? new Date(),
            total: value.total,
        };
        assetRef.current = newAsset;

        setSubmitted(true);

        addAsset(newAsset);
    }

    function handleAmountChange(value) {
        form.setFieldsValue({
            total: +(value * form.getFieldValue('price')).toFixed(2),
        });
    }

    function handlePriceChange(value) {
        form.setFieldsValue({
            total: +(value * form.getFieldValue('amount')).toFixed(2),
        });
    }

    return (
        <Form
            form={form}
            name="basic"
            labelCol={{
                span: 4,
            }}
            wrapperCol={{
                span: 10,
            }}
            style={{
                maxWidth: 600,
            }}
            initialValues={{
                price: +coin.price.toFixed(2),
            }}
            onFinish={onFinish}
            validateMessages={validateMessage}
        >
            <CoinInfo coin={coin} />

            <Divider />

            <Form.Item
                label="Amount"
                name="amount"
                rules={[
                    {
                        required: true,
                        type: 'number',
                        min: 0,
                        max: 1000,
                    },
                ]}
            >
                <InputNumber
                    placeholder="Input coin amount"
                    onChange={handleAmountChange}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item label="Price" name="price">
                <InputNumber
                    onChange={handlePriceChange}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item label="Date & Time" name="date">
                <DatePicker showTime format="DD-MM-YYYY HH:mm:ss" />
            </Form.Item>

            <Form.Item label="Total" name="total">
                <InputNumber disabled style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Add Asset
                </Button>
            </Form.Item>
        </Form>
    );
}
