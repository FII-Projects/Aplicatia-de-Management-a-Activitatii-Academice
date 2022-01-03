import {UserAdminServiceInterface} from "./interface/user.admin.service.interface";
import {Responses, ServiceResponse} from "./service.response";
import {UserRepository} from "../database/repository/user.repository";
import {AuthToken, Id, User} from "../database/models";
import {JwtService} from "./jwt.service";
import {TablesRepository} from "../database/repository/tables.repository";

export class UserAdminService implements UserAdminServiceInterface {

    async getAllIds(): Promise<ServiceResponse> {
        const rows = await TablesRepository.allIds();
        return new ServiceResponse(true, Responses.SUCCESS, rows);
    }

    async addId(id: Id): Promise<ServiceResponse> {
        if (await TablesRepository.getIdByIdentifier(id.identifier)) {
            return new ServiceResponse(false, Responses.ID_ALREADY_EXISTS, null);
        }

        const rows = await TablesRepository.addId(id);
        return new ServiceResponse(true, Responses.SUCCESS, rows.length);
    }

    async removeId(id: Id): Promise<ServiceResponse> {
        if (!await TablesRepository.getIdByIdentifier(id.identifier)) {
            return new ServiceResponse(false, Responses.ID_NOT_EXISTS, null);
        }

        const rows = await TablesRepository.removeId(id);
        return new ServiceResponse(true, Responses.SUCCESS, rows.length);
    }

    async getAllUsers(authToken: AuthToken): Promise<ServiceResponse> {
        const user = await JwtService.verifyToken(authToken.token) as User;
        const users = await UserRepository.allUsersExcept(user.id);
        return new ServiceResponse(true, Responses.SUCCESS, users);
    }

    async activateUser(user: User): Promise<ServiceResponse> {
        const rows = await UserRepository.setUserActivationStatus(user, true);
        return new ServiceResponse(true, Responses.SUCCESS, rows.length);
    }

    async deactivateUser(user: User): Promise<ServiceResponse> {
        const rows = await UserRepository.setUserActivationStatus(user, false);
        return new ServiceResponse(true, Responses.SUCCESS, rows.length);
    }

    async makeUserAdmin(user: User): Promise<ServiceResponse> {
        const rows = await UserRepository.setUserAdminStatus(user, true);
        return new ServiceResponse(true, Responses.SUCCESS, rows.length);
    }

    async removeUserAdmin(user: User): Promise<ServiceResponse> {
        const rows = await UserRepository.setUserAdminStatus(user, false);
        return new ServiceResponse(true, Responses.SUCCESS, rows.length);
    }

    async removeUser(user: User): Promise<ServiceResponse> {
        const rows = await UserRepository.deleteUser(user);
        return new ServiceResponse(true, Responses.SUCCESS, rows.length);
    }
}