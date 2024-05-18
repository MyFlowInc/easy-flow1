import React from "react";
import { Space } from "antd";
import Search from "./Search";
import Sort from "./Sort"; // 排序

interface HeaderToolBarProps {
	children?: React.ReactNode;
}

const HeaderToolBar: React.FC<HeaderToolBarProps> = () => {
	const dstColumns = [
		{ label: "项目名称", key: "name", value: "name" },
		{ label: "状态", key: "type", value: "type" },
		{ label: "审批发起人", key: "createBy", value: "createBy" },
		{ label: "新建时间", key: "createTime", value: "createTime", },
		{ label: "选择类型", key: "status", value: "status", },
		{ label: "金额", key: "money", value: "money", },
		{ label: "发票或附件", key: "attachment", value: "attachment", },
		{ label: "其他备注", key: "remarks", value: "remarks", },
	];
	const records = [] as any;
	return (
		<Space>
			<Search columns={dstColumns} />
			<Sort columns={dstColumns} />
		</Space>
	);
};

export default HeaderToolBar;
