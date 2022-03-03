const checkStatus = (response) => {
    if (response.ok) {
        return response;
    } else {
        return response.text()
        .then((text) => {
            throw new Error(text);
        });
    }
}

export default checkStatus;