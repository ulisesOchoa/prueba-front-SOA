import { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

import AuthService from "./services/auth.service";
import IUser from "./types/user.type";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardTask from "./components/board-task.component";
import BoardTaskEdit from "./components/board-task-edit.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";

import EventBus from "./common/EventBus";

type Props = {};

type State = {
	showModeratorBoard: boolean;
	showAdminBoard: boolean;
	currentUser: IUser | undefined;
};

class App extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.logOut = this.logOut.bind(this);

		this.state = {
			showModeratorBoard: false,
			showAdminBoard: false,
			currentUser: undefined,
		};
	}

	componentDidMount() {
		const user = AuthService.getCurrentUser();

		if (user) {
			const superAdmin = user.roles.some((rol: any) => rol.name === "superAdmin");
			const moderator = user.roles.some((rol: any) => rol.name === "moderator");
			
			this.setState({
				currentUser: user,
				showModeratorBoard: moderator ,
				showAdminBoard: superAdmin,
			});
		}

		EventBus.on("logout", this.logOut);
	}

	componentWillUnmount() {
		EventBus.remove("logout", this.logOut);
	}

	logOut() {
		AuthService.logout();
		this.setState({
			showModeratorBoard: false,
			showAdminBoard: false,
			currentUser: undefined,
		});
	}

	render() {
		const { currentUser, showModeratorBoard, showAdminBoard } = this.state;

		return (
			<div>
				<nav className="navbar navbar-expand navbar-dark bg-dark">
					<Link to={"/"} className="navbar-brand">
						SOA
					</Link>
					<div className="navbar-nav mr-auto">
						<li className="nav-item">
							<Link to={"/home"} className="nav-link">
								Inicio
							</Link>
						</li>

						{showModeratorBoard && (
							<li className="nav-item">
								<Link to={"/mod"} className="nav-link">
									Tablero de moderador
								</Link>
							</li>
						)}

						{showAdminBoard && (
							<li className="nav-item">
								<Link to={"/admin"} className="nav-link">
									Tablero de administrador
								</Link>
							</li>
						)}

						{currentUser && (
							<li className="nav-item">
								<Link to={"/user"} className="nav-link">
									Usuarios
								</Link>
							</li>
						)}

						{currentUser && (
							<li className="nav-item">
								<Link to={"/task"} className="nav-link">
									Tareas
								</Link>
							</li>
						)}
					</div>

					{currentUser ? (
						<div className="navbar-nav ml-auto">
							<li className="nav-item">
								<Link to={"/profile"} className="nav-link">
									Perfil: {currentUser.name}
								</Link>
							</li>
							<li className="nav-item">
								<a
									href="/login"
									className="nav-link"
									onClick={this.logOut}
								>
									LogOut
								</a>
							</li>
						</div>
					) : (
						<div className="navbar-nav ml-auto">
							<li className="nav-item">
								<Link to={"/login"} className="nav-link">
									Login
								</Link>
							</li>

							<li className="nav-item">
								<Link to={"/register"} className="nav-link">
									Sign Up
								</Link>
							</li>
						</div>
					)}
				</nav>

				<div className="container mt-3">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/home" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/user" element={<BoardUser />} />
						<Route path="/task" element={<BoardTask />} />
						<Route path="/task/edit/:id" element={<BoardTaskEdit />} />
						<Route path="/mod" element={<BoardModerator />} />
						<Route path="/admin" element={<BoardAdmin />} />
					</Routes>
				</div>

				{/*<AuthVerify logOut={this.logOut}/> */}
			</div>
		);
	}
}

export default App;
