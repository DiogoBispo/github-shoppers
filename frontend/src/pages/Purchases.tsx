import { Button, Card, Space, Table, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { api } from "../api/http";
import { useNavigate } from "react-router-dom";

type Purchase = {
  id: string;
  comprador_github_login: string;
  created_at: string;
  item: { id: string; nome: string; preco: number };
};

export default function Purchases() {
  const [data, setData] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const res = await api<Purchase[]>("/compras", { auth: true });
      setData(res);
    } catch (e: any) {
      message.error(e.message ?? "Falha ao carregar compras.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Compras
        </Typography.Title>
        <Button onClick={() => nav("/catalog")}>Voltar</Button>
      </Space>

      <Card style={{ marginTop: 16 }}>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={data}
          columns={[
            { title: "ID", dataIndex: "id", width: 90 },
            {
              title: "Comprador (GitHub)",
              dataIndex: "comprador_github_login",
              width: 220,
            },
            { title: "Item", render: (_, r) => r.item.nome },
            {
              title: "Preço",
              render: (_, r) => `R$ ${Number(r.item.preco).toFixed(2)}`,
              width: 160,
            },
            { title: "Criado em", dataIndex: "created_at", width: 260 },
          ]}
        />
      </Card>
    </div>
  );
}
