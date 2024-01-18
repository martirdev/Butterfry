import {Button, Form} from 'antd';
import {memo} from 'react';

import {FooterAddDrawerType} from './types';

const FooterAddDrawer = memo<FooterAddDrawerType>(function FooterAddDrawer({onClose}) {
    return (
        <div>
            <Form.Item className="mb-2 flex justify-end">
                <Button onClick={onClose} className="mr-2">
                    Отменить
                </Button>
                <Button type="primary" htmlType="submit">
                    Сохранить
                </Button>
            </Form.Item>
        </div>
    );
});

export default FooterAddDrawer;
