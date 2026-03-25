self.onmessage = (e) => {
  console.log('worker接收到数据', e.data);
  const raw = e.data;
  const processed = raw
    .filter((item: any) => item.active)
    .map((item: any) => ({...item, fullName: `${item.first} ${item.last}`}))
    .sort((a: any, b: any) => b.score - a.score);
  self.postMessage({ processedData: processed });
}