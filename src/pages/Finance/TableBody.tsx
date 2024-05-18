import React, { useState } from "react";
import styled from "styled-components";
import StandardTable from "./StandardTable";
import { EditRecordModal } from "./RecordModal";
import { Tag } from "antd";
import { NumFieldType } from "../../components/Dashboard/TableColumnRender";
import { FinanceStatusList } from "../../api/ailuo/dict";
import _ from "lodash";
import dayjs from "dayjs";
import TurnView from "../Sale/TurnView";

const FlowTableRoot = styled.div`
	width: 100%;
	height: calc(100% - 52px);
	overflow: hidden;
`;

export interface FlowItemTableDataType {
	key: string;
	flowItemId: number;
	statusId: string;
	[propName: string]: any;
}
interface FlowTableProps {
	tableDataSource: any[]; // 数据源

	curPage: React.MutableRefObject<{
		pageNum: number;
		pageSize: number;
		total: number;
	}>;
	editFlowItemRecord: FlowItemTableDataType | undefined;
	setEditFlowItemRecord: (v: FlowItemTableDataType) => void;
	deleteFlowItem: (id: number) => void;
	setSelectedRows: (v: FlowItemTableDataType[]) => void;
}

const columns: any = [
	{
		title: "项目名称",
		width: 200,
		dataIndex: "name",
		key: "name",
		fixed: "left",
		render: (text: string, record: any) => {
			return (
				<div>
					<span>{record.name}</span>
				</div>
			);
		},
	},
	{
		title: "状态",
		dataIndex: "status",
		key: "status",
		render: (text: string, record: any) => {
			const { status } = record;
			let item = _.find(FinanceStatusList, { value: status });
			if (!item) {
				item = FinanceStatusList[0];
			}
			return (
				<Tag color={item.color} style={{ color: "#000" }}>
					{item.label}
				</Tag>
			);
		},
	},
	{
		title: "审批发起人",
		dataIndex: "createBy",
		key: "createBy",
		type: "createBy",
		render: (text: string, record: any) => {
			return (
				<Tag color={"#FFF7F0"} style={{ color: "#000" }}>
					{record.createBy || ""}
				</Tag>
			);
		},
	},
	{
		title: "新建时间",
		width: 200,
		dataIndex: "createTime",
		key: "createTime",
		render: (text: string, record: any) => {
			const format = record.createTime
				? dayjs(record.quotationBegin).format("YYYY-MM-DD")
				: "";
			return <div>{format}</div>;

		}
	},
	{
		title: "选择类型",
		dataIndex: "type",
		key: "type",
		type: NumFieldType.DateTime,
		render: (text: string, record: any) => {
			return <span>{record.type}</span>;
		},
	},

	{
		title: "金额",
		width: 200,
		dataIndex: "money",
		key: "money",
		render: (text: string, record: any) => {
			return <span>{record.money}</span>;
		},
	},
	{
		title: "发票或附件",
		dataIndex: "attachment",
		key: "attachment",
		type: NumFieldType.Attachment,
	},

	{
		title: "其他备注",
		width: 200,
		dataIndex: "remarks",
		key: "remarks",
		render: (text: string, record: any) => {
			return <span>{record.remarks}</span>;
		},
	},
];
const TableBody: React.FC<FlowTableProps> = ({
	editFlowItemRecord,
	...rest
}) => {
	const { tableDataSource } = rest;
	const [dstColumns] = useState<any>(columns);
	const [open, setOpen] = useState<boolean>(false);
	return (
		<FlowTableRoot>
			<StandardTable
				datasource={tableDataSource}
				columns={dstColumns}
				setOpen={setOpen}
				{...rest}
			/>
			<EditRecordModal
				open={open}
				setOpen={setOpen}
				editFlowItemRecord={editFlowItemRecord}
			/>
		</FlowTableRoot>
	);
};

export default TableBody;
