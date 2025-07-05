import React, { useState ,useCallback,useEffect} from 'react';
import { Link ,useParams, useNavigate}  from 'react-router-dom';
import permission_modul from "../../../data/permission_modul";
import AxiosHelper from '../../../helper/AxiosHelper';
import { toast } from 'react-toastify';
import Loader from '../../../components/Admin/Loader';


const permissionSubadmin = () => {
    const navigate = useNavigate()
    const [permissions, setPermissions] = useState(permission_modul);
    const [admin, setAdmin] = useState({});
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getUserPermission = useCallback(async () => {
        try {

            setLoading(true);
            const userData = await AxiosHelper.getData(`subadmin/${id}`);
            if (userData?.data?.status === true) {
                let Subadmin = userData?.data?.data 
                setAdmin(Subadmin)
                const { data } = await AxiosHelper.getData(`subadmin_permission/${Subadmin._id}`);

                if (data?.status === true) {
                
                    let permissionData = data?.data;
                    const rolePermissions = permissions.map((module, i) => {
                        return {
                            ...module,
                            all: permissionData[module.module]?.all || false,
                            view: permissionData[module.module]?.can_view || false,
                            add: permissionData[module.module]?.can_add || false,
                            delete: permissionData[module.module]?.can_delete || false,
                            edit: permissionData[module.module]?.can_edit || false,
                            export: permissionData[module.module]?.can_export || false,
                            import: permissionData[module.module]?.can_import || false,
                        };
                    });
                    setPermissions(rolePermissions);
                }
            }else{
                navigate('/admin/subamdin');
            }

        } catch (error) {
            setError(error.message);
            toast.error('An error occurred while fetching data');
        } finally {
            setLoading(false); // Set loading to false when the request finishes
        }
    }, [id]);

    useEffect(() => { getUserPermission() }, [])

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div>Error: {error}</div>; // Optionally show an error message if something goes wrong
    }

    // Function to handle permission checkbox changes
    const onPermissionChange = async (module, field) => {
        const updatedPermissions = permissions.map((permission) => {
            if (permission.module === module) {
                // Handle "All" checkbox logic
                if (field === 'all') {
                    const newValue = !permission.all;
                    return {
                        ...permission,
                        all: newValue,
                        view: newValue,
                        add: newValue,
                        edit: newValue,
                        delete: newValue,
                        import: newValue,
                        export: newValue,
                        
                    };
                }
                // Handle individual checkbox logic
                const updatedPermission = { ...permission, [field]: !permission[field] };
                const allChecked =
                    updatedPermission.view &&
                    updatedPermission.add &&
                    updatedPermission.edit &&
                    updatedPermission.import &&
                    updatedPermission.export &&
                    updatedPermission.delete;
                return { ...updatedPermission, all: allChecked };
            }
            return permission;
        });
    
        setPermissions(updatedPermissions);

        const updatedModule = updatedPermissions.find((perm) => perm.module === module);

        try {
            // Make API call to update permissions
            const response = await AxiosHelper.postData(`update_subadmin_permission/${id}`, {
                module,
                permissions: {
                    all: updatedModule.all,
                    can_view: updatedModule.view,
                    can_add: updatedModule.add,
                    can_edit: updatedModule.edit,
                    can_delete: updatedModule.delete,
                    can_export: updatedModule.export,
                    can_import: updatedModule.import,
                },
            });
    
            if (response?.data?.status) {
                toast.success(response?.data?.message);
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-3">
                        <div className="card-header">
                            <div className="row flex-between-end">
                                <div className="col-auto align-self-center">
                                    <h5 className="mb-0" data-anchor="data-anchor">
                                        Manage Permission :: {admin.name} Permission List
                                    </h5>
                                </div>
                                <div className="col-auto ms-auto">
                                    <div className="mt-2" role="tablist">
                                        <Link to={`admin/dashboard`} className="me-2 btn btn-sm btn-falcon-default">
                                            <i className="fa fa-home me-1"></i>
                                            <span className="d-none d-sm-inline-block ms-1">Dashboard</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="tab-content">
                                <div id="tableExample2" data-list="">
                                    <div className="table-responsive1 ">
                                        <table className="table table-bordered table-striped  fs--1 mb-0 ">
                                            <thead>
                                                <tr className='bg-secondary text-white'>
                                                    <th>Module</th>
                                                    <th>All</th>
                                                    <th>View</th>
                                                    <th>Add</th>
                                                    <th>Edit</th>
                                                    <th>Delete</th>
                                                    <th>Export</th>
                                                    <th>Import</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {permissions.map((permission, index) => (
                                                    <tr key={index}>
                                                        <td>{permission.module}</td>
                                                        <td className=''>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input fs-1" type="checkbox"  checked={permission.all} onChange={() => onPermissionChange(permission.module, 'all')}/>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input fs-1" type="checkbox"  checked={permission.view} onChange={() => onPermissionChange(permission.module, 'view')}/>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input fs-1" type="checkbox"  checked={permission.add} onChange={() => onPermissionChange(permission.module, 'add')}/>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input fs-1" type="checkbox"  checked={permission.edit} onChange={() => onPermissionChange(permission.module, 'edit')}/>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input fs-1" type="checkbox"  checked={permission.delete} onChange={() => onPermissionChange(permission.module, 'delete')}/>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input fs-1" type="checkbox"  checked={permission.export} onChange={() => onPermissionChange(permission.module, 'export')}/>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input fs-1" type="checkbox"  checked={permission.import} onChange={() => onPermissionChange(permission.module, 'import')}/>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default permissionSubadmin;
