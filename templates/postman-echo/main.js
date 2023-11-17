// This function runs during the card transaction authorization flow.
// It has a limited execution time, so keep any code short-running.
const beforeTransaction = async (authorization) => {
  console.log(authorization);

  const apiEndpoint = 'https://postman-echo.com/get?foo1=bar1&foo2=bar2';

  const response = await fetch(apiEndpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const json = await response.json();
  if (json.args.foo) {
    return true;
  } else {
    return false;
  }
};
