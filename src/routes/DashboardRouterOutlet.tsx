import { Route, Switch } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
	fetchFlowStatus,
	selectAllUser,
	selectCollapsed,
	selectIsOpenDrawer,
	selectUser,
	setAllUser,
	setIsOpenDrawer,
} from "../store/globalSlice";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import Loading from "../assets/icons/Loading";
import { LoadingRoot, RouterContainer } from "./style";
import { Layout, theme, Spin, Modal } from "antd";
import AppHeader from "../components/layout/AppHeader";
import Setting from "../pages/Setting";
import styled from 'styled-components';
import NavSide from "../components/NavSide";
import NotifyDrawer from "../pages/Notify/NotifyDrawer";
import { useLoginByCache } from "../hooks";
import MyQuoteProcess from "../pages/Sale/MyQuoteProcess";
import CustomModalView from "../pages/Sale/FormModal/CustomModalView";
import { accountList } from "../api/user";
import ContractManage from "../pages/Contract/ContractManage";
import MyContractManage from "../pages/Contract/MyContractManage";
import MyContractProcess from "../pages/Contract/MyContractProcess";
import CustomContractModalView from "../pages/Contract/FormModal/CustomContractModalView";

const { Sider, Content } = Layout;
export const DashboardRouterOutletContext = React.createContext<any>({});

const DashboardRouterOutlet: React.FC = () => {
	// 通过缓存自动登录
	useLoginByCache();
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const allUser = useAppSelector(selectAllUser);

	const isEmpty = _.isEmpty(user);
	const [loading, setLoading] = useState(isEmpty);
	const {
		token: { colorBgContainer },
	} = theme.useToken();
	const collapsed = useAppSelector(selectCollapsed);
	//  通知抽屉
	const isOpenDrawer = useAppSelector(selectIsOpenDrawer);

	// 全局报价单详情显示
	const [isSaleModalViewOpen, setIsSaleModalViewOpen] = useState(false);
	const [saleId, setSaleId] = useState(undefined); // 当前展示的

	// 全局合同单详情显示
	const [isContractModalViewOpen, setIsContractModalViewOpen] = useState(false);
	const [contractId, setContractId] = useState(undefined); // 当前展示的

	// 全局技术评审详情
	const [isTechModalViewOpen, setIsTechModalViewOpen] = useState(false);
	const [techId, setTechId] = useState(undefined);

	// 全局预览文件
	const [isPdfModalViewOpen, setIsPdfModalViewOpen] = useState(false);
	const [fileUrl, setFileUrl] = useState("");
	const onDrawerClose = () => {
		dispatch(setIsOpenDrawer(false));
	};

	useEffect(() => {
		dispatch(fetchFlowStatus()).then(() => setLoading(false));
	}, []);

	// TODO危险操作
	useEffect(() => {
		const fetchAllUser = async () => {
			const res = await accountList();
			let allUserList = _.get(res, "data.record", []);
			dispatch(setAllUser(allUserList));
		};
		if (_.isEmpty(allUser)) {
			fetchAllUser();
		}
	}, [allUser]);

	if (loading) {
		return (
			<LoadingRoot>
				<div>
					<Spin indicator={<Loading style={{ fontSize: 96 }} />} />
					<div className="loading-title">Loading...</div>
				</div>
			</LoadingRoot>
		);
	}
	// 报价单modal
	const renderSaleViewModal = () => {
		if (!saleId) {
			return null;
		}
		return (
			<Modal
				key={"renderSaleViewModal"}
				open={isSaleModalViewOpen}
				onCancel={() => setSaleId(undefined)}
				modalRender={() => (
					<CustomModalView
						{...{
							title: "查看报价",
							open: isSaleModalViewOpen,
							setOpen: setIsSaleModalViewOpen,
							setSaleId,
						}}
					/>
				)}
				width={560}
				wrapClassName="overflow-hidden"
				style={{ height: "100vh", overflow: "hidden" }}
			></Modal>
		);
	};
	const renderContractViewModal = () => {
		if (!contractId) {
			return null;
		}
		return (
			<Modal
				key={"renderContractViewModal"}
				open={isContractModalViewOpen}
				onCancel={() => setContractId(undefined)}
				modalRender={() => (
					<CustomContractModalView
						{...{
							title: "查看合同",
							open: isContractModalViewOpen,
							setOpen: setIsContractModalViewOpen,
							modalType: "edit",
						}}
					/>
				)}
				width={560}
				wrapClassName="overflow-hidden"
				style={{ height: "100vh", overflow: "hidden" }}
			></Modal>
		);
	};
 
	const renderPdfViewModal = () => {
		if (!fileUrl) {
			return;
		}
		console.log(fileUrl);
		return (
			<Modal
				title="预览"
				open={isPdfModalViewOpen}
				style={{ top: 0, padding: 0 }}
				styles={{
					body: { height: "calc(100vh - 108px)", overflow: "hidden" },
				}}
				width="100%"
				footer={null}
				onCancel={() => {
					setFileUrl("");
					setIsPdfModalViewOpen(false);
				}}
			>
				<div className="w-full h-full">
					<iframe
						style={{ width: "100%", height: "100%" }}
						src={`/preview?url=${fileUrl}`}
					></iframe>
				</div>
			</Modal>
		);
	};
	return (
		<DashboardRouterOutletContext.Provider
			value={{
				saleId,
				setSaleId,
				isSaleModalViewOpen,
				setIsSaleModalViewOpen,
				contractId,
				setContractId,
				isContractModalViewOpen,
				setIsContractModalViewOpen,
				isTechModalViewOpen,
				setIsTechModalViewOpen,
				techId,
				setTechId,
				setFileUrl,
				setIsPdfModalViewOpen,
			}}
		>
			
			<RouterContainer className="router-container">
				<Layout>
					<Sider
						theme="light"
						className={collapsed ? "sider-collapsed" : "sider-uncollapsed"}
						width={212}
						trigger={null}
						collapsedWidth={48}
						collapsible
						collapsed={collapsed}
					>
						<NavSide />
					</Sider>
					<Layout className="site-layout">
						<AppHeader />
						<Content
							style={{
								minHeight: 280,
								display: "flex",
								background: colorBgContainer,
								flex: 1,
								padding: "0px 16px",
							}}
						>
							<div className="router-content">
								<Switch>
									{/* 合同管理 财务审批*/}
									<Route path="/dashboard/pm/financial-approval" exact={true}>
										<ContractManage />
									</Route>
									{/* 我的代办 */}
									<Route path="/dashboard/my-agent-page" exact={true}>
										<MyContractManage />
									</Route>
									
								</Switch>
							</div>
						</Content>
						<NotifyDrawer
							onDrawerClose={onDrawerClose}
							isOpenDrawer={isOpenDrawer}
						/>
					</Layout>
					{/* 显示工单-复用 */}
					{renderContractViewModal()}
					{renderPdfViewModal()}
				</Layout>
			</RouterContainer>
		</DashboardRouterOutletContext.Provider>
	);
};

export default DashboardRouterOutlet;
