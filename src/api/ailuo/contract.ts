// 表格列

import qs from "qs";
import { apiCall } from "../../network";

interface PageParams {
	pageNum: number;
	pageSize: number;
	status?: string;
	id?: string;
	createBy?: string;
}
export function contractList(params: PageParams) {
	return apiCall({
		url: "api/sys/projectFlowContract/page",
		method: "get",
		params,
	});
}

interface SaveParams {
	[key: string]: any;
}
export function contractAdd(data: SaveParams) {
	return apiCall({
		url: "api/sys/projectFlowContract/save",
		method: "post",
		data,
	});
}

interface EditParams {
	id: number;
	[key: string]: any;
}
export function contractEdit(data: EditParams) {
	return apiCall({
		url: "api/sys/projectFlowContract/edit",
		method: "PUT",
		data,
	});
}

export function contractRemove(id: number) {
	return apiCall({
		url: "api/sys/projectFlowContract/remove",
		method: "DELETE",
		params: { id },
	});
}

export function contractRemoveBatch(ids: number[]) {
	return apiCall({
		url: "api/sys/projectFlowContract/removeBatch",
		method: "DELETE",
		params: { ids },
		paramsSerializer: {
			serialize: ((params: any) => {
				return qs.stringify(params, { arrayFormat: "repeat" });
			}) as any,
		} as any,
	});
}


// 财务列表
export function financialApprovalList(params: PageParams) {
	return apiCall({
		url: "api/sys/financialApproval/page",
		method: "get",
		params,
	});
}
// 财务新增
export function financialApprovalAdd(data: SaveParams) {
	return apiCall({
		url: "api/sys/financialApproval/save",
		method: "post",
		data,
	});
}
// 财务修改
export function financialApprovalEdit(data: EditParams) {
	return apiCall({
		url: "api/sys/financialApproval/edit",
		method: "PUT",
		data,
	});
}
// 财务删除
export function financialApprovalRemove(id: number) {
	return apiCall({
		url: "api/sys/financialApproval/remove",
		method: "DELETE",
		params: { id },
	});
}
// 财务批量删除
export function financialApprovalRemoveBatch(ids: number[]) {
	return apiCall({
		url: "api/sys/financialApproval/removeBatch",
		method: "DELETE",
		params: { ids },
		paramsSerializer: {
			serialize: ((params: any) => {
				return qs.stringify(params, { arrayFormat: "repeat" });
			}) as any,
		} as any,
	});
}
