import React, { useState, useEffect } from 'react';

const Request = ({ demoName }: { demoName: string }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatData = (data: any) => {
    return JSON.stringify(data, null, 2);
  }

  useEffect(() => {
    console.log('useEffect');
    setIsLoading(true);
    fetch('https://d1y1q88l9efen2.cloudfront.net/as/common-static/pear/prod/10000000833.json?t=1772679489240')
      .then(response => response.json())
      .then((data) => {
        setData(data);
        console.log(data);
      })
      .catch(error => setError(error))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1>{demoName}</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Data: {formatData(data)}</p>}
    </div>
  )
}

export default Request;