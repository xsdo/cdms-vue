import request from '@/utils/request'

export function listLearning(query) {
  return request({
    url: '/learning/learning/list',
    method: 'get',
    params: query
  })
}
export function treeselect() {
  return request({
    url: '/learning/learning/treeselect',
    method: 'get'
  })
}
export function getLearning(learningId) {
  return request({
    url: '/learning/learning/' + learningId,
    method: 'get'
  })
}

export function addLearning(data) {
  return request({
    url: '/learning/learning',
    method: 'post',
    data: data
  })
}

export function updateLearning(data) {
  return request({
    url: '/learning/learning',
    method: 'put',
    data: data
  })
}

export function delLearning(learningId) {
  return request({
    url: '/learning/learning/' + learningId,
    method: 'delete'
  })
}

export function exportLearning(query) {
  return request({
    url: '/learning/learning/export',
    method: 'get',
    params: query
  })
}
