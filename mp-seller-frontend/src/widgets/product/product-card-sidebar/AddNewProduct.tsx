import {CloseOutlined} from '@ant-design/icons';
import {Drawer, Segmented, Select} from 'antd';
import {memo, useState} from 'react';

import {AddNewProductSidebarType, SelectedOptiontype} from './types';

const AddNewProductSidebar = memo<AddNewProductSidebarType>(function AddNewProductSidebar({onClose, open}) {
    const [MP_OPTIONS, setMPOptions] = useState([
        {label: 'Яндекс.Маркет', value: 'ym'},
        {label: 'Озон', value: 'ozon'}
    ]);

    const [segmentedOptions, setSegmentedOptions] = useState<SelectedOptiontype>([{label: 'Общие ', value: 'common'}]);

    const deleteMPOption = (value: string) => {
        // Находим выбранный элемент в segmentedOptions
        const selectedOption = segmentedOptions.find(option => option.value === value);

        // Удаляем выбранный элемент из segmentedOptions
        setSegmentedOptions(prevOptions => prevOptions.filter(option => option.value !== value));

        // Удаляем поле icon перед добавлением элемента обратно в MP_OPTIONS
        const {icon, ...selectedOptionWithoutIcon} = selectedOption;

        // Добавляем выбранный элемент обратно в MP_OPTIONS
        setMPOptions(prevOptions => [...prevOptions, selectedOptionWithoutIcon]);
    };

    const onChange = (value: string) => {
        console.log(`selected ${value}`);
        // Находим выбранный элемент в MP_OPTIONS
        const selectedOption = MP_OPTIONS.find(option => option.value === value);

        // Добавляем поле icon к выбранному элементу
        const selectedOptionWithIcon = {...selectedOption, icon: <CloseOutlined />};

        // Добавляем выбранный элемент в segmentedOptions с полем icon
        setSegmentedOptions(prevOptions => [...prevOptions, selectedOptionWithIcon]);

        // Удаляем выбранный элемент из MP_OPTIONS
        setMPOptions(prevOptions => prevOptions.filter(option => option.value !== value));
    };

    return (
        <Drawer
            title="Создание КТ"
            onClose={onClose}
            open={open}
            extra={
                <Select
                    placeholder="Добавить МП"
                    onChange={onChange}
                    options={MP_OPTIONS}
                    className="min-w-[144px]"
                    disabled={MP_OPTIONS.length === 0}
                />
            }
        >
            <div>
                <Segmented options={segmentedOptions} block />
            </div>
        </Drawer>
    );
});

export default AddNewProductSidebar;
