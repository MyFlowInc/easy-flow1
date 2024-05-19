import React, { useContext, useEffect, useRef, useState } from "react";
import {
	ConfigProvider,
	Form,
	Input,
	InputNumber,
	Table,
	Typography,
} from "antd";
import { TableTheme } from "../../theme/theme";
import { CloseCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import _ from "lodash";

type InputRef = any;
type FormInstance<T> = any;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
	key: string;
	mode: string;
	force: string;
	num: number;
	price: number;
	total: number;
}

interface EditableRowProps {
	index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
	const [form] = Form.useForm();
	return (
		<Form form={form} component={false}>
			<EditableContext.Provider value={form}>
				<tr {...props} />
			</EditableContext.Provider>
		</Form>
	);
};

interface EditableCellProps {
	title: React.ReactNode;
	editable: boolean;
	children: React.ReactNode;
	dataIndex: keyof Item;
	record: Item;
	handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
	title,
	editable,
	children,
	dataIndex,
	record,
	handleSave,
	...restProps
}) => {
	const [editing, setEditing] = useState(false);
	const inputRef = useRef<InputRef>(null);
	const form = useContext(EditableContext)!;
	const numKeys = ["num", "price"];
	useEffect(() => {
		if (editing) {
			inputRef.current!.focus();
		}
	}, [editing]);

	const toggleEdit = () => {
		setEditing(!editing);
		form.setFieldsValue({ [dataIndex]: record[dataIndex] });
	};

	const save = async () => {
		try {
			const values = await form.validateFields();
			toggleEdit();
			// console.log("Received values of form: ", record, values);
			handleSave({ ...record, ...values });
		} catch (errInfo) {
			console.log("Save failed:", errInfo);
		}
	};

	let childNode = children;

	if (editable) {
		childNode = editing ? (
			<Form.Item
				style={{ margin: 0 }}
				name={dataIndex}
				rules={
					[
					]
				}
			>
				{numKeys.includes(dataIndex) && (
					<InputNumber
						size="small"
						style={{ width: "56px" }}
						ref={inputRef}
						onPressEnter={save}
						onBlur={save}
					/>
				)}
				{!numKeys.includes(dataIndex) && (
					<Input
						size="small"
						style={{ width: "56px" }}
						ref={inputRef}
						onPressEnter={save}
						onBlur={save}
					/>
				)}
			</Form.Item>
		) : (
			<div
				className="editable-cell-value-wrap"
				style={{ paddingRight: 12 }}
				onClick={toggleEdit}
			>
				{_.get(children, "1") ? children : "点击输入"}
			</div>
		);
	}

	return (
		<td {...restProps} className="overflow-hidden">
			{childNode}
		</td>
	);
};
const { Text } = Typography;

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
	key: React.Key;
	mode: string;
	force: string;
	num: number;
	price: number;
	total: number;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;
 
const HistoryTable: React.FC = (props: any) => {
	const { column, form, setForm } = props;
	const [dataSource, setDataSource] = useState<DataType[]>([]);
	const [disabled, setDisabled] = useState(false);
	const columns: any = [
		{
			title: "时间",
			dataIndex: "mode",
			editable: true,
		},
		{
			title: "人员",
			editable: true,
			dataIndex: "force",
		},
		{
			title: "事件描述",
			editable: true,
			dataIndex: "num",
		},
		{
			title: "事件类型",
			editable: true,
			dataIndex: "num",
		},
	];
	const components = {
		body: {
			row: EditableRow,
			cell: EditableCell,
		},
	};

	useEffect(() => {
		if (_.get(column, "disabled")) {
			setDisabled(true);
		} else {
			setDisabled(false);
		}
	}, [column]);

 
	useEffect(() => {
		if(form.id){
			console.log(222 ,form.id)
		}
	}, [form.id]);
 


 
	return (
		<div className="w-full">
		 
			<div
				className="w-full overflow-hidden overflow-x-auto"
				style={{ pointerEvents: disabled ? "none" : "auto" }}
			>
				<ConfigProvider theme={TableTheme}>
					<Table
						size="small"
						pagination={false}
						components={components}
						rowClassName={() => "editable-row"}
						bordered
						dataSource={dataSource}
						columns={columns as ColumnTypes}
 					/>
				</ConfigProvider>
			</div>
		</div>
	);
};

export default HistoryTable;
