import React, { useContext } from "react";
import { Modal } from "antd";
import CustomModal from "./FormModal/CustomModal";
import { FinanceContext } from "./FinanceManage";

interface AddRecordModalProps {
	open: boolean;
	setOpen: (a: boolean) => void;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = (
	props: AddRecordModalProps,
) => {
	const { open, setOpen } = props;
	const { fetchFinanceList } = useContext(FinanceContext) as any;
	const statusList: any = [];

	const params = {
		title: "新建财务审批",
		open,
		setOpen,
		statusList,
		fetchFinanceList,
		modalType: "add",
	};

	const modalRender = () => CustomModal(params);

	return (
		<Modal
			open={open}
			modalRender={modalRender}
			width={728}
			wrapClassName="overflow-hidden"
			style={{ height: "100vh", overflow: "hidden" }}
		></Modal>
	);
};

interface EditRecordModalProps {
	open: boolean;
	setOpen: (a: boolean) => void;
	editFlowItemRecord: any | undefined;
}

export const EditRecordModal: React.FC<EditRecordModalProps> = (props) => {
	const { editFlowItemRecord, open, setOpen } = props;
	const { fetchFinanceList } = useContext(FinanceContext) as any;

	const statusList: any = [];

	const params = {
		title: "修改财务审批",
		open,
		setOpen,
		statusList,
		fetchFinanceList,
		modalType: "edit",
		editFlowItemRecord,
	};

	const modalRender = () => CustomModal(params);

	return (
		<Modal
			open={open}
			modalRender={modalRender}
			width={728}
			wrapClassName="overflow-hidden"
			style={{ height: "100vh", overflow: "hidden" }}
		></Modal>
	);
};
