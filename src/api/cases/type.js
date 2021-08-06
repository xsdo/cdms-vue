import request from '@/utils/request'


export function listType(query) {
  return request({
    url: '/cases/question/type/list',
    method: 'get',
    params: query
  })
}
//查询问答类型下拉树结构
export function treeselect() {
  return request({
    url: '/cases/question/type/treeselect',
    method: 'get'
  })
}
export function getType(id) {
  return request({
    url: '/cases/question/type/' + id,
    method: 'get'
  })
}

export function addType(data) {
  return request({
    url: '/cases/question/type',
    method: 'post',
    data: data
  })
}

export function updateType(data) {
  return request({
    url: '/cases/question/type',
    method: 'put',
    data: data
  })
}

export function delType(id) {
  return request({
    url: '/cases/question/type/' + id,
    method: 'delete'
  })
}

export function exportType(query) {
  return request({
    url: '/cases/question/type/export',
    method: 'get',
    params: query
  })
}
