import api from './index'

export const all = async () => {
  return await api('modules').json()
}

export const enable = async (name) => {
  return await api.post(`module/${name}/enable`).json()
}

export const disable = async (name) => {
  return await api.post(`module/${name}/disable`).json()
}
