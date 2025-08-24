import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  DatePicker,
  message,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";
import { getHistory, getHistoryById, deleteHistory } from "../api";
import type { InspectionHistory } from "../types";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

const HistoryPage: React.FC = () => {
  const [histories, setHistories] = useState<InspectionHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchId, setSearchId] = useState("");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const navigate = useNavigate();

  const fetchData = async (page = 1, pageSize = 10, additionalParams?: any) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: pageSize,
        ...additionalParams
      };

      console.log('Fetching data with params:', params);
      const res = await getHistory(params);
      
      const data = res.data.data.map((h: any) => ({
        ...h,
        price: parseFloat(h.price) || 0,
        inspectionResult: h.inspectionResult
          ? JSON.parse(h.inspectionResult)
          : { composition: [], defectRice: [] },
        standard: h.standardName ? { name: h.standardName } : undefined,
      }));
      
      setHistories(data);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: res.data.total || 0,
      });
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async () => {
    if (searchId) {
      try {
        const res = await getHistoryById(searchId);
        const data = {
          ...res.data,
          price: parseFloat(res.data.price) || 0,
          inspectionResult: res.data.inspectionResult
            ? JSON.parse(res.data.inspectionResult)
            : { composition: [], defectRice: [] },
          standard: res.data.standardName ? { name: res.data.standardName } : undefined,
        };
        setHistories([data]);
        setPagination({
          current: 1,
          pageSize: 10,
          total: 1,
        });
      } catch (err) {
        console.error(err);
        message.error("History not found");
        setHistories([]);
        setPagination({
          current: 1,
          pageSize: 10,
          total: 0,
        });
      }
    } else {
      const params: any = {};
      if (dateRange) {
        params.fromDate = dateRange[0].format("YYYY-MM-DD HH:mm:ss");
        params.toDate = dateRange[1].format("YYYY-MM-DD HH:mm:ss");
      }
      fetchData(1, pagination.pageSize, params);
    }
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    try {
      await deleteHistory(selectedRowKeys as string[]);
      message.success("Deleted successfully");
      setSelectedRowKeys([]);
      
      const currentParams: any = {};
      if (dateRange && !searchId) {
        currentParams.fromDate = dateRange[0].format("YYYY-MM-DD HH:mm:ss");
        currentParams.toDate = dateRange[1].format("YYYY-MM-DD HH:mm:ss");
      }
      
      if (searchId) {
        handleSearch(); 
      } else {
        fetchData(pagination.current, pagination.pageSize, currentParams);
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to delete");
    }
  };

  const handleClear = () => {
    setSearchId("");
    setDateRange(null);
    setSelectedRowKeys([]);
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData(1, pagination.pageSize);
  };

  const handleTableChange = (paginationConfig: any) => {
    console.log('Table pagination changed:', paginationConfig);
    
    const { current, pageSize } = paginationConfig;
    
  
    const params: any = {};
    if (dateRange && !searchId) {
      params.fromDate = dateRange[0].format("YYYY-MM-DD HH:mm:ss");
      params.toDate = dateRange[1].format("YYYY-MM-DD HH:mm:ss");
    }
    

    if (!searchId) {
      fetchData(current, pageSize, params);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text: string) => (
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate(`/result/${text}`)}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Create Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY HH:mm:ss"),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { 
      title: "Standard", 
      dataIndex: ["standard", "name"], 
      key: "standard", 
      render: (text: string) => text || "-" 
    },
    { 
      title: "Note", 
      dataIndex: "note", 
      key: "note", 
      render: (text: string) => text || "-" 
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Inspection History</h2>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="Search by ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onPressEnter={handleSearch}
          />
        </Col>
        <Col>
          <RangePicker
            showTime
            value={dateRange}
            onChange={(dates) => setDateRange(dates as any)}
          />
        </Col>
        <Col>
          <Button type="primary" onClick={handleSearch} loading={loading}>
            Search
          </Button>
        </Col>
        <Col>
          <Button onClick={handleClear} disabled={loading}>
            Clear
          </Button>
        </Col>
        <Col>
          <Button 
            danger 
            disabled={selectedRowKeys.length === 0 || loading} 
            onClick={handleDelete}
          >
            Delete Selected ({selectedRowKeys.length})
          </Button>
        </Col>
      </Row>

      <Table
        rowKey="id"
        loading={loading}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        columns={columns}
        dataSource={histories}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} items`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default HistoryPage;