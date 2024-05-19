import React, { useState, useEffect, FC, useContext } from "react";
import styled from "styled-components";
import {
  ConfigProvider,
  Form,
  Button,
  Tag,
  Popover,
  Input,
  Popconfirm,
  Avatar,
  Badge,
} from "antd";
import {
  blueButtonTheme,
  greyButtonTheme,
  redButtonTheme,
} from "../../../theme/theme";
import { NumFieldType } from "../../../components/Dashboard/TableColumnRender";

import { FinanceStatusMap } from "../../../api/ailuo/dict";
import warnSvg from "../../Sale/assets/warning.svg";
import {
  approveInfo,
  finalApproveEdit,
  finalInfoPage,
  flowApproveInfo,
} from "../../../api/ailuo/approve";
import _ from "lodash";
import { noticeAdd } from "../../../api/ailuo/notice";
import {
  User,
  selectAllUser,
  selectIsFinance,
  selectIsManager,
  selectUser,
  setCurSaleForm,
} from "../../../store/globalSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import ModeSelectTable from "../../Sale/ModeSelectTable";
import { FinanceContext } from "../FinanceManage";
import {
  financialApprovalAdd,
  financialApprovalEdit,
} from "../../../api/ailuo/contract";
import CellEditorContext from "../../Sale/FormModal/CellEditorContext";
import { NoFieldData } from "../../Sale/FormModal/NoFieldData";
import ExportProject from "../../Sale/ExportProject";
import dayjs from "dayjs";
import HistoryTable from "../HistoryTable";
const { TextArea } = Input;
const CustomModalRoot = styled.div`
  position: relative;
  padding: 24px 36px 24px 36px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow:
    0 6px 16px 0 rgb(0 0 0 / 8%),
    0 3px 6px -4px rgb(0 0 0 / 12%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
  pointer-events: auto;
  max-height: 80%;
  height: 100%;
  overflow: hidden;
  .header {
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 18px;
      font-family: "Harmony_Sans_Medium", sans-serif;
    }
  }
  .status-operate {
    margin-top: 8px;
    margin-bottom: 16px;
  }
  .content {
    height: calc(100% - 80px);
    max-width: 600px;
    overflow: overlay;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 24px;
  }
`;

