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
import { historyList } from "../../api/ailuo/notice";

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
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "人员",
      dataIndex: "createBy",
      key: "createBy",
    },
    {
      title: "事件描述",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "事件类型",
      dataIndex: "approveStatus",
      key: "approveStatus",
    },
  ];

  useEffect(() => {
    if (_.get(column, "disabled")) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [column]);

  useEffect(() => {
    const fetchList = async (id: string) => {
      try {
        const res = await historyList(id);
        res.data.forEach((item: any) => {
          item.key = item.id;
        });
        setDataSource(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (form.id) {
      fetchList(form.id);
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
