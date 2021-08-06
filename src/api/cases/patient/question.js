import request from '@/utils/request'

export function listQuestion(query) {
  return request({
    url: '/cases/question/list',
    method: 'get',
    params: query
  })
}

export function getQuestion(id) {
  return request({
    url: '/cases/question/' + id,
    method: 'get'
  })
}

export function addQuestion(data) {
  return request({
    url: '/cases/question',
    method: 'post',
    data: data
  })
}

export function updateQuestion(data) {
  return request({
    url: '/cases/question',
    method: 'put',
    data: data
  })
}

export function delQuestion(id) {
  return request({
    url: '/cases/question/' + id,
    method: 'delete'
  })
}

export function exportQuestion(query) {
  return request({
    url: '/cases/question/export',
    method: 'get',
    params: query
  })
}
