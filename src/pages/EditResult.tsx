import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHistoryById, updateHistory } from '../api';
import type { InspectionHistory } from '../types';
import { Form, Input, Button, DatePicker, message, Checkbox } from 'antd';
import dayjs from 'dayjs';

const EditResult: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<InspectionHistory | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getHistoryById(id)
        .then(res => {
          const history = res.data;
          setData({
            ...history,
            dateTime: history.samplingDateTime ? dayjs(history.samplingDateTime) : null,
          });
        })
        .catch(_err => message.error('Failed to fetch history'));
    }
  }, [id]);

  const handleChange = (changedValues: any) => {
    setData(prev => ({ ...prev, ...changedValues }));
  };

const handleSubmit = async () => {
  if (!id || !data) return;
  setLoading(true);
  try {
    const payload = {
      note: data.note,
      price: data.price ? Number(data.price) : undefined,
      samplingPoint: data.samplingPoint?.filter(Boolean),
      samplingDateTime: data.dateTime && dayjs.isDayjs(data.dateTime) ? data.dateTime.toISOString() : undefined,
    };

    await updateHistory(id, payload);
    message.success('Updated successfully');
    navigate(`/result/${id}`);
  } catch (err) {
    console.error(err);
    message.error('Failed to update history');
  } finally {
    setLoading(false);
  }
};

  if (!data) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <h2>Edit Inspection</h2>
      <Form layout="vertical" onValuesChange={(_, values) => handleChange(values)}>
        <Form.Item label="Note" name="note">
          <Input.TextArea rows={3} value={data.note} />
        </Form.Item>

        <Form.Item label="Price" name="price">
          <Input type="number" value={data.price} min={0} max={100000} step={0.01} />
        </Form.Item>

        <Form.Item label="Date/Time" name="dateTime">
          <DatePicker
            showTime
            value={data.dateTime ? dayjs(data.dateTime) : null}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item label="Sampling Point" name="samplingPoint">
          <Checkbox.Group
            options={['Front End', 'Back End', 'Other']}
            value={data.samplingPoint}
            onChange={(val) => handleChange({ samplingPoint: val })}
          />
        </Form.Item>

        <Form.Item>
          <Button onClick={() => navigate(`/result/${id}`)} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditResult;
