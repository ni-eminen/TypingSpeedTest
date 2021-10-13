import axios from 'axios'
const baseUrl = "https://typingspeedserver.herokuapp.com/api/scores"

const create = newObject => {
    console.log("create kutsuttu");
    const request = axios.post(baseUrl, newObject)
    console.log("postattu");
    return request.then(response => response.data)
}

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const remove = (id) => {
    let request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const update = (id, newItem) => {
    let request = axios.put(`${baseUrl}/${id}`, newItem)
    return request.then(response => response.data)
}

const toExport = {create, getAll, remove, update}

export default toExport