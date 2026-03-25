import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPearConfig26335, getPearConfig45397 } from '@/services/api';

const fetchData26335 = async () => {
  const response = await fetch('https://d1y1q88l9efen2.cloudfront.net/as/common-static/pear/prod/10000000833.json?t=1772679489240');
  const data = await response.json();
  return data;
}

const fetchData45397 = async () => {
  const response = await fetch('https://d1y1q88l9efen2.cloudfront.net/as/common-static/pear/prod/10000000818.json?t=1772682007780');
  const data = await response.json();
  return data;
}

const RequestRQ = ({ demoName }: { demoName: string }) => {
  const { data: data26335, isLoading: isLoading26335, error: error26335, isSuccess: isSuccess26335, status: status26335 } = useQuery({
    queryKey: ['data26335'],
    queryFn: fetchData26335,
    // 控制请求是否执行
    enabled: true,
    // 缓存时间
    staleTime: 0,
    // 失败重试次数
    retry: 3,
    // 失败重试延迟时间
    retryDelay: 1000,
    // 窗口重新聚焦时重新获取
    refetchOnWindowFocus: true,
    // 初始数据
    initialData: { cn: { lang: 'cn' } },
  });

  const { data: data45397, isLoading: isLoading45397, error: error45397 } = useQuery({
    queryKey: ['data45397'],
    queryFn: fetchData45397,
    enabled: !!data26335,
  });

  console.log('data26335', data26335);
  console.log('isLoading26335', isLoading26335);
  console.log('error26335', error26335);
  console.log('isSuccess26335', isSuccess26335);
  console.log('status26335', status26335);

  const formatData = (data: any) => {
    return JSON.stringify(data.cn, null, 2);
  }

  return (
    <div>
      <h1>{demoName}</h1>
      {isLoading26335 && <p>Loading...</p>}
      {error26335 && <p>Error: {error26335.message}</p>}
      {data26335 && <p>Data: {formatData(data26335)}</p>}
      {isLoading45397 && <p>Loading...</p>}
      {error45397 && <p>Error: {error45397.message}</p>}
      {data45397 && <p>Data: {formatData(data45397)}</p>}
    </div>
  )
}

export default RequestRQ;

// 功能	手写实现代码量	常见问题	React Query
// 请求状态管理	30-50行	忘记清理、竞态	✅ 自动处理
// 缓存	50-100行	缓存策略难设计	✅ 内置
// 重试机制	20-30行	容易死循环	✅ 配置即可
// 窗口刷新	20行	容易漏实现	✅ 默认开启
// 乐观更新	50行+	回滚复杂	✅ 内置模式
// 分页缓存	100行+	容易乱	✅ useInfiniteQuery
// 合计	~300行	容易出bug	✅ 零代码