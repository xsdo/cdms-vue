import request from '@/utils/request'

export function listBasis(query) {
  return request({
    url: '/cases/basis/list',
    method: 'get',
    params: query
  })
}

export function getBasis(id) {
  return request({
    url: '/cases/basis/' + id,
    method: 'get'
  })
}

export function addBasis(data) {
  return request({
    url: '/cases/basis',
    method: 'post',
    data: data
  })
}

export function updateBasis(data) {
  return request({
    url: '/cases/basis',
    method: 'put',
    data: data
  })
}

export function delBasis(id) {
  return request({
    url: '/cases/basis/' + id,
    method: 'delete'
  })
}

export function exportBasis(query) {
  return request({
    url: '/cases/basis/export',
    method: 'get',
    params: query
  })
}