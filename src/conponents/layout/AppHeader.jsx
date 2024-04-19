import { Layout, Select, Space, Button, Modal, Drawer } from 'antd';
import { useCrypto } from '../../context/crypto-context';
import CoinInfoModal from '../coinInfoModal';
import { useState, useEffect } from 'react';
import AddAssetForm from '../AddAssetForm';

const headerStyle = {
    width: '100%',
    textAlign: 'center',
    height: 60,
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

export default function AppHeader() {
    const [select, setSelect] = useState(false);
    const [coin, setCoin] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [drawer, setDrawer] = useState(false);

    const { crypto } = useCrypto();

    useEffect(() => {
        function keypress(event) {
            if (event.key === '/') {
                setSelect((prev) => !prev);
            }
        }
        document.addEventListener('keypress', keypress);

        return () => document.removeEventListener('keypress', keypress);
    }, []);

    function handleSelect(value) {
        setCoin(crypto.find((item) => item.id === value));
        setIsModalOpen(true);
    }

    return (
        <Layout.Header style={headerStyle}>
            <Select
                style={{
                    width: 250,
                }}
                value={'press / to open'}
                open={select}
                options={crypto?.map((coin) => ({
                    label: coin.name,
                    value: coin.id,
                    icon: coin.icon,
                }))}
                onSelect={handleSelect}
                onClick={() => {
                    setSelect((prev) => !prev);
                }}
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
            <Button
                onClick={() => {
                    setDrawer(true);
                }}
                type="primary"
            >
                Add Asset
            </Button>
            <Drawer
                width={650}
                title="Add Asset"
                onClose={() => setDrawer(false)}
                open={drawer}
                destroyOnClose
            >
                <AddAssetForm onClose={() => setDrawer(false)}/>
            </Drawer>
            <Modal
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <CoinInfoModal coin={coin} />
            </Modal>
        </Layout.Header>
    );
}
