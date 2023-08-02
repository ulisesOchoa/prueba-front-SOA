import IUser from "./user.type";

export default interface ITask {
	id?: any | null;
	name?: string;
	description?: string | null;
	priority?: string;
	assigned_to?: IUser;
}
