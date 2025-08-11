import { toast } from "react-toastify";



export const showToast = (type, msg) => {
    switch(type){
        case 'SUCCESS':
            toast.success(msg, {
                position: "top-right"
            })
        break;
        case 'ERROR':
            toast.error(msg, {
                position: "top-right"
            })
        break;
        default: return false
    }
}