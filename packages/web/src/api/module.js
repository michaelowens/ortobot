import api from './index'

export const enable = async (name) => {
  const res = await api.post(`module/${name}/enable`).json()
  return res
}

export const disable = async (name) => {
  const res = await api.post(`module/${name}/disable`).json()
  return res
}
