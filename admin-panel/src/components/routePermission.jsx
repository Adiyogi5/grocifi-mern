import React, { ComponentType } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AccessDenied from '../routes/admin/errors/permissionDenied';

export const routePermission =  (Component , module = "", action = "view") => {
    return (props) => {
      
        const admin = useSelector(store => store.admin);
        if (!admin.roleId) {
          return <Component {...props} />;
        }
       
        const permissions = useSelector(store => store.admin.permissions);
        let defaultModul = ['Dashboard']

        if(defaultModul.includes(module)){
            <Component {...props} />
        }
        if (module !== "" && permissions[module] && permissions[module][`can_${action}`] !== undefined) {
          return permissions[module][`can_${action}`] ? <Component {...props} /> : <AccessDenied {...props} />;
        }
        return   <AccessDenied {...props} />
        // return <Navigate to="/admin/permissionDenied" />;
    };

};

