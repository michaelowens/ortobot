import api from './index'

export const getUser = async (token) => {
  const res = await api.post(`auth`, { json: { token } }).json()
  return res
}
