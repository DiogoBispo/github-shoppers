import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { api } from "../api/http";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type Item = {
  id: string;
  nome: string;
  preco: number;
  qtd_atual: number;
  created_at?: string;
};

export default function Catalog() {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  const { logout } = useAuth();

  async function load() {
    setLoading(true);
    try {
      const data = await api<Item[]>("/itens", { auth: true });
      setItems(data);
    } catch (e: any) {
      message.error(e.message ?? "Falha ao carregar itens.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createItem(values: {
    nome: string;
    preco: number;
    qtd_atual: number;
  }) {
    try {
      await api<Item>("/itens", { method: "POST", body: values, auth: true });
      message.success("Item criado.");
      setOpen(false);
      await load();
    } catch (e: any) {
      message.error(e.message ?? "Falha ao criar item.");
    }
  }

  async function buy(itemId: string) {
    try {
      await api("/compras", {
        method: "POST",
        body: { item_id: Number(itemId) },
        auth: true,
      });
      message.success("Compra realizada.");
      await load();
    } catch (e: any) {
      message.error(e.message ?? "Falha na compra.");
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Catálogo
        </Typography.Title>

        <Space>
          <Button onClick={() => nav("/purchases")}>Ver Compras</Button>
          <Button onClick={() => setOpen(true)} type="primary">
            Novo Item
          </Button>
          <Button
            danger
            onClick={() => {
              logout();
              nav("/login");
            }}
          >
            Sair
          </Button>
        </Space>
      </Space>

      <Card style={{ marginTop: 16 }}>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={items}
          columns={[
            { title: "ID", dataIndex: "id", width: 90 },
            { title: "Nome", dataIndex: "nome" },
            {
              title: "Preço",
              dataIndex: "preco",
              render: (v) => `R$ ${Number(v).toFixed(2)}`,
              width: 160,
            },
            { title: "Estoque", dataIndex: "qtd_atual", width: 120 },
            {
              title: "Ações",
              width: 140,
              render: (_, row) => (
                <Button
                  type="primary"
                  onClick={() => buy(row.id)}
                  disabled={row.qtd_atual <= 0}
                >
                  Comprar
                </Button>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title="Novo Item"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={createItem}>
          <Form.Item name="nome" label="Nome" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="preco" label="Preço" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} min={0.01} step={0.01} />
          </Form.Item>

          <Form.Item
            name="qtd_atual"
            label="Quantidade"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} step={1} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Salvar
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
