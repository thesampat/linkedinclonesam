import customaxios from "../axios";

async function getChats(id) {
    let res = await customaxios.get(`chat/${id}`)
    return res.data;
}

export {getChats}