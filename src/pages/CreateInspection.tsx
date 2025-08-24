import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Checkbox,
  DatePicker,
  Upload,
  message,
} from "antd";
import { getStandards, createHistory } from "../api";
const { TextArea } = Input;
import { useNavigate } from "react-router-dom";

const CreateInspection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [standards, setStandards] = useState<{ id: string; name: string }[]>([]);
  const navigate = useNavigate();

  const inputStyle = { width: "100%" };

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const res = await getStandards();
        setStandards(res.data);
      } catch (err) {
        console.error(err);
        message.error("Failed to load standards");
      }
    };
    fetchStandards();
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        samplingDateTime: values.dateTime
          ? values.dateTime.toISOString()
          : null,
      };
      delete payload.dateTime;

      if (values.rawJson && values.rawJson.fileList.length > 0) {
        const file = values.rawJson.fileList[0].originFileObj;
        const text = await file.text();
        payload.customRawData = JSON.parse(text);
      }
      delete payload.rawJson;

      const res = await createHistory(payload);

      if (res.data?.id) {
        message.success(`Inspection created successfully! ID: ${res.data.id}`);
        navigate(`/result/${res.data.id}`);
      }
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data) {
        const errors = err.response.data;
        if (Array.isArray(errors)) {
          errors.forEach((e: any) => {
            const constraintMsg = e.constraints
              ? Object.values(e.constraints).join(", ")
              : e.message;
            message.error(`${e.property}: ${constraintMsg}`);
          });
        } else if (errors.message) {
          message.error(errors.message);
        } else {
          message.error("Unknown error occurred");
        }
      } else {
        message.error(err.message || "Failed to create inspection");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "white",
          padding: 32,
          borderRadius: 12,
          boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
          width: 480,
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Create Inspection</h2>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter inspection name" }]}
          >
            <Input placeholder="Enter inspection name" style={inputStyle} />
          </Form.Item>

          <Form.Item
            label="Standard"
            name="standardId"
            rules={[{ required: true, message: "Please select a standard" }]}
          >
            <Select placeholder="Select Standard" style={inputStyle}>
              {standards.map((s: any) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Note" name="note">
            <TextArea rows={3} placeholder="Optional note" style={inputStyle} />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Please enter a price" },
              {
                validator: (_, value) => {
                  if (value > 100000) {
                    return Promise.reject(
                      new Error("Price must not be greater than 100000")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="number" placeholder="Enter price" style={inputStyle} />
          </Form.Item>

          <Form.Item label="Sampling Point" name="samplingPoint">
            <Checkbox.Group
              style={{ display: "flex", flexDirection: "column" }}
              options={["Front End", "Back End", "Other"]}
            />
          </Form.Item>

          <Form.Item label="Date/Time" name="dateTime">
            <DatePicker showTime style={inputStyle} />
          </Form.Item>

          <Form.Item label="Upload JSON" name="rawJson">
            <Upload beforeUpload={() => false} style={{ width: "100%" }}>
              <Button style={{ width: "100%" }}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                display: "block",
                margin: "24px auto 0",
                width: 200,
                background: "linear-gradient(90deg, #FFD700, #FFA500)",
                border: "none",
                fontWeight: "bold",
              }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateInspection;
