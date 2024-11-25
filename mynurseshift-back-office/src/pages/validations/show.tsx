import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Space,
  Card,
  Descriptions,
  Button,
  Tag,
  Image,
  Modal,
  Form,
  Select,
  Input,
  Typography,
  Divider,
  notification,
  Spin,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client";
import {
  VALIDATION_DETAILS_QUERY,
  UPDATE_VALIDATION_STATUS_MUTATION,
  UPDATE_DOCUMENT_STATUS_MUTATION,
} from "../../graphql/validations";
import {
  IUserValidation,
  ValidationStatus,
  DocumentStatus,
  IDocument,
} from "../../interfaces";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Title, Text } = Typography;

export const ValidationShowPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [documentForm] = Form.useForm();
  const [selectedDocument, setSelectedDocument] = useState<IDocument | null>(null);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isDocumentModalVisible, setIsDocumentModalVisible] = useState(false);

  const { data, loading, refetch } = useQuery(VALIDATION_DETAILS_QUERY, {
    variables: { id },
    onError: (error) => {
      notification.error({
        message: "Error",
        description: error.message || "Error loading validation details",
      });
    },
  });

  const [updateValidationStatus] = useMutation(UPDATE_VALIDATION_STATUS_MUTATION);
  const [updateDocumentStatus] = useMutation(UPDATE_DOCUMENT_STATUS_MUTATION);

  const handleValidationStatusUpdate = async (values: any) => {
    try {
      await updateValidationStatus({
        variables: {
          id,
          status: values.status,
          comment: values.comment,
        },
      });
      notification.success({
        message: "Success",
        description: "Validation status updated successfully",
      });
      setIsStatusModalVisible(false);
      form.resetFields();
      refetch();
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "Error updating validation status",
      });
    }
  };

  const handleDocumentStatusUpdate = async (values: any) => {
    if (!selectedDocument) return;
    
    try {
      await updateDocumentStatus({
        variables: {
          id: selectedDocument.id,
          status: values.status,
          comment: values.comment,
        },
      });
      notification.success({
        message: "Success",
        description: "Document status updated successfully",
      });
      setIsDocumentModalVisible(false);
      documentForm.resetFields();
      setSelectedDocument(null);
      refetch();
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "Error updating document status",
      });
    }
  };

  const showDocumentUpdateModal = (document: IDocument) => {
    setSelectedDocument(document);
    documentForm.setFieldsValue({
      status: document.status,
      comment: document.comment,
    });
    setIsDocumentModalVisible(true);
  };

  const getStatusIcon = (status: ValidationStatus) => {
    switch (status) {
      case ValidationStatus.APPROVED:
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case ValidationStatus.REJECTED:
        return <CloseCircleOutlined style={{ color: "#f5222d" }} />;
      default:
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
    }
  };

  const getDocumentStatusTag = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.APPROVED:
        return <Tag color="success">Approved</Tag>;
      case DocumentStatus.REJECTED:
        return <Tag color="error">Rejected</Tag>;
      default:
        return <Tag color="warning">Pending</Tag>;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  const validation = data?.validation as IUserValidation;

  if (!validation) {
    return (
      <Card>
        <Title level={4}>Validation not found</Title>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/validations")}>
          Back to List
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/validations")}>
            Back to List
          </Button>
          <Title level={3} style={{ margin: 0 }}>Validation Details</Title>
        </Space>
        <Button type="primary" onClick={() => setIsStatusModalVisible(true)}>
          Update Status
        </Button>
      </div>

      <Card title="User Information">
        <Descriptions>
          <Descriptions.Item label="Name">{`${validation.user?.firstName} ${validation.user?.lastName}`}</Descriptions.Item>
          <Descriptions.Item label="Email">{validation.user?.email}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag icon={getStatusIcon(validation.status)}>
              {validation.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Submitted">{dayjs(validation.createdAt).format("YYYY-MM-DD HH:mm:ss")}</Descriptions.Item>
          {validation.adminNotes && (
            <Descriptions.Item label="Admin Notes" span={3}>
              {validation.adminNotes}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Divider />

      <Card title="Documents">
        <Space direction="vertical" style={{ width: "100%" }}>
          {validation.documents.map((document) => (
            <Card key={document.id} size="small">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Space style={{ justifyContent: "space-between", width: "100%" }}>
                  <Space>
                    <Text strong>{document.type}</Text>
                    {getDocumentStatusTag(document.status)}
                  </Space>
                  <Button type="link" onClick={() => showDocumentUpdateModal(document)}>
                    Update Status
                  </Button>
                </Space>
                {document.url && (
                  <Image
                    src={document.url}
                    alt={document.type}
                    style={{ maxWidth: "100%", maxHeight: 300 }}
                  />
                )}
                {document.comment && (
                  <Text type="secondary">Comment: {document.comment}</Text>
                )}
              </Space>
            </Card>
          ))}
        </Space>
      </Card>

      <Modal
        title="Update Validation Status"
        open={isStatusModalVisible}
        onCancel={() => setIsStatusModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleValidationStatusUpdate}
          layout="vertical"
          initialValues={{
            status: validation.status,
            comment: validation.adminNotes,
          }}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select>
              <Select.Option value={ValidationStatus.PENDING}>Pending</Select.Option>
              <Select.Option value={ValidationStatus.APPROVED}>Approved</Select.Option>
              <Select.Option value={ValidationStatus.REJECTED}>Rejected</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="comment" label="Comment">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button onClick={() => setIsStatusModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Update Document Status"
        open={isDocumentModalVisible}
        onCancel={() => {
          setIsDocumentModalVisible(false);
          setSelectedDocument(null);
        }}
        footer={null}
      >
        <Form
          form={documentForm}
          onFinish={handleDocumentStatusUpdate}
          layout="vertical"
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select>
              <Select.Option value={DocumentStatus.PENDING}>Pending</Select.Option>
              <Select.Option value={DocumentStatus.APPROVED}>Approved</Select.Option>
              <Select.Option value={DocumentStatus.REJECTED}>Rejected</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="comment" label="Comment">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button onClick={() => {
                setIsDocumentModalVisible(false);
                setSelectedDocument(null);
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
