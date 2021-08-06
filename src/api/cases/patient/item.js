import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";


export function listItem(query,patientId) {
  return request({
    url: '/cases/patient/item/' + patientId,
    method: 'get',
    params: query
  })
}

export function getItem(patientId,itemId) {
  return request({
    url: '/cases/patient/item/getInfo',
    method: 'get',
    params: {patientId,itemId}
  })
}



export function addOrUpdateItem(data) {
  return request({
    url: '/cases/patient/item',
    method: 'post',
    data: data
  })
}

export function addItem(data) {
  return request({
    url: '/cases/patient/item',
    method: 'post',
    data: data
  })
}
export function updateItem(data) {
  return request({
    url: '/cases/patient/item',
    method: 'put',
    data: data
  })
}

export function delItem(patientId,itemId) {
  return request({
    url: '/cases/patient/item/delete',
    method: 'delete',
    params: {patientId,itemId}
  })
}

export function exportItem(query) {
  return request({
    url: '/cases/patient/item/export',
    method: 'get',
    params: query
  })
}
