import customaxios from "../axios";

async function registerOrLogin({ token }) {
    let res = await customaxios.post('auth', { googleid: token })
    return res.data;
}

async function addUpdateFriend({status, sender, receiver }) {
    let res = await customaxios.post('auth', { status: status==='reject'?"rejected":"accepted",
    })
    return res.data;
}


export {registerOrLogin}