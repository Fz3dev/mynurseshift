import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import { IPole } from "../../interfaces";

export const PoleEdit: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<IPole>();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Nom"
          name="name"
          rules={[{ required: true, message: "Le nom est requis" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Code"
          name="code"
          rules={[{ required: true, message: "Le code est requis" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "La description est requise" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="Statut"
          name="status"
          rules={[{ required: true, message: "Le statut est requis" }]}
        >
          <Select
            options={[
              { label: "Actif", value: "active" },
              { label: "Inactif", value: "inactive" },
            ]}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};
