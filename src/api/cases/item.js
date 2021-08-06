import request from '@/utils/request'

export function listItem(query) {
  return request({
    url: '/cases/item/list',
    method: 'get',
    params: query
  })
}

export function getItem(itemId) {
  return request({
    url: '/cases/item/' + itemId,
    method: 'get'
  })
}

export function addItem(data) {
  return request({
    url: '/cases/item',
    method: 'post',
    data: data
  })
}

export function updateItem(data) {
  return request({
    url: '/cases/item',
    method: 'put',
    data: data
  })
}

export function delItem(itemId) {
  return request({
    url: '/cases/item/' + itemId,
    method: 'delete'
  })
}

export function exportItem(query) {
  return request({
    url: '/cases/item/export',
    method: 'get',
    params: query
  })
}
//查询检查项目下拉树结构
export function treeselect(query) {
  return request({
    url: '/cases/item/treeselect',
    method: 'get',
    params:query
  })
}
