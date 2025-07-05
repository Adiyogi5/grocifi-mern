
import {  useSelector } from 'react-redux';

const PermissionBlock = ({ module = "", action = "view", children }) => {
    const admin = useSelector(store => store.admin);
    if(!admin.roleId){
        return children;
    }
    const permissions = useSelector(store => store.admin.permissions);
   
    if (typeof permissions === 'object' && permissions !== null) {
        
        if (module === true) {
            return children;
        } else if(module !== ""){
            if (permissions[module] && permissions[module][`can_${action}`] !== undefined) {
                return (permissions[module][`can_${action}`] === true) ? children : null;
            }
        }else{
            return null
        }
    }
    return null;

}

export default PermissionBlock