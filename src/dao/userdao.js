'use strict';

function UserDAO() {
}

UserDAO.prototype.findById = function(id, callback) {
};

UserDAO.prototype.findByEmailAndPassword = function(email, password, callback) {
};

UserDAO.prototype.findByPhoneAndPassword = function(phone, password, callback) {
};

UserDAO.prototype.findByEmailAndPhoneAndPassword = function(email, phone, password, callback) {
};

UserDAO.prototype.findByEmail = function(email, callback) {
};

UserDAO.prototype.findByPhone = function(phone, callback) {
};

UserDAO.prototype.createUser = function(user) {
};

module.exports = UserDAO;