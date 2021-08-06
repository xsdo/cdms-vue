import request from '@/utils/request'

export function listPatient(query) {
  return request({
    url: '/cases/patient/list',
    method: 'get',
    params: query
  })
}

export function getPatient(id) {
  return request({
    url: '/cases/patient/' + id,
    method: 'get'
  })
}

export function addPatient(data) {
  return request({
    url: '/cases/patient',
    method: 'post',
    data: data
  })
}

export function updatePatient(data) {
  return request({
    url: '/cases/patient',
    method: 'put',
    data: data
  })
}

export function delPatient(id) {
  return request({
    url: '/cases/patient/' + id,
    method: 'delete'
  })
}

export function exportPatient(query) {
  return request({
    url: '/cases/patient/export',
    method: 'get',
    params: query
  })
}

export function listNation(query) {
  return request({
    url: '/cases/patient/nationList',
    method: 'get',
    params: query
  })
}

