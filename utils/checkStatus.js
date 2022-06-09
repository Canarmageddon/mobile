const checkStatus = (response) => {
  if(response.ok) {
    return response;
  } else {
    return response.json().then((text) => {
      let errorMessage = '';
      for(let prop in text){
        errorMessage += text[prop] + '/ ';
      }
      throw new Error(errorMessage);
    });
  }
};

export default checkStatus;
