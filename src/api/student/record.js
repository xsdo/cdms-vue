import request from '@/utils/request'

export function listRecord(query) {
  return request({
    url: '/student/record/list',
    method: 'get',
    params: query
  })
}

export function getRecord(id) {
  return request({
    url: '/student/record/' + id,
    method: 'get'
  })
}

export function addRecord(data) {
  return request({
    url: '/student/record',
    method: 'post',
    data: data
  })
}

export function updateRecord(data) {
  return request({
    url: '/student/record',
    method: 'put',
    data: data
  })
}

export function delRecord(id) {
  return request({
    url: '/student/record/' + id,
    method: 'delete'
  })
}

export function exportRecord(query) {
  return request({
    url: '/student/record/export',
    method: 'get',
    params: query
  })
}