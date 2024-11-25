import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Select, message } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import styled from 'styled-components';
import { CREATE_POLE } from '../../graphql/poles';
import { GET_SERVICES } from '../../graphql/services';

const { Option } = Select;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  color: #1f1f1f;
`;

const StyledCard = styled(Card)`
  .ant-card-body {
    padding: 24px;
  }
`;

const StyledForm = styled(Form)`
  max-width: 600px;

  .ant-form-item {
    margin-bottom: 24px;
  }
`;

export const PoleCreate: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { data: servicesData, loading: servicesLoading } = useQuery(GET_SERVICES);
  const [createPole, { loading }] = useMutation(CREATE_POLE, {
    onCompleted: () => {
      message.success('Pôle créé avec succès');
      navigate('/poles');
    },
    onError: (error) => {
      message.error(error.message || 'Erreur lors de la création du pôle');
    },
  });

  const onFinish = async (values: any) => {
    try {
      await createPole({
        variables: {
          input: {
            name: values.name,
            description: values.description,
            serviceIds: values.services,
          },
        },
      });
    } catch (error) {
      // Error is handled by onError callback
    }
  };

  return (
    <div>
      <PageHeader>
        <Title>Créer un pôle</Title>
      </PageHeader>

      <StyledCard>
        <StyledForm
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="Nom"
            rules={[{ required: true, message: 'Le nom est requis' }]}
          >
            <Input placeholder="Nom du pôle" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea
              rows={4}
              placeholder="Description du pôle"
            />
          </Form.Item>

          <Form.Item
            name="services"
            label="Services"
            rules={[{ required: true, message: 'Au moins un service est requis' }]}
          >
            <Select
              mode="multiple"
              placeholder="Sélectionnez les services"
              loading={servicesLoading}
            >
              {servicesData?.services?.map((service: any) => (
                <Option key={service.id} value={service.id}>
                  {service.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Créer
            </Button>
            <Button 
              style={{ marginLeft: 8 }}
              onClick={() => navigate('/poles')}
            >
              Annuler
            </Button>
          </Form.Item>
        </StyledForm>
      </StyledCard>
    </div>
  );
};
