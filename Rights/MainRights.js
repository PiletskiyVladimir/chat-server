const mongoose = require('../Config/database');
const User = mongoose.model('User');
const {handle} = require('../Utils/utils');

const
    ACCESS_DENIED_ERROR = 'ACCESS DENIED',
    USER_NOT_FOUND_ERROR = 'USER WAS NOT FOUND',
    USER_NOT_INITIALIZED = 'USER IS NOT INITIALIZED',
    ENTITY_NOT_INITIALIZED = 'ENTITY IS NOT INITIALIZED'

class Rights {
    id;
    user;
    entity;
    status;

    constructor(id, user, entity) {
        this.id = id;
        this.user = user;

        this.entity = entity;

        this.status = user ? user.role : null;
    }

    async initializeUser() {
        let [user, userError] = await handle(User.findById(this.id).lean().exec());

        if (userError) throw Error(userError);

        if (!user) throw Error(USER_NOT_FOUND_ERROR);

        this.user = user;
        this.status = user.role;
    }

    async whatCanRead(ids) {
        let result = [];
        if (this.user.role === 'user') {
            let [unhiddenUsers, unhiddenUsersError] = await handle(User.find({hidden: false}).lean().exec());

            if (unhiddenUsersError) return {message: unhiddenUsersError, status: 500, can: false}

            result = unhiddenUsers.map(el => el._id);

            if (ids && ids.length > 0) {
                let checked = true;

                ids.forEach(el => {
                    if (result.indexOf(el) === -1) checked = false;
                })

                if (!checked) {
                    return null;
                } else {
                    return ids;
                }
            } else {
                return result;
            }
        } else {
            return ids;
        }
    }

    async checkRights(field) {
        if (!this.user) return {
            status: 500,
            can: false,
            message: USER_NOT_INITIALIZED
        }

        if (!this.entity) return {
            status: 500,
            can: false,
            message: ENTITY_NOT_INITIALIZED
        }

        switch (field) {
            case 'read': {
                if (this.user.role === 'user' && this.entity.hidden && this.id !== this.entity.id) return {
                    status: 403,
                    can: false,
                    message: ACCESS_DENIED_ERROR
                }
                else return {status: 200, can: true, message: null}
            }
            case 'delete':
            case 'change': {
                if (this.user.role === 'user' && this.user._id !== this.entity._id) {
                    return {
                        can: false,
                        status: 403,
                        message: ACCESS_DENIED_ERROR
                    }
                } else return {
                    can: true,
                    status: 200,
                    message: null
                }
            }
            case 'block':
            case 'unblock': {
                let can = this.user.role === 'admin';

                return {
                    can,
                    status: can ? null : 403,
                    message: ACCESS_DENIED_ERROR
                }
            }
        }
    }
}

module.exports = Rights;