interface CustomModalProps {
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  modalType: string;
  editFlowItemRecord?: any | undefined;
}
const excludeNull = (obj: any) => {
  const result: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || obj[key] === null) {
      return;
    }
    result[key] = obj[key];
  });
  return result;
};
export const columns: any = [
  {
    title: "项目名称",
    dataIndex: "name",
    key: "name",
    type: NumFieldType.SingleText,
  },
  {
    title: "审批发起人",
    dataIndex: "createBy",
    key: "createBy",
    render: (
      column: any,
      key: string,
      form: any,
      setForm: (value: any) => void
    ) => {
      const user = useAppSelector(selectUser) as any;
      return (
        <div key={"person_" + key} className="w-full">
          <div className="flex mb-4">
            <div style={{ width: "100px" }}>审批发起人</div>
            <div className="flex-1 flex items-center">
              {_.get(user, "nickname")}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    title: "新建时间",
    dataIndex: "createTime",
    render: (
      column: any,
      key: string,
      form: any,
      setForm: (value: any) => void
    ) => {
      const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
      return (
        <div key={"time_" + key} className="w-full">
          <div className="flex mb-4">
            <div style={{ width: "100px" }}>新建时间</div>
            <div className="flex-1 flex items-center">{time}</div>
          </div>
        </div>
      );
    },
  },
  {
    title: "选择类型",
    dataIndex: "type",
    key: "type",
    type: NumFieldType.SingleFixSelect,
    dictCode: "finance",
  },
  {
    title: "金额",
    dataIndex: "money",
    key: "money",
    type: NumFieldType.Number,
  },
  {
    title: "发票或附件",
    dataIndex: "attachment",
    key: "attachment",
    type: NumFieldType.Attachment,
  },
  {
    title: "其他备注",
    dataIndex: "remarks",
    key: "remarks",
    type: NumFieldType.Text,
  },

  {
    title: "操作历史",
    dataIndex: "history",
    key: "history",
    render: (
      column: any,
      key: string,
      form: any,
      setForm: (value: any) => void
    ) => {
      return (
        <div key={"History" + key} className="w-full">
          <HistoryTable
            key={"HistoryTable" + key}
            {...{ column, form, setForm }}
          />
        </div>
      );
    },
  },
];
const ApproveConfirm: (p: any) => any = ({ approveModal, setApproveModal }) => {
  const { user, setOpen } = useContext(CustomModalContext)! as any;
  const { fetchFinanceList } = useContext(FinanceContext)! as any;
  const clickHandle = async () => {
    setApproveModal(false);

    try {
      await fetchFinanceList();
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
    }
  };
  return (
    <div className="flex flex-col items-center" style={{ width: "300px" }}>
      <div className="flex mb-4 mt-4">
        <img src={warnSvg} />
        <div>审批通过后，本项目将进入下一阶段</div>;
      </div>
      <div className="flex mb-4">
        <ConfigProvider theme={greyButtonTheme}>
          <Button
            style={{ width: "80px" }}
            type="primary"
            className="mr-8"
            onClick={() => {
              setApproveModal(false);
            }}
          >
            取消
          </Button>
        </ConfigProvider>
        <ConfigProvider theme={blueButtonTheme}>
          <Button
            style={{ width: "80px" }}
            type="primary"
            onClick={() => {
              clickHandle();
            }}
          >
            通过
          </Button>
        </ConfigProvider>
      </div>
    </div>
  );
};
const RejectConfirm: (p: any) => any = ({ rejectModal, setRejectModal }) => {
  const { user, setOpen } = useContext(CustomModalContext)! as any;
  const { fetchFinanceList } = useContext(FinanceContext)! as any;

  const [rejectReason, setRejectReason] = useState("");
  const rejectHandle = async () => {
    setRejectModal(false);

    try {
      await fetchFinanceList();
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
    }
  };
  return (
    <div className="flex flex-col" style={{ width: "300px" }}>
      <div
        className="mb-4 mt-4"
        style={{
          fontFamily: "HarmonyOS Sans",
          fontSize: "14px",
        }}
      >
        填写驳回理由
      </div>
      <div>
        <TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </div>
      <div className="flex justify-center mb-4 mt-4">
        <ConfigProvider theme={greyButtonTheme}>
          <Button
            style={{ width: "80px" }}
            type="primary"
            className="mr-8"
            onClick={() => {
              setRejectModal(false);
            }}
          >
            取消
          </Button>
        </ConfigProvider>
        <ConfigProvider theme={redButtonTheme}>
          <Button
            style={{ width: "80px" }}
            type="primary"
            onClick={() => {
              rejectHandle();
            }}
          >
            驳回
          </Button>
        </ConfigProvider>
      </div>
    </div>
  );
};
const FootView = (props: any) => {
  const { user, form, hasAccess, accessList } = useContext(
    CustomModalContext
  )! as any;
  const { id: projectId } = form;

  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  // 判断是否是 审核中
  useEffect(() => {
    if (!_.isEmpty(accessList)) {
      const item = _.find(accessList, { relationUserId: user.id });
      if (!item) {
        return;
      }
      if (item.status !== "product_start") {
        // 是否是审核中判断
        setIsReviewing(true);
      }
    }
  }, [form, accessList]);

  if (_.get(form, "status") !== FinanceStatusMap.FinancialReview) {
    return null;
  }

  if (!hasAccess) {
    return null;
  }

  if (isReviewing) {
    return (
      <ConfigProvider theme={redButtonTheme}>
        <Button type="primary">审核中...</Button>
      </ConfigProvider>
    );
  }
  return (
    <div className="w-full flex justify-center">
      <ConfigProvider theme={redButtonTheme}>
        <Popover
          open={rejectModal}
          onOpenChange={(newOpen: boolean) => {
            setRejectModal(newOpen);
          }}
          content={() => {
            return RejectConfirm({ rejectModal, setRejectModal });
          }}
          trigger="click"
        >
          <Button
            style={{ width: "80px" }}
            type="primary"
            className="mr-8"
            onClick={() => {
              setRejectModal(true);
            }}
          >
            驳回
          </Button>
        </Popover>
      </ConfigProvider>
      <ConfigProvider theme={blueButtonTheme}>
        <Popover
          open={approveModal}
          onOpenChange={(newOpen: boolean) => {
            setApproveModal(newOpen);
          }}
          content={() => {
            return ApproveConfirm({ approveModal, setApproveModal });
          }}
          trigger="click"
        >
          <Button
            style={{ width: "80px" }}
            type="primary"
            onClick={() => {
              setApproveModal(true);
            }}
          >
            通过
          </Button>
        </Popover>
      </ConfigProvider>
    </div>
  );
};

const CustomModalContext = React.createContext({});

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  modalType,
  open,
  setOpen,
  editFlowItemRecord,
}) => {
  const [showDstColumns, setShowDstColumns] = useState(columns);
  const [inputForm] = Form.useForm();
  const [form, setForm] = useState<any>({});
  const allUser = useAppSelector(selectAllUser);
  const user = useAppSelector(selectUser);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const { fetchFinanceList, setIsShowApproveModal } =
    useContext(FinanceContext);

  const setAllDisabled = (disabled: boolean) => {
    const newCol = showDstColumns.map((item: any) => {
      return {
        ...item,
        disabled,
      };
    });
    setShowDstColumns(newCol);
    setSaveButtonDisabled(disabled);
  };

  // 初始化form数据
  useEffect(() => {
    if (!open) {
      setForm({});
      return;
    }
    if (modalType === "edit" && editFlowItemRecord) {
      const { key, ...temp } = editFlowItemRecord;

      setForm(temp);
      inputForm.setFieldsValue(temp);
    }
    if (modalType === "add") {
      setForm((v: any) => {
        return {
          ...v,
        };
      });
    }
  }, [open]);

  // 控制 只读和编辑
  useEffect(() => {
    if (_.isEmpty(showDstColumns)) {
      return;
    }
    if (open && form.status === FinanceStatusMap.NotStart) {
      // 未启动
      setAllDisabled(true);
    } else if (open && form.status === FinanceStatusMap.FinancialReview) {
      // 审批中
      setAllDisabled(true);
    } else if (open && form.status === FinanceStatusMap.Appropriation) {
      // 通过
      setAllDisabled(true);
    } else if (open && form.status === FinanceStatusMap.NotStart) {
      // 驳回
      setAllDisabled(true);
    } else {
      if (_.get(showDstColumns, "[0].disabled") !== false) {
        setAllDisabled(false);
      }
    }
  }, [form.status, open]);

  // 查看当前审批
  const [accessList, setAccessList] = useState<any[]>([]);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const getAclList = async (projectId: string) => {
      try {
        let params: any = {
          pageNum: 1,
          pageSize: 99,
          projectSaleId: projectId,
          audittype: "financial_reciew",
        };
        const res = await flowApproveInfo(params);
        setAccessList(_.get(res, "data.record") || []);
      } catch (error) {
        console.log(error);
      }
    };
    if (open && [FinanceStatusMap.FinancialReview].includes(form.status)) {
      getAclList(form.id);
    }
  }, [form.id, open]);

  useEffect(() => {
    if (_.isEmpty(showDstColumns)) {
      return;
    }
    if (_.isEmpty(accessList)) {
      setAllDisabled(true);
    }

    const item = _.find(accessList, { relationUserId: user.id });
    if (!item) {
      setAllDisabled(true);
    } else {
      setAllDisabled(false);
      setHasAccess(true);
    }
  }, [accessList]);

  // 新增记录
  const createRecord = async () => {
    inputForm.setFieldsValue(form);
    try {
      await inputForm.validateFields();
      const params = { ...form };
      delete params.createTime;
      delete params.createBy;
      await financialApprovalAdd(excludeNull(params));
      await fetchFinanceList();
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  // 更新记录
  const updateRecord = async () => {
    const { recordId, id, ...rest } = form;
    inputForm.setFieldsValue(rest);
    const params = {
      id,
      ...rest,
    };
    try {
      await inputForm.validateFields();
      try {
        params.typeSelection = JSON.stringify(params.typeSelection);
        params.modeTrade = JSON.stringify(params.modeTrade);
        params.payType = JSON.stringify(params.payType);
        delete params.updateTime;
        delete params.createTime;
      } catch (error) {}
      await financialApprovalEdit(excludeNull(params));
      await fetchFinanceList();
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveRecord = () => {
    inputForm.setFieldsValue(form);
    if (modalType === "add") {
      createRecord();
    } else {
      updateRecord();
    }
  };
  // 通知模块
  const notifyHandler = async (
    form: any,
    status: FinanceStatusMap[keyof FinanceStatusMap]
  ) => {
    try {
      // 通知 终审人员
      if (status === FinanceStatusMap.FinancialReview) {
        const res = await approveInfo({ belong: "contract" }); // 审批信息
        let list = _.get(res, "data.record", []);
        const allP = list.map((item: any) => {
          const params: any = {
            recipientId: item.relationUserId,
            content: {
              status: status,
              msg: `您的合同: <${form.name}> 需要审批`,
              contractId: form.id,
            },
          };
          params.content = JSON.stringify(params.content);
          return noticeAdd(params);
        });
        await Promise.all(allP);
      }
      // 同意后 通知报价单创建人
      if (status === FinanceStatusMap.Appropriation) {
        const { createBy } = form; // 创建人id
        if (!createBy) return;
        const params: any = {
          recipientId: createBy,
          content: {
            status: status,
            msg: `您的工单: <${form.name}> 审批通过`,
            saleId: form.id,
          },
        };
        params.content = JSON.stringify(params.content);
        await noticeAdd(params);
      }
      // 审批拒绝 通知报价单创建人
      if (status === FinanceStatusMap.NotStart) {
        const { createBy } = form; // 创建人id
        if (!createBy) return;
        const params: any = {
          recipientId: createBy,
          content: {
            status: status,
            msg: `您的工单: <${form.name}> 已被驳回
							    驳回理由: ${form.remark}`,
            saleId: form.id,
          },
        };
        params.content = JSON.stringify(params.content);
        await noticeAdd(params);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 修改审批状态
  const changeProcess = async (
    form: any,
    status: FinanceStatusMap[keyof FinanceStatusMap]
  ) => {
    try {
      const { id } = form;
      switch (status) {
        case FinanceStatusMap.Start:
          await financialApprovalEdit({ id, status } as any);
          await fetchFinanceList();
          setOpen(false);
          break;
        case FinanceStatusMap.FinancialReview:
          setIsShowApproveModal(true);
          setOpen(false);
          break;
        case FinanceStatusMap.Appropriation:
          break;
        case FinanceStatusMap.NotStart:
          break;
        default:
          break;
      }

      // hack
      // form.status = status;
      // await handleSaveRecord();
      // await fetchFinanceList();
      if (status === FinanceStatusMap.Appropriation) {
        window.dispatchEvent(new Event("fersh-total-info"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const StatusView = () => {
    if (!form) {
      return;
    }
    const { id, status } = form;

    // 未启动 开始处理
    if (id && (status === FinanceStatusMap.NotStart || !status)) {
      return (
        <div className="status-operate flex">
          <div className="flex">
            <div className="mr-2">状态: </div>
            <Tag color={"#E8F2FF"} style={{ color: "#000" }}>
              {"未启动"}
            </Tag>
          </div>
          <div className="flex cursor-pointer">
            <div className="mr-2">操作: </div>
            <Tag
              color={"#D4F3F2"}
              style={{ color: "#000" }}
              onClick={() => {
                changeProcess(form, FinanceStatusMap.Start);
              }}
            >
              {"开始发起"}
            </Tag>
          </div>
        </div>
      );
    }

    // 处理中 --》 发起审批
    if (id && status === FinanceStatusMap.Start) {
      return (
        <div className="status-operate flex">
          <div className="flex">
            <div className="mr-2">状态: </div>
            <Tag color={"#E8F2FF"} style={{ color: "#000" }}>
              {"发起中"}
            </Tag>
          </div>
          <div className="flex cursor-pointer">
            <div className="mr-2">操作: </div>
            <Tag
              color={"#D4F3F2"}
              style={{ color: "#000" }}
              onClick={() => {
                changeProcess(form, FinanceStatusMap.FinancialReview);
              }}
            >
              {"发起审批"}
            </Tag>
          </div>
        </div>
      );
    }

    // 财务审核中
    if (id && status === FinanceStatusMap.FinancialReview) {
      // 特殊处理报价终审中
      return (
        <div className="status-operate flex items-center">
          <div className="flex">
            <div className="mr-2">状态: </div>
            <Tag
              color={"#FFEEE3"}
              style={{ color: "#000", height: "fit-content" }}
            >
              {"财务审核中"}
            </Tag>
          </div>
        </div>
      );
    }
    // 审批通过
    if (id && status === FinanceStatusMap.Appropriation) {
      return (
        <>
          <div className="status-operate flex">
            <div className="flex">
              <div className="mr-2">状态: </div>
              <Tag color={"#E8FFEA"} style={{ color: "#000" }}>
                {"审批通过"}
              </Tag>
            </div>
            <div className="flex cursor-pointer">
              <div className="mr-2">操作: </div>

              <Popconfirm
                title="确认撤回重改?"
                onConfirm={() => {
                  changeProcess(form, FinanceStatusMap.FinancialReview);
                }}
                okText="确认"
                cancelText="取消"
              >
                <Tag
                  className="ml-2"
                  color={"#D4F3F2"}
                  style={{ color: "#000" }}
                  onClick={() => {}}
                >
                  {"撤回重改"}
                </Tag>
              </Popconfirm>
            </div>
          </div>
          <div className="flex cursor-pointer mb-4"></div>
        </>
      );
    }
    // 审批驳回
    if (
      id &&
      [FinanceStatusMap.NotStart, FinanceStatusMap.Appropriation].includes(
        status
      )
    ) {
      return (
        <div className="status-operate flex">
          <div className="flex">
            <div className="mr-2">状态: </div>
            <Tag color={"#FF9F9F"} style={{ color: "#000" }}>
              {"审批驳回"}
            </Tag>
          </div>
          <div className="flex cursor-pointer">
            <div className="mr-2">操作: </div>
            <Popconfirm
              title="撤回重改?"
              onConfirm={() => {
                // newSaleHandle(form, "need");
                // TODO 有bug
                changeProcess(form, FinanceStatusMap.FinancialReview);
              }}
              okText="确认"
              cancelText="取消"
            >
              <Tag color={"#D4F3F2"} style={{ color: "#000" }}>
                {"撤回重改"}
              </Tag>
            </Popconfirm>
          </div>
        </div>
      );
    }
    // 未启动
    return (
      <div className="status-operate flex">
        <div className="flex">
          <div className="mr-2">状态: </div>
          <Tag color={"#E8F2FF"} style={{ color: "#000" }}>
            {"未启动"}
          </Tag>
        </div>
        {/* <div className="hidden">
					<div className="mr-2">操作: </div>
					<Tag color={"#D4F3F2"} style={{ color: "#000" }}>
						{"开始处理"}
					</Tag>
				</div> */}
      </div>
    );
  };
  const SaveButton = () => {
    if (modalType === "add") {
      return (
        <ConfigProvider theme={blueButtonTheme}>
          <Button type="primary" onClick={handleSaveRecord}>
            创建
          </Button>
        </ConfigProvider>
      );
    }
    if (saveButtonDisabled) {
      return null;
    }
    return (
      <ConfigProvider theme={blueButtonTheme}>
        <Button type="primary" onClick={handleSaveRecord}>
          {"保存"}
        </Button>
      </ConfigProvider>
    );
  };

  return (
    <CustomModalRoot>
      <div className="header">
        <div className="title">{title}</div>
        <div>
          <Button
            style={{
              fontSize: "12px",
              background: "#F2F3F5",
              marginRight: "18px",
            }}
            onClick={() => setOpen(false)}
          >
            取消
          </Button>
          {SaveButton()}
        </div>
      </div>
      {StatusView()}
      <div className="content">
        <Form
          form={inputForm}
          name="recordForm"
          key={modalType}
          colon={false}
          wrapperCol={{ flex: 1 }}
          preserve={false}
        >
          {showDstColumns.length > 0 ? (
            <CellEditorContext
              form={form}
              setForm={setForm}
              dstColumns={showDstColumns}
              modalType={modalType}
            />
          ) : (
            <NoFieldData />
          )}
        </Form>
      </div>
      <div className="footer">
        <CustomModalContext.Provider
          value={{
            user,
            form,
            setForm,
            setOpen,
            changeProcess,
            accessList,
            hasAccess,
          }}
        >
          <FootView />
        </CustomModalContext.Provider>
      </div>
    </CustomModalRoot>
  );
};

export default CustomModal;
