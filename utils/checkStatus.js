const checkStatus = (response) => {
  if (response.ok) {
    return response;
  } else {
    return response.json().then((text) => {
      throw new Error(text.message);
    });
  }
};

export default checkStatus;
