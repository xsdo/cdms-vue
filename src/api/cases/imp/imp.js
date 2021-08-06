import request from '@/utils/request'

export function listImp(query) {
  return request({
    url: '/cases/imp/list',
    method: 'get',
    params: query
  })
}

export function getImp(impId) {
  return request({
    url: '/cases/imp/' + impId,
    method: 'get'
  })
}

export function addImp(data) {
  return request({
    url: '/cases/imp',
    method: 'post',
    data: data
  })
}

export function updateImp(data) {
  return request({
    url: '/cases/imp',
    method: 'put',
    data: data
  })
}

export function delImp(impId) {
  return request({
    url: '/cases/imp/' + impId,
    method: 'delete'
  })
}

export function exportImp(query) {
  return request({
    url: '/cases/imp/export',
    method: 'get',
    params: query
  })
}