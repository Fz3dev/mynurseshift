import {
  List,
  EditButton,
  DeleteButton,
  useTable,
  getDefaultSortOrder,
} from "@refinedev/antd";
import { Table, Space } from "antd";
import { IPole } from "../../interfaces";

export const PoleList: React.FC = () => {
  const { tableProps, sorter } = useTable<IPole>({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="id"
          title="ID"
          sorter
          defaultSortOrder={getDefaultSortOrder("id", sorter)}
        />
        <Table.Column
          dataIndex="name"
          title="Nom"
          sorter
          defaultSortOrder={getDefaultSortOrder("name", sorter)}
        />
        <Table.Column
          dataIndex="code"
          title="Code"
          sorter
          defaultSortOrder={getDefaultSortOrder("code", sorter)}
        />
        <Table.Column dataIndex="description" title="Description" />
        <Table.Column
          dataIndex="status"
          title="Statut"
          render={(value) => (
            <span className={value === "active" ? "text-green-600" : "text-red-600"}>
              {value === "active" ? "Actif" : "Inactif"}
            </span>
          )}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: IPole) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
