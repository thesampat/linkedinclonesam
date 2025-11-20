import { useSelector } from "react-redux"

const useGetLoginUser=()=>{
    return useSelector(state=>state.user)
}

export {useGetLoginUser}