import customaxios from "../axios";

async function createPost({ data }) {
    let res = await customaxios.post('post',data)
    return res.data;
}
async function updatePost({ data, id}) {
    let res = await customaxios.patch(`post/${id}`,data)
    return res.data;
}
async function removePost({ data, id }) {
    let res = await customaxios.delete(`post/${id}`,data)
    return res.data;
}
async function getPosts() {
    let res = await customaxios.get(`post/`)
    return res.data;
}

export {createPost, updatePost, removePost, getPosts}