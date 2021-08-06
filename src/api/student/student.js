import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

export function listStudent(query) {
  return request({
    url: '/student/student/list',
    method: 'get',
    params: query
  })
}

export function getStudent(id) {
  return request({
    url: '/student/student/' + praseStrEmpty(id),
    method: 'get'
  })
}

export function addStudent(data) {
  return request({
    url: '/student/student',
    method: 'post',
    data: data
  })
}

export function updateStudent(data) {
  return request({
    url: '/student/student',
    method: 'put',
    data: data
  })
}

export function delStudent(id) {
  return request({
    url: '/student/student/' + id,
    method: 'delete'
  })
}

export function exportStudent(query) {
  return request({
    url: '/student/student/export',
    method: 'get',
    params: query
  })
}
export function importStudent(file) {
  return request({
    url: '/student/student/import',
    method: 'post',
    params: file
  })
}
export function importTemplate() {
  return request({
    url: '/student/student/importTemplate',
    method: 'get',
  })
}

// 用户密码重置
export function resetStuPwd(id, password) {
  const data = {
    id,
    password
  }
  return request({
    url: '/student/student/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeStuStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/student/student/changeStatus',
    method: 'put',
    data: data
  })
}
