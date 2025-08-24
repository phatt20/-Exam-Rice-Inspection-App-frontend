import React, { useEffect, useState } from "react";
import { getHistoryById } from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Table, Button, Spin,  Typography, Row, Col } from "antd";
import dayjs from "dayjs";
import type { InspectionHistory } from "../types";

const {  Text } = Typography;

const Result: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<InspectionHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No ID provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    getHistoryById(id)
      .then((res) => {
        if (!res.data) {
          setError("History not found");
        } else {
          const history = {
            ...res.data,
            inspectionResult: res.data.inspectionResult
              ? JSON.parse(res.data.inspectionResult)
              : { composition: [], defectRice: [] },
            standard: res.data.standardName
              ? { name: res.data.standardName }
              : undefined,
          };
          setData(history);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch history");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <Spin
        tip="Loading..."
        style={{ display: "block", margin: "100px auto" }}
      />
    );
  if (error) return <Text type="danger">{error}</Text>;
  if (!data) return <Text>No data available</Text>;

  const totalSample = data.inspectionResult?.composition
    ?.reduce((acc, c) => acc + (parseFloat(c.actual.replace("%", "")) || 0), 0)
    .toFixed(2);

  const columnsComposition = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Length", dataIndex: "length", key: "length" },
    {
      title: "Actual",
      dataIndex: "actual",
      key: "actual",
      render: (text: string) =>
        `${parseFloat(text.replace("%", "")).toFixed(2)} %`,
    },
  ];

  const columnsDefect = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Actual",
      dataIndex: "actual",
      key: "actual",
      render: (text: string) =>
        `${parseFloat(text.replace("%", "")).toFixed(2)} %`,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
       <Col xs={24} sm={24} md={6}>
  <Card
    cover={
      <img
        alt="Rice Inspection"
        src={data.imageURL || ""}
        style={{
          height: 350,
          objectFit: "cover",
          borderRadius: 8,
        }}
      />
    }
    bordered={false}
    bodyStyle={{ padding: 0 }} 
    actions={[
      <Button key="back" onClick={() => navigate(-1)}>
        Back
      </Button>,
      <Button key="edit" type="primary" onClick={() => navigate(`/edit/${data.id}`)}>
        Edit
      </Button>,
    ]}
  />
</Col>


        <Col xs={24} sm={24} md={18}>
          <Card title="Basic Information" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Text strong>ID:</Text> <Text>{data.id}</Text>
              </Col>
              <Col xs={24} sm={12}>
                <Text strong>Standard:</Text>{" "}
                <Text>{data.standard?.name || "-"}</Text>
              </Col>
              <Col xs={24} sm={12}>
                <Text strong>Price:</Text> <Text>{data.price || "-"}</Text>
              </Col>

              <Col span={12}>
                <Text strong>Create Date:</Text>{" "}
                <Text>
                  {dayjs(data.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                </Text>
              </Col>
              <Col span={12}>
                <Text strong>Update Date:</Text>{" "}
                <Text>
                  {dayjs(data.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
                </Text>
              </Col>
              <Col span={12}>
                <Text strong>Standard:</Text>{" "}
                <Text>{data.standard?.name || "-"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Note:</Text> <Text>{data.note || "-"}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Total Sample:</Text>{" "}
                <Text>{totalSample || "-"}</Text>
              </Col>
            </Row>
          </Card>
          <Card title="Composition" style={{ marginBottom: 16 }}>
            <Table
              columns={columnsComposition}
              dataSource={data.inspectionResult?.composition || []}
              pagination={false}
              rowKey={( index) => (index ?? 0).toString()}
              bordered
              size="small"
            />
          </Card>

          <Card title="Defect Rice">
            <Table
              columns={columnsDefect}
              dataSource={data.inspectionResult?.defectRice || []}
              pagination={false}
              rowKey={( index) => (index ?? 0).toString()}
              bordered
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Result;
