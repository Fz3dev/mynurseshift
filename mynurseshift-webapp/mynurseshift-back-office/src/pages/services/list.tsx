import {
  List,
  EditButton,
  DeleteButton,
  useTable,
  getDefaultSortOrder,
} from "@refinedev/antd";
import { Table, Space } from "antd";
import { IService } from "../../interfaces";

export const ServiceList: React.FC = () => {
  const { tableProps, sorter } = useTable<IService>({
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
          dataIndex={["pole", "name"]}
          title="Pôle"
        />
        <Table.Column dataIndex="description" title="Description" />
        <Table.Column
          dataIndex="capacity"
          title="Capacité"
          sorter
          defaultSortOrder={getDefaultSortOrder("capacity", sorter)}
        />
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
          render={(_, record: IService) => (
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
