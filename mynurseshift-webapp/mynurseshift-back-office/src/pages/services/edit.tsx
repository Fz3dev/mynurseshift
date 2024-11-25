import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, InputNumber } from "antd";
import { IService, IPole } from "../../interfaces";

export const ServiceEdit: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<IService>();

  const { selectProps: poleSelectProps } = useSelect<IPole>({
    resource: "poles",
    optionLabel: "name",
    optionValue: "id",
    defaultValue: formProps?.initialValues?.poleId,
  });

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
          label="Pôle"
          name="poleId"
          rules={[{ required: true, message: "Le pôle est requis" }]}
        >
          <Select {...poleSelectProps} />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "La description est requise" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="Capacité"
          name="capacity"
          rules={[{ required: true, message: "La capacité est requise" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
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
