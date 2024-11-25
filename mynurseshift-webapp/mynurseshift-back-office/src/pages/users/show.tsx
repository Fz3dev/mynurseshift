import { useShow, useOne } from "@refinedev/core";
import { Show, TagField } from "@refinedev/antd";
import { Typography, Descriptions } from "antd";
import { IUser } from "../../interfaces";

const { Title } = Typography;

export const UserShow: React.FC = () => {
  const { queryResult } = useShow<IUser>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Détails de l'utilisateur</Title>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Email">{record?.email}</Descriptions.Item>
        <Descriptions.Item label="Prénom">{record?.firstName}</Descriptions.Item>
        <Descriptions.Item label="Nom">{record?.lastName}</Descriptions.Item>
        <Descriptions.Item label="Téléphone">{record?.phone}</Descriptions.Item>
        <Descriptions.Item label="Rôle">
          <TagField
            value={record?.role}
            color={
              record?.role === "SUPERADMIN"
                ? "red"
                : record?.role === "ADMIN"
                ? "blue"
                : "default"
            }
          />
        </Descriptions.Item>
        <Descriptions.Item label="Statut">
          <TagField
            value={record?.status}
            color={
              record?.status === "ACTIVE"
                ? "green"
                : record?.status === "PENDING"
                ? "orange"
                : "red"
            }
          />
        </Descriptions.Item>
        <Descriptions.Item label="Service">{record?.department}</Descriptions.Item>
        <Descriptions.Item label="Poste">{record?.position}</Descriptions.Item>
        <Descriptions.Item label="Horaires de travail">
          {record?.workingHours && (
            <pre>{JSON.stringify(record.workingHours, null, 2)}</pre>
          )}
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
};
