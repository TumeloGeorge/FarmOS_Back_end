const service = require('./farm.service');

exports.createFarm = async (req, res, next) => {
    try {
        const farm = await service.createFarm(req.user.user_id, req.body);
        res.status(201).json(farm);
    } catch (err) {
        next(err);
    }
};

exports.getFarms = async (req, res, next) => {
    try {
        const farms = await service.getUserFarms(req.user.user_id);
        res.json(farms.rows);
    } catch (err) {
        next(err);
    }
};

exports.addMember = async (req, res, next) => {
    try {
        await service.addMember(req.params.id, req.body);
        res.json({ message: 'Member added' });
    } catch (err) {
        next(err);
    }
};

exports.getMembers = async (req, res, next) => {
    try {
        const members = await service.getFarmMembers(req.params.id);
        res.json(members.rows);
    } catch (err) {
        next(err);
    }
};

exports.removeMember = async (req, res, next) => {
    try {
        await service.removeMember(req.params.id, req.params.userId);
        res.json({ message: 'Member removed' });
    } catch (err) {
        next(err);
    }
};