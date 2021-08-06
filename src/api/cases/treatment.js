import request from '@/utils/request'

export function listTreatment(query) {
  return request({
    url: '/cases/treatment/list',
    method: 'get',
    params: query
  })
}
export function treeselect() {
  return request({
    url: '/cases/treatment/treeselect',
    method: 'get'
  })
}
export function getTreatment(treatmentId) {
  return request({
    url: '/cases/treatment/' + treatmentId,
    method: 'get'
  })
}

export function addTreatment(data) {
  return request({
    url: '/cases/treatment',
    method: 'post',
    data: data
  })
}

export function updateTreatment(data) {
  return request({
    url: '/cases/treatment',
    method: 'put',
    data: data
  })
}

export function delTreatment(treatmentId) {
  return request({
    url: '/cases/treatment/' + treatmentId,
    method: 'delete'
  })
}

export function exportTreatment(query) {
  return request({
    url: '/cases/treatment/export',
    method: 'get',
    params: query
  })
}
