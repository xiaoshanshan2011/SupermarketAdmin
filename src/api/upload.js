import request from '@/utils/request'

// App直传阿里云OSS获取tocken
export function getOssToken() {
  return request({
    url: '/aliyun/oss/app/tocken',
    method: 'get'
  })
}

// Web 直传阿里云OSS获取签名policyt
export function getWebOssToken() {
  return request({
    url: '/aliyun/oss/web/policy',
    method: 'get'
  })
}
