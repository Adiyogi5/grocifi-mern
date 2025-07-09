
const RoleModel = require('../models/Role');
const RolePermissionModel = require('../models/RolePermission');
const language = require('../languages/english');
const mongodb = require('mongodb');

exports.create = async (req, res) => {
    try {
        const role = await RoleModel.create(req.body);
        return res.successInsert(role);
    } catch (error) {
        return res.someThingWentWrong(error);
    }
}

exports.list_json = async (req, res) => {
    try {
        const { limit = 10, pageNo = 1, query = '', orderBy = 'name', orderDirection = -1 } = req.query;
        const skip = (pageNo - 1) * limit;
        const sortOrder = orderDirection === '1' ? 1 : -1;
        
        const searchFilter = {};
        searchFilter["$and"] = [{ deletedAt: null }];
       
        if(query){
            searchFilter["$or"] = [];
            searchFilter["$or"].push({ name: { $regex: query, $options: 'i' } });
        }
       
        const totalCount = await RoleModel.countDocuments(searchFilter);

        // Fetch banners with pagination, sorting, and filtering
        const roles = await RoleModel.find(searchFilter)
            .skip(skip)
            .limit(Number(limit))
            .sort({ [orderBy]: sortOrder });

        return res.pagination(roles,totalCount,limit, pageNo );
    } catch (error) {
        return res.datatableNoRecords();
    }
}

exports.list = async (req, res) => {
    try {
        const roles = await RoleModel.find({ deletedAt: null }).sort({ ['name']: 1 });
        if (roles.length === 0) return res.noRecords();
        return res.success(roles);
    } catch (error) {
        return res.someThingWentWrong(error);
    }
}

exports.getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await RoleModel.findById(id);
        if (!role)  return res.noRecords();
        return res.success(role);
    } catch (error) {
        return res.someThingWentWrong(error);
    }
}

exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(req.body)
        const role = await RoleModel.findById(id);
        if (!role) return res.noRecords(); 
        const result = await role.updateOne(req.body);
        return res.successUpdate(result);
    } catch (error) {
        return res.someThingWentWrong(error);
    }
}

exports.role_permission = async (req, res) => {
    try {
        let where = { roleId: new mongodb.ObjectId(req.params.id) };
        const rolePermission = await RolePermissionModel.find(where);

        if (rolePermission.length === 0) {
            return res.noRecords(); // Assuming this method sends an appropriate "no records" response
        }
       
        const modifiedRolePermission = rolePermission.reduce((acc, item) => {
            acc[item.module] = item;
            return acc;
        }, {});
   
        return res.success(modifiedRolePermission);
    } catch (error) {
        return res.someThingWentWrong(error);
    }
}

exports.updateRolePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const { module, permissions } = req.body;
      
        const where = { roleId: new mongodb.ObjectId(id), module };
        let rolePermission = await RolePermissionModel.findOne(where);
        if (rolePermission) {
            rolePermission = await RolePermissionModel.updateOne(
                where,
                {
                    $set: {
                        all: permissions.all,
                        can_add: permissions.can_add,
                        can_edit: permissions.can_edit,
                        can_delete: permissions.can_delete,
                        can_view: permissions.can_view,
                        can_export: permissions.can_export,
                        can_import: permissions.can_import,
                        description: permissions.description,
                    },
                },
                { new: true }
            );
        } else {
            rolePermission = await RolePermissionModel.create({
                roleId: id,
                module,
                ...permissions,
            });
        }
      
      return res.successUpdate(rolePermission,language.PERMISSION_UPDATEDED_SUCCESSFULLY);
    } catch (error) {
        return res.someThingWentWrong(error);
    }
}

