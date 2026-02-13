import { Button, Card, Form, Input, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/http";

type RegisterResponse = { id: string; email: string };

export default function Register() {
  const nav = useNavigate();

  async function onFinish(values: { email: string; password: string }) {
    try {
      await api<RegisterResponse>("/auth/register", {
        method: "POST",
        body: values,
      });
      message.success("Usuário criado. Faça login.");
      nav("/login");
    } catch (e: any) {
      message.error(e.message ?? "Falha no registro.");
    }
  }

  return (
    <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <Card style={{ width: 420 }}>
        <Typography.Title level={3} style={{ marginTop: 0 }}>
          Registrar
        </Typography.Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true }, { type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true }, { min: 6 }]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Criar conta
          </Button>

          <div style={{ marginTop: 12 }}>
            Já tem conta? <Link to="/login">Login</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
