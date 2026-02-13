import { Button, Card, Form, Input, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/http";
import { useAuth } from "../auth/AuthContext";

type LoginResponse = { token: string };

export default function Login() {
  const nav = useNavigate();
  const auth = useAuth();

  async function onFinish(values: { email: string; password: string }) {
    try {
      const res = await api<LoginResponse>("/auth/login", {
        method: "POST",
        body: values,
      });
      auth.login(res.token);
      message.success("Login realizado.");
      nav("/catalog");
    } catch (e: any) {
      message.error(e.message ?? "Falha no login.");
    }
  }

  return (
    <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <Card style={{ width: 420 }}>
        <Typography.Title level={3} style={{ marginTop: 0 }}>
          Login
        </Typography.Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true }, { type: "email" }]}
          >
            <Input placeholder="admin@test.com" />
          </Form.Item>

          <Form.Item label="Senha" name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="123456" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Entrar
          </Button>

          <div style={{ marginTop: 12 }}>
            Não tem conta? <Link to="/register">Registrar</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
