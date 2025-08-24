import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export const getStandards = () => api.get('/standard');

export const getHistory = (params?: { 
  id?: string; 
  fromDate?: string; 
  toDate?: string; 
  page?: number; 
  limit?: number; 
}) => {
  let url = '/history';
  if (params) {
    const query = new URLSearchParams();
    if (params.id) query.append('id', params.id);
    if (params.fromDate) query.append('fromDate', params.fromDate);
    if (params.toDate) query.append('toDate', params.toDate);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    url += `?${query.toString()}`;
  }
  return api.get(url);
};



export const getHistoryById = (id: string) => api.get(`/history/${id}`);

export const createHistory = (data: any) => api.post('/history', data);
export const updateHistory = (id: string, data: any) => api.put(`/history/${id}`, data);
export const deleteHistory = (ids: string[]) => {
  return api.delete('/history', {
    headers: { 'Content-Type': 'application/json' },
    data: { ids },
  });
};

export default api;
